import { NextRequest, NextResponse } from 'next/server'
import { generateToken, verifyToken } from '@/lib/auth'
import { getMagicLinkEmail, deleteMagicLink, storeSession } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // Validate token format
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Invalid or expired magic link' }, { status: 400 })
    }

    // Get email from magic link
    const email = await getMagicLinkEmail(token)

    if (!email) {
      return NextResponse.json({ error: 'Magic link has expired. Please request a new one.' }, { status: 401 })
    }

    // Create session token
    const sessionToken = generateToken()

    // Store session in KV
    await storeSession(sessionToken, email)

    // Delete the magic link (one-time use)
    await deleteMagicLink(token)

    return NextResponse.json(
      {
        success: true,
        email,
        sessionToken,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in verify-link:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to verify your link. Please try again or request a new one.',
      },
      { status: 500 }
    )
  }
}
