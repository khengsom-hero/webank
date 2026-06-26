import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default function HomePage() {
  const token = cookies().get('webank_session')?.value;
  const authed = token ? !!verifyToken(token) : false;

  return (
    <main className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <h1 className="text-4xl font-bold">Community Debt & Ledger Tracker</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Track who owes whom in a community, confirm balances, and keep a shared transaction ledger.
        </p>
        <div className="mt-8 flex gap-4">
          {authed ? (
            <Link href="/dashboard" className="rounded-full bg-slate-900 px-6 py-3 text-white">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/signin" className="rounded-full bg-slate-900 px-6 py-3 text-white">
                Sign in
              </Link>
              <Link href="/auth/signup" className="rounded-full border border-slate-200 px-6 py-3 text-slate-900">
                Create account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card title="User discovery" description="Search community members by username or Short ID."></Card>
        <Card title="Pending confirmation" description="Transactions are only finalized when both parties confirm the debt." />
        <Card title="Ledger history" description="View your transaction history with pending and confirmed items." />
      </section>
    </main>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
