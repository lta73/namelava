// pages/api/domain.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import Redis from 'ioredis';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);
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

    const prompt = `Estimate the value of domain \"${domain}\" in USD. Return JSON with keys: auction, marketplace, broker, reasoning.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.data.choices[0].message?.content || '';
    const parsed = JSON.parse(text);

    await redis.set(domain, JSON.stringify(parsed), 'EX', 60 * 60 * 24);

    return res.status(200).json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
  }
}
