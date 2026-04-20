'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RequestMagicLink() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send magic link')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        {submitted ? (
          <>
            <h1>Check Your Email</h1>
            <div className="alert alert-success">
              ✅ We've sent a magic link to <strong>{email}</strong>
            </div>
            <p>
              Click the link in your email to access the Storytelling for Impact workbook. The link expires in 15
              minutes.
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => {
                setEmail('')
                setSubmitted(false)
              }}
              className="btn"
              style={{ marginTop: '2rem' }}
            >
              Send Another Link
            </button>
          </>
        ) : (
          <>
            <h1>Access the Workbook</h1>
            <p>Enter your email to receive a magic link and start working on the interactive workbook.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn" disabled={loading || !email.trim()}>
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
              🔒 No password needed. We'll send you a secure link to access your personalized workbook.
            </p>
          </>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem' }}>
            Made by <strong>Jackrabbit LX</strong> • Part of Storytelling for Impact
          </p>
        </div>
      </div>
    </div>
  )
}
