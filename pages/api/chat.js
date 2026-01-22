import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
    });
    res.status(200).json({ message: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "⚠️ OpenAI API test failed" });
  }
}
