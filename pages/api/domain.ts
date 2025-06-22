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

    const prompt = `Estimate the fair valuation for the domain name "${domain}" in three categories: auction price, marketplace price, and broker price.\n\nExplain your reasoning based on the domain name's intrinsic qualities (length, keywords, TLD, etc.).\n\nIf the domain is known to be in use by a famous brand or company, please still provide the valuation *as if it were available*, but include a disclaimer: \"This domain is currently used by a brand. The price does not reflect its brand equity or existing web traffic value.\"\n\nIf the domain clearly includes a registered brand name (e.g. dysoncleaners.com, facebookmarketing.com), warn: \"This domain includes a well-known brand name and may face legal challenges.\"\n\nReturn in this strict JSON format:\n{\n  "auction": number,\n  "market": number,\n  "broker": number,\n  "reasoning": string\n}`;

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
