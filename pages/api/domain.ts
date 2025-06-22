// pages/api/domain.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Redis from 'ioredis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis(process.env.REDIS_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing domain query parameter' });
  }

  const domain = name.trim().toLowerCase();

  try {
    const cached = await redis.get(domain);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const prompt = `Evaluate the brand value of the domain "${domain}" in USD. Format output as JSON with keys: auction, marketplace, broker, explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message?.content || '';
    const parsed = JSON.parse(text);

    await redis.set(domain, JSON.stringify(parsed));
    return res.status(200).json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
  }
}
