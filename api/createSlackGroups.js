import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

export default async function handler(req, res) {
  if (req.body.groups.length === 0) {
    return res.status(200).json({ ok: true, createdGroups: [] });
  }

  try {
    const createdGroups = [];
    const batchSize = 10;
    const groups = req.body.groups;
    let currentBatch = 0;

    const processBatch = async (batchStart, batchEnd) => {
      const batchGroups = groups.slice(batchStart, batchEnd);

      const batchCreatedGroups = [];

      for (const group of batchGroups) {
        const memberSlackIds = group.members
          .map((member) => member.slackId)
          .filter(Boolean);

        const message = req.body.message;

        if (memberSlackIds.length < 2) {
          console.warn(
            `Group ${group.id} has too few members to create a chat.`
          );
          continue;
        }

        const result = await web.conversations.open({
          users: memberSlackIds.join(","),
        });

        if (result.ok) {
          await web.chat.postMessage({
            channel: result.channel.id,
            text: message,
          });

          batchCreatedGroups.push({
            groupId: group.id,
            channelId: result.channel.id,
          });
        } else {
          console.error(
            `Failed to create chat for group ${group.id}:`,
            result.error
          );
        }
      }

      createdGroups.push(...batchCreatedGroups);

      if (batchEnd < groups.length) {
        setTimeout(() => {
          processBatch(batchEnd, batchEnd + batchSize);
        }, 1000);
      }
    };

    await processBatch(currentBatch, currentBatch + batchSize);

    res.status(200).json({ ok: true, createdGroups });
  } catch (error) {
    console.error("Error creating Slack group chats:", error);
    res.status(500).json({ error: error.message });
  }
}
