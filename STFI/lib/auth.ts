import crypto from 'crypto'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateMagicLink(baseUrl: string, token: string): string {
  return `${baseUrl}/auth/verify?token=${token}`
}

export function verifyToken(token: string): boolean {
  // Token is valid if it exists and is a valid hex string
  return /^[a-f0-9]{64}$/.test(token)
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('session_token')
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('session_token', token)
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('session_token')
}

export function isAuthenticated(): boolean {
  return getSessionToken() !== null
}
