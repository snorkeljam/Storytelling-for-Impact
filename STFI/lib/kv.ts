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

// ---------------------------------------------------------------------------
// Demo-mode helpers
//
// The demo flow does NOT use a magic-link email round-trip. Instead, the
// landing page form submits name/org/email, and on success we:
//   1. Append the lead to a running KV list (`demo:leads`) for James/Simon to
//      review later if they want a full list.
//   2. Create a short-lived session token tied to that lead so the workbook
//      can verify the user came through the gate.
// ---------------------------------------------------------------------------

const DEMO_SESSION_EXPIRY_SECONDS = 24 * 60 * 60 // 24 hours

export interface StoredDemoLead {
  name: string
  organization: string
  email: string
  submittedAt: string
}

export async function storeDemoLead(lead: StoredDemoLead): Promise<void> {
  try {
    // lpush keeps newest first; no TTL so the full list is preserved.
    await kv.lpush('demo:leads', JSON.stringify(lead))
  } catch (error) {
    console.error('Failed to store demo lead:', error)
    // Non-fatal — we still want the user to be able to enter the demo.
  }
}

export async function storeDemoSession(
  token: string,
  lead: StoredDemoLead
): Promise<void> {
  try {
    await kv.setex(
      `demo_session:${token}`,
      DEMO_SESSION_EXPIRY_SECONDS,
      JSON.stringify(lead)
    )
  } catch (error) {
    console.error('Failed to store demo session:', error)
    throw new Error('Failed to create demo session')
  }
}

export async function getDemoSession(
  token: string
): Promise<StoredDemoLead | null> {
  try {
    const raw = await kv.get(`demo_session:${token}`)
    if (!raw) return null
    // Vercel KV may return either a string or an already-parsed object
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw) as StoredDemoLead
      } catch {
        return null
      }
    }
    return raw as StoredDemoLead
  } catch (error) {
    console.error('Failed to retrieve demo session:', error)
    return null
  }
}
