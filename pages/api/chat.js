// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";

// Make sure to set OPENAI_API_KEY in your .env.local file
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Support both formats: array of messages or single message string
    let messages = [];

    if (req.body.messages && Array.isArray(req.body.messages)) {
      messages = req.body.messages;
    } else if (req.body.message && typeof req.body.message === "string") {
      messages = [{ role: "user", content: req.body.message }];
    } else {
      return res.status(400).json({ message: "Message is required" });
    }

    // Call OpenAI Chat API
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini", // latest performant model
      messages,
      temperature: 0.7,     // creativity
      max_tokens: 800,      // limit response length
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0.3,
    });

    const aiMessage = completion.data.choices[0].message.content;

    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error("OpenAI API error:", error?.response?.data || error.message);
    res.status(500).json({ message: "⚠️ AI temporarily unavailable. Please try again later." });
  }
}
