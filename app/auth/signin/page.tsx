'use client';

import { useState } from 'react';

export default function SigninPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, pin}),
    });

    setLoading(false);
    if (response.ok) {
      window.location.href = '/dashboard';
    } else {
      const data = await response.json();
      setMessage(data.error || 'Unable to sign in');
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-lg text-slate-600">Sign in to Webank</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Phone Number</span>
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                type="tel"
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900"
                placeholder="087 654 321"
                required
              />
            </label>
          </div>


          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">6-digit PIN</span>
              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900"
                placeholder="000000"
                required
              />
            </label>
          </div>

          <button 
            disabled={loading}
            className="w-full mt-8 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 px-6 py-5 text-white text-xl font-bold transition-colors shadow-lg active:shadow-md" 
            type="submit"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-2xl text-center bg-red-100 text-red-800">
            <p className="text-lg font-semibold">{message}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-lg">
            Don't have an account? <a href="/auth/signup" className="text-slate-900 font-bold hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </main>
  );
}
