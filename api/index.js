import { WebClient } from "@slack/web-api";

// Replace with your actual Slack bot token
const token = "xoxb-8651876146358-8661268937315-xrOjq9UwGheLyhHuNRcLWrxD";
const web = new WebClient(token);

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Get the message from the request body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Send the message to Slack
      const result = await web.chat.postMessage({
        channel: "#social", // Replace with the desired Slack channel
        text: message, // Use the message from the frontend
      });

      if (result.ok) {
        res.status(200).json({ ok: true });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Method Not Allowed for other types of requests
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
