import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [domain, setDomain] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    router.push(`/domain/${domain}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-4xl font-bold mb-4">NameLava 🔥</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter a domain (e.g., example.com)"
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Estimate
        </button>
      </form>

      <p className="text-gray-500 text-sm">Explore domain value instantly with AI insights. 🔍</p>
    </div>
  );
}
