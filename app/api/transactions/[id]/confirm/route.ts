import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transaction = await prisma.transaction.findUnique({ where: { id: params.id } });
  if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

  if (transaction.recipientId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: { confirmed: true },
  });

  return NextResponse.json({ ok: true, transaction: updated });
}
