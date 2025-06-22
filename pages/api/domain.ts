// pages/api/domain.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import Redis from 'ioredis';

const config = new Configuration({ apiKey: process.env.OPENAI\_API\_KEY });
const openai = new OpenAIApi(config);
const redis = new Redis(process.env.REDIS\_URL!);

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

```
const prompt = `Evaluate the brand value of the domain '${domain}' in USD. Return JSON with keys: "auctionPrice", "marketplacePrice", "brokerPrice", and "explanation". Use realistic ranges and write in plain English.`;

const completion = await openai.createChatCompletion({
  model: 'gpt-4',
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
  temperature: 0.7,
});

const text = completion.data.choices[0].message?.content || '';

let parsed;
try {
  parsed = JSON.parse(text);
} catch (e) {
  return res.status(500).json({ error: 'Failed to parse AI response', raw: text });
}

await redis.set(domain, JSON.stringify(parsed), 'EX', 60 * 60 * 24); // Cache for 24h
return res.status(200).json(parsed);
```

} catch (error: any) {
return res.status(500).json({ error: 'Error generating valuation', detail: error.message });
}
}
