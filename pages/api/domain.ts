import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import Redis from 'ioredis';
import { generatePrompt } from '@/utils/generatePrompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const redis = new Redis(process.env.REDIS_URL as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const domain = req.query.domain as string;

  if (!domain) {
    return res.status(400).json({ error: 'Missing domain query parameter' });
  }

  const cacheKey = `domain:${domain}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log('✅ Cache hit');
    return res.status(200).json(JSON.parse(cached));
  }

  console.log('🧠 Calling OpenAI for fresh valuation...');
  const prompt = generatePrompt(domain);

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const result = completion.choices[0].message.content;
  const parsed = JSON.parse(result!);

  await redis.set(cacheKey, JSON.stringify(parsed), 'EX', 60 * 60 * 24 * 30); // 30 days

  return res.status(200).json(parsed);
}
