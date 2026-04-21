import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { storeDemoLead, storeDemoSession, StoredDemoLead } from '@/lib/kv'
import { sendDemoSignupNotification } from '@/lib/email'

/**
 * POST /api/demo/signup
 *
 * Body: { name: string, organization: string, email: string }
 *
 * - Validates fields are present and email looks like an email
 * - Appends the lead to the KV-backed demo leads list
 * - Creates a 24-hour demo session token
 * - Fires an inbox notification to james@story.as and simon@story.as
 * - Returns the session token so the client can store it and open /demo/workbook
 *
 * Notes:
 * - There is NO magic-link / email verification step for the demo — this is
 *   intentional. The goal is lead capture and friction-free access.
 * - If the email notification fails we still let the user into the demo; we
 *   just log the error. We never want a transient Resend hiccup to block a
 *   prospective lead from seeing the course.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const organization =
      typeof body.organization === 'string' ? body.organization.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization is required.' },
        { status: 400 }
      )
    }
    if (!email || !isLikelyEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      )
    }

    const lead: StoredDemoLead = {
      name,
      organization,
      email,
      submittedAt: new Date().toISOString(),
    }

    // Persist the lead (non-fatal on failure — best-effort list).
    await storeDemoLead(lead)

    // Create session so /demo/workbook can verify the visitor came through the gate.
    const token = generateToken()
    await storeDemoSession(token, lead)

    // Fire-and-forget the internal inbox notification. Errors are logged inside.
    await sendDemoSignupNotification(lead)

    return NextResponse.json(
      {
        success: true,
        token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in demo signup:', error)
    return NextResponse.json(
      {
        error:
          'Something went wrong. Please try again, or email james@story.as for help.',
      },
      { status: 500 }
    )
  }
}

function isLikelyEmail(value: string): boolean {
  // Intentionally lenient — we just want to catch obvious typos like missing @.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
