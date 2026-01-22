// pages/api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are ASKAI, an AI assistant for learning, coding, scholarships, jobs, and up-to-date global information.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    res.status(200).json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "⚠️ OpenAI API error" });
  }
}
