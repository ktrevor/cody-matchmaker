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

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const axios = require('axios');

// admin.initializeApp();

// exports.sendDonutMessageToSlack = functions.https.onRequest(async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).send('Method Not Allowed');
//   }

//   try {
//     const donutRef = admin.firestore().collection('donuts').doc('your-donut-id');
//     const donutDoc = await donutRef.get();

//     if (!donutDoc.exists) {
//       return res.status(404).send('Donut not found');
//     }

//     const donutData = donutDoc.data();
//     const groupIds = donutData.groupIds || [];

//     if (groupIds.length === 0) {
//       return res.status(400).send('No group IDs found in the donut');
//     }

//     for (const groupId of groupIds) {
//       const groupRef = admin.firestore().collection('groups').doc(groupId);
//       const groupDoc = await groupRef.get();

//       if (groupDoc.exists) {
//         const groupData = groupDoc.data();
//         const slackChannel = groupData.slackChannel;
//         const message = `Hello, members of ${groupData.name}! Here's a message from the donut bot!`;

//         await axios.post('https://slack.com/api/chat.postMessage', {
//           channel: slackChannel,
//           text: message,
//         }, {
//           headers: {
//             'Authorization': `Bearer YOUR_SLACK_OAUTH_TOKEN`,
//             'Content-Type': 'application/json',
//           },
//         });

//         console.log(`Message sent to Slack channel: ${slackChannel}`);
//       } else {
//         console.log(`Group with ID ${groupId} not found`);
//       }
//     }

//     return res.status(200).send('Messages sent to all groups');
//   } catch (error) {
//     console.error('Error sending messages to Slack:', error);
//     return res.status(500).send('Error sending messages to Slack');
//   }
// });


// // end code for sending to slack
