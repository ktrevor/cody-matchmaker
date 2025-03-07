/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// //alicia code for fb function for sending donut message to slack

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv');

// Initialize Firebase
admin.initializeApp();

// Load environment variables from .env file (for local testing)
dotenv.config();

// Read the Slack token from environment variables (or set directly for testing purposes)
const token = process.env.SLACK_BOT_TOKEN || "";

// Initialize the Slack WebClient
const web = new WebClient(token);

// Firebase function to send group DM messages to Slack members
exports.sendDonutMessageToSlack = functions.https.onRequest(async (req, res) => {
  // Ensure the request method is POST (triggered by button click)
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Fetch the donut document from Firestore (which contains the group IDs)
    const donutRef = admin.firestore().collection('donuts').doc('YXZbLM7JrCm8F056k6bR');  // Replace with actual donut ID
    const donutDoc = await donutRef.get();

    if (!donutDoc.exists) {
      return res.status(404).send('Donut not found');
    }

    const donutData = donutDoc.data();
    const groupIds = donutData.groupIds || [];

    if (groupIds.length === 0) {
      return res.status(400).send('No group IDs found in the donut');
    }

    // Iterate through each group ID to create a group DM and send a message
    for (const groupId of groupIds) {
      const groupRef = admin.firestore().collection('groups').doc(groupId);
      const groupDoc = await groupRef.get();

      if (groupDoc.exists) {
        const groupData = groupDoc.data();
        const memberIds = groupData.memberIds || [];  // Get member IDs from the group

        if (memberIds.length === 0) {
          console.log(`No members found for group: ${groupId}`);
          continue; // Skip group if no members
        }

        // Fetch all Slack IDs for the members in this group
        const slackIds = [];
        for (const memberId of memberIds) {
          const memberRef = admin.firestore().collection('members').doc(memberId);
          const memberDoc = await memberRef.get();

          if (memberDoc.exists) {
            const memberData = memberDoc.data();
            const slackId = memberData.slackId;  // Slack ID from the member collection

            if (slackId) {
              slackIds.push(slackId);  // Collect all Slack IDs
            } else {
              console.log(`Slack ID not found for member: ${memberId}`);
            }
          } else {
            console.log(`Member with ID ${memberId} not found`);
          }
        }

        if (slackIds.length > 0) {
          // Create a group DM with all the members
          const res = await web.conversations.open({
            users: slackIds.join(','),  // Join the Slack IDs to open a group DM
          });

          const channelId = res.channel.id;
          console.log(`Group DM created with channel ID: ${channelId}`);

          // Send a message to the group DM
          const sendMessageRes = await web.chat.postMessage({
            channel: channelId,  // Use the channel ID for the group DM
            text: `Hello everyone! Here's a message from the donut bot! Testing from FB Functions!`,  // Customize the message
          });

          console.log('Message sent: ', sendMessageRes);
        } else {
          console.log(`No valid Slack IDs found for group: ${groupId}`);
        }
      } else {
        console.log(`Group with ID ${groupId} not found`);
      }
    }

    // Respond after all messages have been sent
    return res.status(200).send('Messages sent to all group DMs');
  } catch (error) {
    console.error('Error sending messages to Slack:', error);
    return res.status(500).send('Error sending messages to Slack');
  }
});


// // end code for sending to slack
