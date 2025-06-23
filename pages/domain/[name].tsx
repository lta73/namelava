import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DomainPage() {
  const router = useRouter();
  const { name } = router.query;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      fetch(`/api/domain?name=${name}`)
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch(() => {
          setResult({ error: "Something went wrong." });
          setLoading(false);
        });
    }
  }, [name]);

  const formatUSD = (num: number) => {
    if (num === 0) return "$0";
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (result?.error) {
    return (
      <div className="p-8 text-red-600">
        <strong>Error:</strong> {result.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🔥 {name}</h1>
      <div className="bg-white rounded shadow p-4 w-full max-w-md">
        <p><strong>Auction:</strong> {formatUSD(result.valuation?.auction ?? 0)}</p>
        <p><strong>Marketplace:</strong> {formatUSD(result.valuation?.market ?? 0)}</p>
        <p><strong>Broker:</strong> {formatUSD(result.valuation?.broker ?? 0)}</p>
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
      </div>
    </div>
  );
}
