import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing NEXTAUTH_SECRET or JWT_SECRET environment variable');
  }
  return secret;
}

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 10);
}

export async function comparePin(pin: string, hash: string) {
  return bcrypt.compare(pin, hash);
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '30d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string };
  } catch {
    return null;
  }
}

function generateRandomToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function createUser({ username, email, phoneNumber, pin, profilePicture }: { username: string; email?: string; phoneNumber?: string; pin: string; profilePicture?: string }) {
  const pinHash = await hashPin(pin);
  const shortId = await generateShortId();
  const receivingToken = generateRandomToken();
  return prisma.user.create({
    data: { username, email, phoneNumber, pinHash, shortId, profilePicture, receivingToken },
  });
}

async function generateShortId() {
  const existing = await prisma.user.findMany({ select: { shortId: true } });
  const used = new Set(existing.map((user) => user.shortId));
  let candidate = Math.floor(1000 + Math.random() * 9000);
  while (used.has(candidate)) {
    candidate = Math.floor(1000 + Math.random() * 9000);
  }
  return candidate;
}

export async function getUserByToken(token: string) {
  return prisma.user.findUnique({ where: { receivingToken: token } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  return prisma.user.findUnique({ where: { phoneNumber } });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function getUserByShortId(shortId: number) {
  return prisma.user.findUnique({ where: { shortId } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
