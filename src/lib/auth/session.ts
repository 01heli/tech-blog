import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { SessionData } from '@/types/auth';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'a-very-long-secret-key-at-least-32-chars!!',
  cookieName: 'tech-blog-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

export async function getSession() {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function createSession(data: SessionData) {
  const session = await getSession();
  session.userId = data.userId;
  session.phone = data.phone;
  session.role = data.role;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) return null;
  return { userId: session.userId, phone: session.phone!, role: session.role! };
}
