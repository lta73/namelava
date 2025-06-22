// pages/api/domain.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import Redis from 'ioredis';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);
const redis = new Redis(process.env.REDIS_URL!);

const famousDomains = [
  'google.com', 'apple.com', 'facebook.com', 'amazon.com', 'microsoft.com',
  'ups.com', 'dhl.com', 'godaddy.com', 'nike.com', 'coca-cola.com'
];

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

    const isBrand = famousDomains.includes(domain) || domain.length <= 7;

    const prompt = isBrand
      ? `Please estimate a hypothetical valuation for the domain \"${domain}\". Assume it is NOT owned by a known brand. Do NOT reference real companies. Format output as JSON with keys: 'valuation', 'auction_price', 'marketplace_price', 'broker_price', and 'explanation'.`
      : `Evaluate the brand value of the domain \"${domain}\" in USD. Format output as JSON with keys: 'valuation', 'auction_price', 'marketplace_price', 'broker_price', and 'explanation'.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.data.choices[0].message?.content || '';
    const parsed = JSON.parse(text);

    // Format values to USD strings
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const formatted = {
      ...parsed,
      valuation: formatter.format(parsed.valuation),
      auction_price: formatter.format(parsed.auction_price),
      marketplace_price: formatter.format(parsed.marketplace_price),
      broker_price: formatter.format(parsed.broker_price),
    };

    await redis.set(domain, JSON.stringify(formatted));
    return res.status(200).json(formatted);

  } catch (error: any) {
    return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
  }
}
