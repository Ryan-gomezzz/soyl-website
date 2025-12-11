import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || ''
  if (!secret) {
    throw new Error('Admin secret is not configured. Set ADMIN_JWT_SECRET or ADMIN_PASSWORD.')
  }
  return secret
}

function signToken(subject: string, ttlMs: number = DEFAULT_TTL_MS) {
  const exp = Date.now() + ttlMs
  const payload = `${subject}.${exp}`
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyToken(token: string | undefined) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [sub, expStr, signature] = parts
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Date.now()) return false

  const expected = crypto.createHmac('sha256', getSecret()).update(`${sub}.${exp}`).digest('base64url')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function setAdminSessionCookie() {
  const token = signToken('admin')
  const cookieStore = await cookies()
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(Date.now() + DEFAULT_TTL_MS),
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticatedFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifyToken(token)
}

export { COOKIE_NAME }

