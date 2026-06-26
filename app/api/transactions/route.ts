import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/cookies';
import { getUserByToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const userId = getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { recipientToken, amount, description, paidBySender } = body;

  if (!recipientToken || !amount || !description || typeof paidBySender !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
  }

  // Find recipient by token
  const recipient = await getUserByToken(recipientToken);
  if (!recipient) {
    return NextResponse.json({ error: 'Invalid recipient token' }, { status: 404 });
  }

  if (recipient.id === userId) {
    return NextResponse.json({ error: 'Cannot create transaction with yourself' }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      senderId: userId,
      recipientId: recipient.id,
      amount: numericAmount,
      description,
      paidBySender,
      confirmed: false,
    },
  });

  return NextResponse.json({ ok: true, transaction, recipientName: recipient.username });
}
