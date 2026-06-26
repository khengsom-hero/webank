'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
};

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || user.username);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditing) return;

    setIsSubmitting(true);
    setMessage('');

    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      router.refresh();
    } else {
      const data = await response.json();
      setMessage(data.error || 'Failed to update profile.');
    }
    setIsSubmitting(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-xl font-semibold">Edit Profile</h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400">
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Cancel
          </button>
        </div>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-500">Name</p>
                <p className="text-xl font-semibold">{user.name || user.username}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="rounded-full border border-slate-200 px-5 py-3 text-slate-900 hover:bg-slate-50">
                Edit Profile
            </button>
        </div>
    </div>
  );
}