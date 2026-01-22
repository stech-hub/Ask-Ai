import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20000,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are ASKAI, a reliable and up-to-date AI assistant for learning, coding, scholarships, jobs, Liberia resources, and global current affairs. Always give accurate and current answers."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      message: response.output_text || "No response generated."
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return res.status(500).json({
      message: "⚠️ AI service temporarily unavailable. Please try again."
    });
  }
}
