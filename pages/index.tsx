// pages/index.tsx
import { useState } from "react";

export default function Home() {
const \[domain, setDomain] = useState("");
const \[result, setResult] = useState<any>(null);
const \[loading, setLoading] = useState(false);

const formatUSD = (num: number) =>
new Intl.NumberFormat("en-US", {
style: "currency",
currency: "USD",
}).format(num);

const handleSubmit = async () => {
if (!domain.trim()) return;
setLoading(true);
setResult(null);
try {
const res = await fetch(`/api/domain?name=${encodeURIComponent(domain)}`);
const data = await res.json();
setResult(data);
} catch (err) {
setResult({ error: "Something went wrong." });
} finally {
setLoading(false);
}
};

return ( <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center"> <h1 className="text-3xl font-bold mb-4">🔥 NameLava - Domain Valuator</h1>
\<input
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
/> <button
     className="bg-black text-white px-4 py-2 rounded"
     onClick={handleSubmit}
     disabled={loading}
   >
{loading ? "Valuating..." : "Valuate"} </button>

```
  {result && (
    <div className="mt-6 bg-white p-4 rounded shadow max-w-md w-full">
      {result.error ? (
        <p className="text-red-500">{result.error}</p>
      ) : (
        <>
          <p><strong>Domain:</strong> {result.domain}</p>
          <p><strong>Auction Price:</strong> {formatUSD(result.auctionPrice)}</p>
          <p><strong>Marketplace Price:</strong> {formatUSD(result.marketplacePrice)}</p>
          <p><strong>Broker Price:</strong> {formatUSD(result.brokerPrice)}</p>
          <p className="mt-4"><strong>Explanation:</strong> {result.reasoning}</p>
        </>
      )}
    </div>
  )}
</div>
```

);
}
