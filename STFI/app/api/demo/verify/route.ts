import { NextRequest, NextResponse } from 'next/server'
import { getDemoSession } from '@/lib/kv'

/**
 * POST /api/demo/verify
 *
 * Body: { token: string }
 *
 * Used by /demo/workbook to check that the visitor filled out the landing-page
 * form before we render the course. Returns 200 with minimal lead info so the
 * demo banner can personalize ("Welcome, {name}") if we ever want that.
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
    }

    const lead = await getDemoSession(token)
    if (!lead) {
      return NextResponse.json(
        { error: 'Demo session not found or expired.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        valid: true,
        name: lead.name,
        organization: lead.organization,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying demo session:', error)
    return NextResponse.json(
      { error: 'Failed to verify demo session.' },
      { status: 500 }
    )
  }
}
