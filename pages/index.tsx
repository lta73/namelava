return (
  <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-4">NameLava 🔥</h1>
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        placeholder="Enter a domain (e.g. namelava.com)"
        className="border p-2 rounded w-full mb-4"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded w-full"
        type="submit"
        disabled={loading}
      >
        {loading ? "Valuating..." : "Valuate"}
      </button>
    </form>

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
);
