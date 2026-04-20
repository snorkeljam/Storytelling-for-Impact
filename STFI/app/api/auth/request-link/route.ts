import { NextRequest, NextResponse } from 'next/server'
import { generateToken, generateMagicLink } from '@/lib/auth'
import { storeMagicLink } from '@/lib/kv'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Generate token and magic link
    const token = generateToken()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const magicLink = generateMagicLink(baseUrl, token)

    // Store in Vercel KV
    await storeMagicLink(token, email)

    // Send email
    await sendMagicLinkEmail(email, magicLink)

    return NextResponse.json(
      {
        success: true,
        message: 'Magic link sent to your email',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in request-link:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process your request. Please try again.',
      },
      { status: 500 }
    )
  }
}
