import { useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    if (!domain.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/domain?domain=${domain}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔥 NameLava - Domain Valuator</h1>
      <input
        className="border p-2 w-full mb-2 rounded"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (e.g. namelava.com)"
      />
      <button
        className="bg-orange-600 text-white px-4 py-2 rounded"
        onClick={handleCheck}
        disabled={loading}
      >
        {loading ? 'Valuating...' : 'Get Valuation'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <p><strong>Domain:</strong> {result.domain}</p>
          <p><strong>Auction Price:</strong> ${result.auction_price}</p>
          <p><strong>Marketplace Price:</strong> ${result.marketplace_price}</p>
          <p><strong>Broker Price:</strong> ${result.broker_price}</p>
          <p><strong>Explanation:</strong> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}
