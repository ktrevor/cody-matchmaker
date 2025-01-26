import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Read the token from the environment variables or replace with your token
const token =
  process.env.SLACK_TOKEN ||
  "insert-secret-here";

// Initialize the Slack client
const web = new WebClient(token);

// Function to send a message to a channel
async function sendMessageToChannel(channel, text) {
  try {
    const result = await web.chat.postMessage({
      channel: channel,
      text: text,
    });

    console.log("Message sent successfully:", result.ts);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Replace 'general' with the name of your channel and 'Hello, world!' with your message

//note must invite bot on slack for it to be able to send messages to that channel
sendMessageToChannel("general", "Hello, world! Alicia says hiiiiiiiii");
