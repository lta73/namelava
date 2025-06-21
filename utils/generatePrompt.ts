export function generatePrompt(domain: string) {
  return `
You are a domain valuation expert.
Please analyze the domain: ${domain}

Return a JSON object like:
{
  "domain": "${domain}",
  "auction_price": number (USD),
  "marketplace_price": number (USD),
  "broker_price": number (USD),
  "explanation": "Short explanation of why it's worth that much"
}

Take into account:
- Keywords in the domain
- Brandability, length, memorability
- Potential market usage and value estimation
`;
}
