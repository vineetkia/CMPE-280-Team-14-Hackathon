import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'studypilot-dev-secret-change-in-production';
const TOKEN_NAME = 'studypilot_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

// ─── Password hashing ──────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT token ──────────────────────────────────────────
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ─────────────────────────────────────
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.DISABLE_SECURE_COOKIE !== 'true',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

// ─── Get current user from request ──────────────────────
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

// ─── Require auth (throws if not authenticated) ─────────
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
