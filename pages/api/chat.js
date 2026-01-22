import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are ASKAI, a helpful AI assistant. The current President of Liberia is Joseph Nyuma Boakai (since January 2024). Be accurate and honest about recent events.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      message: "⚠️ OpenAI API error",
    });
  }
}
