import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

interface UsersData {
  users: User[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function readUsers(): UsersData {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return { users: [] };
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

function writeUsers(data: UsersData): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

export function getAllUsers(): User[] {
  return readUsers().users.sort((a, b) => a.name.localeCompare(b.name));
}

export function getUserById(id: string): User | null {
  const { users } = readUsers();
  return users.find((u) => u.id === id) || null;
}

export function getUserByName(name: string): User | null {
  const { users } = readUsers();
  return users.find((u) => u.name.toLowerCase() === name.toLowerCase().trim()) || null;
}

export function createUser(name: string): User {
  const data = readUsers();
  
  const existing = data.users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase().trim()
  );
  if (existing) {
    return existing;
  }

  const newUser: User = {
    id: generateId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  writeUsers(data);

  return newUser;
}

export function findOrCreateUser(name: string): User {
  const existing = getUserByName(name);
  if (existing) {
    return existing;
  }
  return createUser(name);
}
