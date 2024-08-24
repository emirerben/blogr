import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, title, purpose } = req.body;
    console.log('API received content:', content);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an expert writing coach, helping users create engaging blog posts. Your goal is to ask thought-provoking questions that will help the user expand their ideas, add depth to their content, and improve the overall quality of their writing.` },
          { role: "user", content: `The user is writing a blog post with the title: "${title}". The purpose of this post is: "${purpose}". Based on the following content, generate one thought-provoking question to help the user expand their ideas or address potential gaps in their writing:

Content: "${content}"

Provide a single, specific question that will encourage the user to think more deeply about their topic, consider different perspectives, or add more valuable information to their post.` }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const suggestion = completion.choices[0]?.message?.content?.trim() || 'No suggestion available';

      console.log('API generated suggestion:', suggestion);
      res.status(200).json({ suggestion });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      res.status(500).json({ error: 'Error generating suggestion' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}