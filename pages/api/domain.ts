// pages/api/domain.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Redis from 'ioredis';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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

    const prompt = `Estimate the fair valuation for the domain name \"${domain}\" in three categories: auction price, marketplace price, and broker price. Also explain the reasoning behind this valuation. Respond in this strict JSON format:\n{\n  \"auction\": number,\n  \"market\": number,\n  \"broker\": number,\n  \"reasoning\": string\n}\nIf the domain is a trademarked brand or cannot be valued, set all prices to 0 and explain why.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message?.content || '';
    const parsed = JSON.parse(text);

    const formatted = {
      valuation: {
        auction: parsed.auction || 0,
        market: parsed.market || 0,
        broker: parsed.broker || 0,
      },
      explanation: parsed.reasoning || '',
    };

    await redis.set(domain, JSON.stringify(formatted));
    return res.status(200).json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
  }
}
