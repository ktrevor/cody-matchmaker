import axios from "axios";

// Type definitions for the response and user group
type SendMessageResponse = {
  ok: boolean;
  error?: string;
};

type DMChannelResponse = SendMessageResponse & {
  channel: {
    id: string;
  };
};

type DMResult = {
  group: string[];
  messageStatus: string;
};

// Function to send a message to Slack
export const sendMessageToSlack = async (message: string): Promise<string> => {
  const token = import.meta.env.VITE_SLACK_BOT_TOKEN;

  if (!token) {
    throw new Error("Slack bot token is missing!");
  }

  const channelId: string = "C12345678"; // Replace with the Slack channel ID where you want to send the message

  try {
    const response: SendMessageResponse = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channelId,  // Slack channel ID
        text: message,       // Message to send
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Slack OAuth token
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return "Message sent successfully!";
    } else {
      throw new Error(`Slack API Error: ${response.error}`);
    }
  } catch (error: any) {
    console.error("Error sending message to Slack:", error.response || error.message); // Log full error
    throw new Error(`Error sending message to Slack: ${error.message}`);
  }
};

// Function to create a DM with multiple groups of users and send a message
export const createDMsAndSendMessages = async (
  userGroups: string[][],
  message: string
): Promise<DMResult[]> => {
  const token = import.meta.env.VITE_SLACK_BOT_TOKEN; // Slack bot token from environment variables

  if (!token) {
    throw new Error("Slack bot token is missing!");
  }

  // This will store the results of each DM creation and message sending attempt
  const results: DMResult[] = [];

  try {
    for (const userGroup of userGroups) {
      // Join user IDs in the list into a string, separating with commas
      const users: string = userGroup.join(",");

      // Step 1: Create a new DM channel with the users
      const dmResponse: DMChannelResponse = await axios.post(
        "https://slack.com/api/conversations.open",
        {
          users: users, // Comma-separated list of user IDs
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Slack OAuth token
            "Content-Type": "application/json",
          },
        }
      );

      if (!dmResponse.ok) {
        console.error(`Error creating DM for group: ${userGroup}. Response:`, dmResponse);
        throw new Error(`Error creating DM for group: ${userGroup}. ${dmResponse.error}`);
      }

      // Step 2: Get the channel ID of the created DM
      const channelId: string = dmResponse.channel.id;

      // Step 3: Send the message to the newly created DM channel
      const sendMessageResponse: SendMessageResponse = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: channelId,  // The newly created DM channel ID
          text: message,       // Message to send
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Slack OAuth token
            "Content-Type": "application/json",
          },
        }
      );

      if (sendMessageResponse.ok) {
        results.push({
          group: userGroup,
          messageStatus: "Message sent successfully!",
        });
      } else {
        results.push({
          group: userGroup,
          messageStatus: `Failed to send message: ${sendMessageResponse.error}`,
        });
        console.error(`Failed to send message to DM: ${sendMessageResponse.error}`);
      }
    }

    return results;
  } catch (error: any) {
    console.error("Error during DM creation or message sending:", error.response || error.message); // Log full error
    throw new Error(`Error during DM creation or message sending: ${error.message}`);
  }
};



