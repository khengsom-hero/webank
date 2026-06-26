'use client';

import { useState } from 'react';

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <button
      className="rounded-full border border-slate-200 px-5 py-3 text-slate-900"
      type="button"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
