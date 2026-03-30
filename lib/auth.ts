import { cookies } from 'next/headers';
import { findOrCreateUser, getUserById } from './users';

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
  
  const user = getUserById(userId);
  if (!user) return null;
  
  return { id: user.id, name: user.name };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function loginOrCreate(name: string): Promise<SessionUser> {
  const user = findOrCreateUser(name);
  await createSession(user.id);
  
  return { id: user.id, name: user.name };
}
