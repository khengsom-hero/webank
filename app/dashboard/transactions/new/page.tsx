'use client';

import { useState, useRef } from 'react';

export default function NewTransactionPage() {
  const [recipientToken, setRecipientToken] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBySender, setPaidBySender] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showScanner, setShowScanner] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientToken, amount: Number(amount), description, paidBySender }),
    });

    setLoading(false);
    if (response.ok) {
      const data = await response.json();
      setMessageType('success');
      setMessage(`Transaction logged with ${data.recipientName}. Waiting for confirmation.`);
      setAmount('');
      setDescription('');
      setRecipientToken('');
    } else {
      const data = await response.json();
      setMessageType('error');
      setMessage(data.error || 'Unable to create transaction');
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">New Transaction</h1>
          <p className="text-lg text-slate-600">Get the recipient's token to complete</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-3xl p-8 shadow-lg">
          {/* Recipient Token Input */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Recipient Token</span>
              <input
                value={recipientToken}
                onChange={(event) => setRecipientToken(event.target.value)}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900 font-mono"
                placeholder="Paste token here"
                required
              />
            </label>
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="w-full rounded-2xl bg-slate-200 hover:bg-slate-300 px-5 py-4 text-lg font-semibold text-slate-900 transition-colors"
            >
              {showScanner ? '✕ Close Scanner' : '📱 Scan QR Code'}
            </button>
          </div>

          {showScanner && (
            <div className="space-y-3">
              <video
                ref={videoRef}
                className="w-full rounded-2xl border-2 border-slate-300 bg-black"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-center text-sm text-slate-600">Point camera at recipient's QR code</p>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Amount</span>
              <input
                value={amount}
                type="number"
                min="0"
                step="0.01"
                onChange={(event) => setAmount(event.target.value)}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900"
                placeholder="0.00"
                required
              />
            </label>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Description</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900"
                placeholder="What was purchased?"
                required
              />
            </label>
          </div>

          {/* Paid By Sender Checkbox */}
          <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={paidBySender}
              onChange={(event) => setPaidBySender(event.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-lg font-semibold text-slate-800">I paid and the recipient owes me</span>
          </label>

          {/* Submit Button */}
          <button
            disabled={loading || !recipientToken}
            className="w-full mt-8 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 px-6 py-5 text-white text-xl font-bold transition-colors shadow-lg active:shadow-md"
            type="submit"
          >
            {loading ? 'Creating Transaction...' : 'Create Transaction'}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-5 rounded-2xl text-center font-semibold text-lg ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
