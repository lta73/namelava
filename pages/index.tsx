// pages/index.tsx
import { useState } from "react";

export default function Home() {
const \[domain, setDomain] = useState("");
const \[result, setResult] = useState<any>(null);
const \[loading, setLoading] = useState(false);

const handleSubmit = async () => {
const trimmed = domain.trim();
if (!trimmed) return;
setLoading(true);
setResult(null);
try {
const encoded = encodeURIComponent(trimmed);
const res = await fetch(`/api/domain?name=${encoded}`);
const data = await res.json();
setResult(data);
} catch (err) {
setResult({ error: "Something went wrong." });
} finally {
setLoading(false);
}
};

return ( <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center"> <h1 className="text-3xl font-bold mb-4">NameLava 🔥</h1>
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
          <p><strong>Valuation:</strong> {result.valuation}</p>
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
        </>
      )}
    </div>
  )}
</div>
```

);
}
