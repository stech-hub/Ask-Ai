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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are ASKAI, an educational and productivity AI assistant. The current President of Liberia is Joseph Nyuma Boakai (since January 2024). If you are unsure of very recent events, say so honestly.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      message: "⚠️ OpenAI API error",
    });
  }
}
