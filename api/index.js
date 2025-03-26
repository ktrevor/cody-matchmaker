import { WebClient } from "@slack/web-api";
const token = "xoxb-8651876146358-8661268937315-db1T3DX2IbGI23aIpyhYNmSl";
const web = new WebClient(token);

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
