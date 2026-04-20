import { NextRequest, NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No session token provided' }, { status: 401 })
    }

    const email = await getSessionEmail(token)

    if (!email) {
      return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: true,
        email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in verify-session:', error)
    return NextResponse.json(
      {
        error: 'Failed to verify session',
      },
      { status: 500 }
    )
  }
}
