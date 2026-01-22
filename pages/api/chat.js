import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Add in .env.local
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages,
    });

    res.status(200).json({ message: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI temporarily unavailable" });
  }
}
