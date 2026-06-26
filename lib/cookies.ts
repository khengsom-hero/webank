import { cookies } from 'next/headers';
import { verifyToken, signToken } from './auth';

const COOKIE_NAME = 'webank_session';

export function setSessionCookie(token: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function getSessionToken() {
  return cookies().get(COOKIE_NAME)?.value;
}

export function getCurrentUserId() {
  const token = getSessionToken();
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });
}
