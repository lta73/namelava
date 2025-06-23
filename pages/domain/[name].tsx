import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DomainResult() {
  const router = useRouter();
  const { domain } = router.query;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inputDomain, setInputDomain] = useState('');

  useEffect(() => {
    if (!domain) return;
    setInputDomain(domain as string);
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/domain?name=${domain}`);
        const data = await res.json();
        setResult(data);
      } catch (error) {
        setResult({ error: 'Failed to load data' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [domain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDomain) return;
    router.push(`/domain/${inputDomain}`);
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">NameLava 🔥</h1>
      <form onSubmit={handleSubmit} className="flex mb-6 space-x-2">
        <input
          type="text"
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
          placeholder="Enter a domain (e.g., namelava.com)"
          className="border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Estimate
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600">Estimating...</p>
      ) : result?.error ? (
        <p className="text-red-500">{result.error}</p>
      ) : (
        <div className="bg-gray-100 p-4 rounded shadow max-w-md w-full">
          <p><strong>Valuation:</strong> {result.valuation}</p>
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
          {result.warning && (
            <p className="text-yellow-600 mt-2">⚠️ {result.warning}</p>
          )}
        </div>
      )}
    </div>
  );
}
