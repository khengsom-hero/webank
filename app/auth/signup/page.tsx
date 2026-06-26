'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    let profilePictureData;
    if (profilePicture) {
      const reader = new FileReader();
      profilePictureData = await new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(profilePicture);
      });
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username, 
        phoneNumber: phoneNumber || undefined, 
        pin, 
        profilePicture: profilePictureData || undefined 
      }),
    });

    setLoading(false);
    if (response.ok) {
      setMessage('Account created. You are now signed in.');
      window.location.href = '/dashboard';
    } else {
      const data = await response.json();
      setMessage(data.error || 'Unable to create account');
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-lg text-slate-600">Join Webank today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-lg focus:outline-none focus:border-slate-900"
                placeholder="yourusername"
                required
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Phone Number <span className="text-slate-500 font-normal">(optional)</span></span>
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

          <div className="space-y-3">
            <label className="block">
              <span className="text-lg font-semibold text-slate-800">Profile Picture <span className="text-slate-500 font-normal">(optional)</span></span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-3 w-full rounded-2xl border-2 border-slate-300 bg-white px-5 py-4 text-base file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:cursor-pointer file:font-semibold hover:file:bg-slate-800"
              />
            </label>
            {profilePreview && (
              <div className="flex justify-center mt-4">
                <img src={profilePreview} alt="Profile preview" className="h-32 w-32 rounded-full object-cover border-4 border-slate-900 shadow-lg" />
              </div>
            )}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-center ${
            message.includes('created') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-lg font-semibold">{message}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-lg">
            Already have an account? <a href="/auth/signin" className="text-slate-900 font-bold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </main>
  );
}
