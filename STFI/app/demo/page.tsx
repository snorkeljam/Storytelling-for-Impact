'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Demo landing page for Storytelling for Impact.
 *
 * Flow:
 *   1. Visitor lands here, reads that this is a demo and data isn't saved.
 *   2. Fills name + organization + email (all required, hard gate).
 *   3. On submit we POST to /api/demo/signup, which stores the lead, emails
 *      james@story.as and simon@story.as, and returns a session token.
 *   4. We put that token in localStorage and redirect to /demo/workbook.
 *
 * No magic-link email round-trip — this is intentional. See the API route
 * for rationale.
 */
export default function DemoLandingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    // Defensive client-side validation; the server enforces this too.
    if (!name.trim() || !organization.trim() || !email.trim()) {
      setError('Please fill in all three fields.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/demo/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          organization: organization.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.token) {
        setError(
          data?.error ||
            'Something went wrong. Please try again or email james@story.as for help.'
        )
        setSubmitting(false)
        return
      }

      // Store the demo-mode session token under its own key so it doesn't
      // collide with the production magic-link session.
      try {
        window.localStorage.setItem('demo_session_token', data.token)
        window.localStorage.setItem('demo_name', name.trim())
      } catch {
        // localStorage can be blocked (private browsing). Session still
        // works if the user stays on the same tab; redirect anyway.
      }

      router.push('/demo/workbook')
    } catch {
      setError(
        'Network error. Please try again or email james@story.as for help.'
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#fff9e6',
              color: '#8a6d00',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            Demo Preview
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Storytelling for Impact
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666' }}>
            Interactive Workbook — Demo
          </p>
        </div>

        <p style={{ marginBottom: '1rem' }}>
          You&rsquo;re about to preview our <strong>Storytelling for Impact</strong>{' '}
          interactive workbook. This is a <strong>live demo</strong>, so you can
          click around the whole course, explore the activities, and get a real
          feel for the flow.
        </p>

        <div
          className="alert alert-info"
          style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}
        >
          <strong>Heads up:</strong> this is a demo environment. Any notes or
          answers you type <strong>won&rsquo;t be saved</strong> after you close the
          tab. Before we let you in, we just need to know who&rsquo;s exploring so
          we can follow up and answer questions.
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="demo-name">Your name</label>
            <input
              id="demo-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="demo-org">Organization</label>
            <input
              id="demo-org"
              type="text"
              required
              autoComplete="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="demo-email">Work email</label>
            <input
              id="demo-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Opening the demo…' : 'Enter the demo'}
          </button>
        </form>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#666',
            textAlign: 'center',
            marginTop: '1.25rem',
          }}
        >
          Having any trouble? Email{' '}
          <a href="mailto:james@story.as" className="link">
            james@story.as
          </a>{' '}
          and we&rsquo;ll get you in.
        </p>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #ddd',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            Course materials developed by <strong>Story As</strong> and{' '}
            <strong>Jackrabbit LX</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
