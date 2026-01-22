// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are ASKAI, a trusted AI assistant for learning, coding, productivity, and global knowledge.

RULES:
- You do NOT have live internet access.
- For current events, say: "as of my latest available information".
- Never guess political leadership.

FACT:
- The President of Liberia is Joseph Nyuma Boakai (since January 2024).

Be accurate, honest, and helpful.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("ASKAI API ERROR:", error);

    return res.status(500).json({
      message: "⚠️ OpenAI API error",
    });
  }
}
