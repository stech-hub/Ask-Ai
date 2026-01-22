// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found!");
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    let messages = [];

    // Support array or single message
    if (req.body.messages && Array.isArray(req.body.messages)) {
      messages = req.body.messages;
    } else if (req.body.message && typeof req.body.message === "string") {
      messages = [{ role: "user", content: req.body.message }];
    } else {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0.3,
    });

    const aiMessage = completion.data.choices[0]?.message?.content;
    if (!aiMessage) throw new Error("Empty response from OpenAI");

    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error("OpenAI API error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ message: "⚠️ OpenAI API test failed. Try again later." });
  }
}
