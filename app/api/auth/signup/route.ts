import { NextResponse } from 'next/server';
import { createUser, getUserByPhoneNumber, getUserByUsername } from '@/lib/auth';
import { signToken } from '@/lib/auth';
import { setSessionCookie } from '@/lib/cookies';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, phoneNumber, pin, profilePicture } = body;

  if (!username || !pin || pin.length !== 6) {
    return NextResponse.json({ error: 'Invalid signup payload' }, { status: 400 });
  }

  // Check if phone number is provided and if it's already in use
  if (phoneNumber) {
    const existingPhone = await getUserByPhoneNumber(phoneNumber);
    if (existingPhone) {
      return NextResponse.json({ error: 'Phone number already in use' }, { status: 409 });
    }
  }

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    return NextResponse.json({ error: 'Username already in use' }, { status: 409 });
  }

  const user = await createUser({ username, phoneNumber, pin, profilePicture });
  const token = signToken(user.id);
  const response = NextResponse.json({ ok: true });
  setSessionCookie(token);
  return response;
}
