'use client';

import { useState } from 'react';
import Link from 'next/link';

type UserResult = {
  id: string;
  username: string;
  shortId: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults(data.results || []);
  }

  return (
    <main className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Search community members</h1>
          <p className="mt-2 text-slate-600">Find users by username or Short ID, then log a shared transaction.</p>
        </div>
        <Link href="/dashboard" className="rounded-full border border-slate-200 px-5 py-3 text-slate-900">
          Dashboard
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="username or #1234"
          className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
        />
        <button className="rounded-full bg-slate-900 px-6 py-3 text-white">Search</button>
      </form>

      <div className="mt-8 space-y-4">
        {results.map((user) => (
          <div key={user.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-medium text-slate-900">{user.username}</p>
            <p className="mt-1 text-slate-600">Short ID: #{user.shortId}</p>
            <Link href={`/dashboard/transactions/new?recipient=${user.id}`} className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-white">
              Log debt with {user.username}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
