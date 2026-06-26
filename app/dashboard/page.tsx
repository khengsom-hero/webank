import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/cookies';
import { redirect } from 'next/navigation';
import { formatRiel } from '@/lib/currency';
import PendingConfirmButton from './PendingConfirmButton';
import SignOutButton from './SignOutButton';
import ProfileClient from '@/components/ProfileClient';

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      transactionsSent: {
        include: { recipient: true },
      },
      transactionsReceived: {
        include: { sender: true },
      },
    },
  });

  if (!user) return null;

  const transactions = [
    ...user.transactionsSent.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      sender: user,
      recipient: tx.recipient,
    })),
    ...user.transactionsReceived.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      sender: tx.sender,
      recipient: user,
    })),
  ];

  const owed = transactions.reduce((sum, tx) => {
    if (tx.senderId === userId) {
      return tx.paidBySender ? sum + tx.amount : sum;
    }
    return !tx.paidBySender ? sum + tx.amount : sum;
  }, 0);

  const owes = transactions.reduce((sum, tx) => {
    if (tx.senderId === userId) {
      return !tx.paidBySender ? sum + tx.amount : sum;
    }
    return tx.paidBySender ? sum + tx.amount : sum;
  }, 0);

  const pending = transactions.filter((tx) => !tx.confirmed).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return { user, owed, owes, pending, transactions };
}

export default async function DashboardPage() {
  const userId = getCurrentUserId();
  if (!userId) redirect('/auth/signin');

  const data = await getUserData(userId);
  if (!data) redirect('/auth/signin');

  return (
    <main className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold">Welcome, {data.user.username}</h1>
            <p className="mt-2 text-slate-600">Short ID: #{data.user.shortId}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/share-token" className="rounded-full bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800">
              Share Token
            </Link>
            <Link href="/search" className="rounded-full border border-slate-200 px-5 py-3 text-slate-900 hover:bg-slate-50">
              Search users
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <BalanceCard title="You are owed" amount={data.owed} color="emerald" />
          <BalanceCard title="You owe" amount={data.owes} color="rose" />
        </div>
      </section>

      <section>
        <ProfileClient user={data.user} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Pending confirmations</h2>
            <p className="mt-2 text-slate-600">Approve or review transactions before they are finalized.</p>
          </div>
          <Link href="/dashboard/transactions/new" className="rounded-full bg-slate-900 px-5 py-3 text-white">
            Add transaction
          </Link>
        </div>

        {data.pending.length === 0 ? (
          <p className="mt-8 text-slate-600">No pending transactions right now.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {data.pending.map((tx) => (
              <div key={tx.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">{tx.createdAt.toLocaleString()}</p>
                <p className="mt-2 text-lg font-semibold">{tx.description}</p>
                <p className="mt-2 text-slate-700">
                  {tx.paidBySender ? 'Sender paid' : 'Recipient paid'} — {formatRiel(tx.amount)}
                </p>
                <p className="mt-2 text-slate-600">
                  {data.user.id === tx.senderId ? `You sent this to ${tx.recipient.username}` : `From ${tx.sender.username}`}
                </p>
                <div className="mt-4 flex gap-3">
                  {data.user.id === tx.recipientId ? (
                    <PendingConfirmButton transactionId={tx.id} />
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-4 py-2 text-slate-700">Awaiting peer confirmation</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <h2 className="text-2xl font-semibold">Ledger history</h2>
        <div className="mt-6 space-y-4">
          {data.transactions
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((tx) => (
              <div key={tx.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-slate-900">{tx.description}</p>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                    {tx.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <p className="mt-2 text-slate-600">
                  {tx.senderId === data.user.id ? 'Paid by you' : `Paid by ${tx.sender.username}`}
                </p>
                <p className="mt-1 text-slate-700">Amount: {formatRiel(tx.amount)}</p>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

function BalanceCard({ title, amount, color }: { title: string; amount: number; color: 'emerald' | 'rose' }) {
  const colorClass = color === 'emerald' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800';
  return (
    <div className={`rounded-3xl border border-slate-200 p-8 ${colorClass}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</p>
      <p className="mt-6 text-5xl font-semibold">{formatRiel(amount)}</p>
    </div>
  );
}
