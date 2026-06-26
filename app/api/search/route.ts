import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const searchById = Number(query.replace('#', ''));
  const conditions = [];
  if (!Number.isNaN(searchById)) {
    conditions.push({ shortId: searchById });
  }
  conditions.push({ username: query });

  const users = await prisma.user.findMany({
    where: {
      OR: conditions,
    },
    select: { id: true, username: true, shortId: true },
    take: 10,
  });

  return NextResponse.json({ results: users });
}
