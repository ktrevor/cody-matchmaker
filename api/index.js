import { WebClient } from "@slack/web-api";

export default async function handler(req, res) {
  try {
    await web.chat.postMessage({
      channel: "#social",
      text: "Hello, Slack!",
    });
    res.status(200).send("Message sent!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
