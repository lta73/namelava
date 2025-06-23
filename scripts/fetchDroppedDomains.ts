// scripts/fetchDroppedDomains.ts

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const csvPath = path.join(__dirname, '../database/sample-drops.csv');
const outputPath = path.join(__dirname, '../database/dropped.json');

async function parseCSV() {
  const fileStream = fs.createReadStream(csvPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const domains: string[] = [];
  for await (const line of rl) {
    if (line.includes(".com")) {
      const parts = line.split(',');
      if (parts[0] && /^[a-zA-Z0-9-]+\.com$/.test(parts[0])) {
        domains.push(parts[0]);
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(domains.slice(0, 50), null, 2));
  console.log(`✅ Parsed ${domains.length} domains. Saved top 50 to dropped.json.`);
}

parseCSV().catch((err) => console.error("❌ Error parsing CSV:", err));
