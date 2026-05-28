import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { SessionData } from '@/types/auth'

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'tech-blog-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function createSession(data: SessionData): Promise<void> {
  const session = await getSession()
  session.userId = data.userId
  session.phone = data.phone
  session.role = data.role
  await session.save()
}

export async function destroySession(): Promise<void> {
  const session = await getSession()
  session.destroy()
}

export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await getSession()
  if (!session.userId) return null
  return {
    userId: session.userId,
    phone: session.phone,
    role: session.role,
  }
}
