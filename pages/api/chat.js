import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages,
    });

    const aiMessage = response.choices[0].message.content;
    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "⚠️ AI temporarily unavailable" });
  }
}
