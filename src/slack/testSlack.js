import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Read the token from the environment variables or replace with your token FOUND IN MESSENGER
const token = process.env.SLACK_TOKEN || "bot-token-here";

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

async function createDMWithUsers(userList, message) {
  // join user ID's in the list into a string
  const users = userList.join(",");

  // open a DM with users

  const res = await web.conversations.open({
    users: users,
  });

  // get channel ID for new DM

  const channelId = res.channel.id;
  console.log(`Group DM created with channel ID: ${channelId}`);

  //send a message to the newly created DM channel
  const sendMessageRes = await web.chat.postMessage({
    channel: channelId,
    text: message,
  });

  console.log("Message sent: ", sendMessageRes);
}

async function getUserIds() {
  //call users.list to get a list of all users in workspace
  const res = await web.users.list();

  if (res.ok) {
    //print all user IDs and usernames
    res.members.forEach((user) => {
      console.log(`User ID: ${user.id}, Username: ${user.name}`);
    });
  } else {
    console.error("Error fetching users:", res.error);
  }
}

getUserIds();

// Replace 'general' with the name of your channel and 'Hello, world!' with your message

//note must invite bot on slack for it to be able to send messages to that channel
sendMessageToChannel("general", "Hello, world! Kate says hiiiiiiiii");

//Kate and alicia user IDS
// const userList = [];

const mwahaha = "HELLOOOOOO TESTING DONUT BOT NEW CHAT LETS GOOOOOOOOOO!";

createDMWithUsers(userList, mwahaha);
