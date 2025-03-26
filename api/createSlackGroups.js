import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

export default async function handler(req, res) {
  if (req.body.groups.length === 0) {
    return res.status(200).json({ ok: true, createdGroups: [] });
  }

  try {
    const createdGroups = [];

    for (const group of req.body.groups) {
      const memberSlackIds = group.members
        .map((member) => member.slackId)
        .filter(Boolean);

      if (memberSlackIds.length < 2) {
        console.warn(
          `Skipping group due to insufficient members: ${JSON.stringify(group)}`
        );
        continue;
      }

      // Create a new Slack conversation (group chat)
      const result = await web.conversations.open({
        users: memberSlackIds.join(","),
      });

      if (result.ok) {
        createdGroups.push({ groupId: group.id, channelId: result.channel.id });
      } else {
        console.error(
          `Failed to create chat for group ${group.id}:`,
          result.error
        );
      }
    }

    res.status(200).json({ ok: true, createdGroups });
  } catch (error) {
    console.error("Error creating Slack group chats:", error);
    res.status(500).json({ error: error.message });
  }
}
