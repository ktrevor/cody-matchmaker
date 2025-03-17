import { WebClient } from "@slack/web-api";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Read the token from the environment variables
const token: string | undefined = process.env.SLACK_TOKEN;

// Ensure the token is defined before proceeding
if (!token) {
  throw new Error('Slack token is not defined. Please set the SLACK_TOKEN environment variable.');
}

// Initialize the Slack client
const web = new WebClient(token);

// Type definitions for Slack API responses
interface User {
  id: string;
  name: string;
}

interface ConversationsOpenResponse {
  channel: {
    id: string;
  };
}

interface UsersListResponse {
  ok: boolean;
  members: User[];
  error?: string;
}

// Function to send a message to a Slack channel
async function sendMessageToChannel(channel: string, text: string): Promise<void> {
  try {
    const result = await web.chat.postMessage({
      channel: channel,
      text: text,
    });
    console.log('Message sent successfully:', result.ts);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Function to create a direct message (DM) with users and send a message
async function createDMWithUsers(userList: string[], message: string): Promise<void> {
  const users = userList.join(',');

  try {
    const res: ConversationsOpenResponse = await web.conversations.open({
      users: users,
    });

    const channelId = res.channel.id;
    console.log(`Group DM created with channel ID: ${channelId}`);

    // Send a message to the newly created DM channel
    const sendMessageRes = await web.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('Message sent: ', sendMessageRes);
  } catch (error) {
    console.error('Error creating DM or sending message:', error);
  }
}

// Function to fetch and log user IDs from Slack workspace
async function getUserIds(): Promise<void> {
  try {
    const res: UsersListResponse = await web.users.list();

    if (res.ok) {
      res.members.forEach((user) => {
        console.log(`User ID: ${user.id}, Username: ${user.name}`);
      });
    } else {
      console.error('Error fetching users:', res.error);
    }
  } catch (error) {
    console.error('Error fetching user list:', error);
  }
}

// Exporting functions to use in other files
export { sendMessageToChannel, createDMWithUsers, getUserIds };
