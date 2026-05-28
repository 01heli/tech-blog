import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import type { MeResponse } from '@/types/auth';

export async function GET() {
  const session = await getSession();

  if (!session.userId) {
    return NextResponse.json<MeResponse>({ loggedIn: false });
  }

  return NextResponse.json<MeResponse>({
    loggedIn: true,
    user: { phone: session.phone!, role: session.role! },
  });
}
