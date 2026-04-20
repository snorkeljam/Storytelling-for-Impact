import { kv } from '@vercel/kv'

const TOKEN_EXPIRY = 15 * 60 * 1000 // 15 minutes in milliseconds

export async function storeMagicLink(token: string, email: string): Promise<void> {
  try {
    // Store the token with the email for verification
    await kv.setex(`magic_link:${token}`, Math.ceil(TOKEN_EXPIRY / 1000), email)
  } catch (error) {
    console.error('Failed to store magic link:', error)
    throw new Error('Failed to store authentication token')
  }
}

export async function getMagicLinkEmail(token: string): Promise<string | null> {
  try {
    const email = await kv.get(`magic_link:${token}`)
    return email as string | null
  } catch (error) {
    console.error('Failed to retrieve magic link:', error)
    return null
  }
}

export async function deleteMagicLink(token: string): Promise<void> {
  try {
    await kv.del(`magic_link:${token}`)
  } catch (error) {
    console.error('Failed to delete magic link:', error)
  }
}

export async function storeSession(token: string, email: string): Promise<void> {
  try {
    // Store session for 30 days
    await kv.setex(`session:${token}`, 30 * 24 * 60 * 60, email)
  } catch (error) {
    console.error('Failed to store session:', error)
    throw new Error('Failed to create session')
  }
}

export async function getSessionEmail(token: string): Promise<string | null> {
  try {
    const email = await kv.get(`session:${token}`)
    return email as string | null
  } catch (error) {
    console.error('Failed to retrieve session:', error)
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await kv.del(`session:${token}`)
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}
