import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/cookies';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TokenQRCode } from '@/components/TokenQRCode';

export default async function ShareTokenPage() {
  const userId = getCurrentUserId();
  if (!userId) redirect('/auth/signin');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) redirect('/auth/signin');

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Share Your Token</h1>
          <p className="text-lg text-slate-600">Others need this to send you transactions</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
          <TokenQRCode token={user.receivingToken} />

          {/* User Info */}
          <div className="space-y-2 pt-6 border-t-2 border-slate-200">
            <p className="text-slate-700">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Short ID:</span> #{user.shortId}
            </p>
            {user.phoneNumber && (
              <p className="text-slate-700">
                <span className="font-semibold">Phone:</span> {user.phoneNumber}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
            <h3 className="font-bold text-blue-900">How to share:</h3>
            <ul className="text-blue-900 space-y-2 text-sm">
              <li>📸 Let them scan your QR code</li>
              <li>📋 Or share your token text</li>
              <li>✅ Then they can send you a transaction</li>
            </ul>
          </div>

          {/* Back Button */}
          <Link
            href="/dashboard"
            className="block w-full mt-6 rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-5 text-center text-white text-xl font-bold transition-colors shadow-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
