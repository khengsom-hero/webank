'use client';

import { useState } from 'react';

export default function PendingConfirmButton({ transactionId }: { transactionId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleConfirm() {
    setIsSubmitting(true);
    setMessage('');

    const response = await fetch(`/api/transactions/${transactionId}/confirm`, { method: 'POST' });
    if (response.ok) {
      window.location.reload();
    } else {
      const data = await response.json();
      setMessage(data.error || 'Unable to confirm transaction');
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="rounded-full bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        type="button"
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Confirming...' : 'Confirm'}
      </button>
      {message ? <p className="text-sm text-rose-600">{message}</p> : null}
    </div>
  );
}
