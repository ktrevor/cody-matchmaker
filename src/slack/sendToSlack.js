// sendToSlack.js
const axios = require("axios");
import { db } from "../firebase/firebase";

firestore = db;

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Read the token from the environment variables or replace with your token FOUND IN MESSENGER
const token = process.env.SLACK_WEBHOOK_URL;

console.log("WEBURL:", token); // This will print the bot token, make sure it is correct

// Slack Webhook URL
const slackWebhookUrl = token;

// Function to fetch data from Firestore and send it to Slack
async function sendDataToSlack() {
  try {
    // Fetch data from Firestore (replace with your collection name)
    const snapshot = await firestore.collection("your-collection").get();

    // Prepare the message to send to Slack
    let messageText = "Here is the data from Firebase:\n";
    snapshot.forEach((doc) => {
      messageText += `${doc.id}: ${JSON.stringify(doc.data())}\n`;
    });

    // Slack message payload
    const slackMessage = {
      text: messageText, // Message content
    };

    // Send the data to Slack using Axios
    await axios.post(slackWebhookUrl, slackMessage);

    console.log("Data sent to Slack successfully!");
  } catch (error) {
    console.error(
      "Error fetching data from Firestore or sending to Slack:",
      error
    );
  }
}

// Call the function to send data to Slack
sendDataToSlack();
