import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SESSION_COOKIE = 'labcal_session';

export interface SessionUser {
  id: string;
  name: string;
}

export async function createSession(userId: string): Promise<string> {
  const token = `${userId}-${Date.now()}`;
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  
  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!token) return null;
  
  const [userId] = token.split('-');
  if (!userId) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
  
  return user;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function loginOrCreate(name: string): Promise<SessionUser> {
  const trimmedName = name.trim();
  
  let user = await prisma.user.findUnique({
    where: { name: trimmedName },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: { name: trimmedName },
    });
  }
  
  await createSession(user.id);
  
  return { id: user.id, name: user.name };
}
