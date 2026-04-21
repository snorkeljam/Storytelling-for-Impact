import { createClient, RedisClientType } from 'redis'

/**
 * Redis client wrapper for Storytelling for Impact.
 *
 * Vercel's current Redis product exposes a single REDIS_URL env var and
 * expects the node-redis package. We previously used @vercel/kv, which is
 * deprecated for this provider. All function signatures are preserved so
 * the API routes don't need to change.
 *
 * Serverless caveat: Vercel's functions are short-lived lambdas, but multiple
 * invocations can reuse the same warm process. We cache a single connected
 * client at module scope so we only pay the TCP + TLS handshake once per
 * instance.
 */

let clientPromise: Promise<RedisClientType> | null = null

function getClient(): Promise<RedisClientType> {
  if (!clientPromise) {
    const url = process.env.REDIS_URL
    if (!url) {
      throw new Error(
        'REDIS_URL is not set. Connect a Redis database in the Vercel dashboard (Storage → Redis → Connect Project), then redeploy.'
      )
    }

    const client: RedisClientType = createClient({ url })

    // Swallow runtime errors so a blip doesn't crash the lambda — we'll
    // surface failures at the per-call try/catch layer instead.
    client.on('error', (err) => {
      console.error('Redis client error:', err)
    })

    clientPromise = client.connect().then(() => client)
  }
  return clientPromise
}

// ---------------------------------------------------------------------------
// Magic-link auth (production /auth flow)
// ---------------------------------------------------------------------------

const TOKEN_EXPIRY_SECONDS = 15 * 60 // 15 minutes

export async function storeMagicLink(token: string, email: string): Promise<void> {
  try {
    const redis = await getClient()
    await redis.set(`magic_link:${token}`, email, { EX: TOKEN_EXPIRY_SECONDS })
  } catch (error) {
    console.error('Failed to store magic link:', error)
    throw new Error('Failed to store authentication token')
  }
}

export async function getMagicLinkEmail(token: string): Promise<string | null> {
  try {
    const redis = await getClient()
    return await redis.get(`magic_link:${token}`)
  } catch (error) {
    console.error('Failed to retrieve magic link:', error)
    return null
  }
}

export async function deleteMagicLink(token: string): Promise<void> {
  try {
    const redis = await getClient()
    await redis.del(`magic_link:${token}`)
  } catch (error) {
    console.error('Failed to delete magic link:', error)
  }
}

export async function storeSession(token: string, email: string): Promise<void> {
  try {
    const redis = await getClient()
    // 30-day session
    await redis.set(`session:${token}`, email, { EX: 30 * 24 * 60 * 60 })
  } catch (error) {
    console.error('Failed to store session:', error)
    throw new Error('Failed to create session')
  }
}

export async function getSessionEmail(token: string): Promise<string | null> {
  try {
    const redis = await getClient()
    return await redis.get(`session:${token}`)
  } catch (error) {
    console.error('Failed to retrieve session:', error)
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    const redis = await getClient()
    await redis.del(`session:${token}`)
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}

// ---------------------------------------------------------------------------
// Demo-mode helpers
//
// See the /api/demo/signup route for how these are used. Unlike the
// magic-link flow, the demo does NOT require email verification — the form
// submission itself is the gate.
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
    const redis = await getClient()
    // lPush keeps newest-first; no TTL so the full list is preserved.
    await redis.lPush('demo:leads', JSON.stringify(lead))
  } catch (error) {
    console.error('Failed to store demo lead:', error)
    // Non-fatal — we still let the visitor into the demo.
  }
}

export async function storeDemoSession(
  token: string,
  lead: StoredDemoLead
): Promise<void> {
  try {
    const redis = await getClient()
    await redis.set(`demo_session:${token}`, JSON.stringify(lead), {
      EX: DEMO_SESSION_EXPIRY_SECONDS,
    })
  } catch (error) {
    console.error('Failed to store demo session:', error)
    throw new Error('Failed to create demo session')
  }
}

export async function getDemoSession(
  token: string
): Promise<StoredDemoLead | null> {
  try {
    const redis = await getClient()
    const raw = await redis.get(`demo_session:${token}`)
    if (!raw) return null
    try {
      return JSON.parse(raw) as StoredDemoLead
    } catch {
      return null
    }
  } catch (error) {
    console.error('Failed to retrieve demo session:', error)
    return null
  }
}
