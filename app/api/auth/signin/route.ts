import { NextResponse } from 'next/server';
import { getUserByPhoneNumber, comparePin } from '@/lib/auth';
import { signToken } from '@/lib/auth';
import { setSessionCookie } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { phoneNumber, pin, profilePicture } = body;

  if (!phoneNumber || !pin || pin.length !== 6) {
    return NextResponse.json({ error: 'Invalid sign-in payload' }, { status: 400 });
  }

  let user = await getUserByPhoneNumber(phoneNumber);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await comparePin(pin, user.pinHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Update profile picture if provided
  if (profilePicture) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { profilePicture },
    });
  }

  const token = signToken(user.id);
  const response = NextResponse.json({ ok: true });
  setSessionCookie(token);
  return response;
}
