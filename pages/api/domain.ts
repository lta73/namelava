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

    const prompt = `You're a domain valuation assistant. Evaluate the domain \"${domain}\".

Return ONLY a JSON object with these keys:
{
  \"domain\": \"${domain}\",
  \"auction\": 3500,
  \"marketplace\": 4000,
  \"broker\": 4500,
  \"explanation\": \"Explain the domain's value here.\"
}

Do not add any extra text or comment. Only return valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const gptOutput = completion.choices[0].message?.content || '';

    try {
      const json = JSON.parse(gptOutput);
      const safe = {
        domain,
        auction: Number(json.auction) || 0,
        marketplace: Number(json.marketplace) || 0,
        broker: Number(json.broker) || 0,
        explanation: json.explanation || 'No explanation provided.',
      };

      await redis.set(domain, JSON.stringify(safe));
      return res.status(200).json(safe);
    } catch (err) {
      return res.status(500).json({ error: 'GPT output could not be parsed.' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
  }
}
