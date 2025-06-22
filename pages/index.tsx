// pages/index.tsx

import { useState } from "react";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/domain?name=${domain}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: "Something went wrong.", detail: err.message });
    } finally {
      setLoading(false);
    }
  };

  const formatUSD = (num: number) => {
    if (num === 0) return "$0";
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">NameLava 🔥</h1>
      <input
        type="text"
        placeholder="Enter a domain (e.g. namelava.com)"
        className="border p-2 rounded w-full max-w-md mb-4"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Valuating..." : "Valuate"}
      </button>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-md w-full">
          {result.error ? (
            <p className="text-red-500">{result.error}{result.detail ? `: ${result.detail}` : ""}</p>
          ) : (
            <>
              <p><strong>Auction:</strong> {typeof result.valuation?.auction === 'number' ? formatUSD(result.valuation.auction) : "N/A"}</p>
              <p><strong>Marketplace:</strong> {typeof result.valuation?.market === 'number' ? formatUSD(result.valuation.market) : "N/A"}</p>
              <p><strong>Broker:</strong> {typeof result.valuation?.broker === 'number' ? formatUSD(result.valuation.broker) : "N/A"}</p>
              <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                <strong>Explanation:</strong>
                <p>{result.explanation || "No explanation available."}</p>
              </div>
              {typeof result.valuation?.auction === 'number' && result.valuation.auction === 0 &&
                typeof result.explanation === 'string' &&
                result.explanation.toLowerCase().includes("brand") && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                    ⚠️ This domain may include or conflict with a known brand name.
                  </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
