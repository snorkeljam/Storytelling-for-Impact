'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Workbook from '@/components/Workbook'

/**
 * /demo/workbook
 *
 * Renders the full Storytelling for Impact workbook behind a lightweight
 * demo-session gate:
 *   - Reads the demo_session_token localStorage key set by /demo
 *   - POSTs it to /api/demo/verify to confirm the visitor filled out the form
 *   - If invalid, redirects back to /demo
 *
 * A persistent DEMO banner is sticky-pinned to the top of the page to keep
 * it visually clear that progress is not being saved.
 */
export default function DemoWorkbookPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visitorName, setVisitorName] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const token =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('demo_session_token')
          : null
      const cachedName =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('demo_name')
          : null

      if (!token) {
        router.push('/demo')
        return
      }

      try {
        const response = await fetch('/api/demo/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (cancelled) return

        if (response.ok) {
          const data = await response.json().catch(() => ({}))
          setVisitorName(data?.name || cachedName || null)
          setAuthorized(true)
          setLoading(false)
        } else {
          // Session expired or bogus token — clear and bounce back to form.
          try {
            window.localStorage.removeItem('demo_session_token')
            window.localStorage.removeItem('demo_name')
          } catch {
            /* ignore */
          }
          router.push('/demo')
        }
      } catch {
        if (cancelled) return
        router.push('/demo')
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [router])

  const handleExit = () => {
    try {
      window.localStorage.removeItem('demo_session_token')
      window.localStorage.removeItem('demo_name')
    } catch {
      /* ignore */
    }
    router.push('/demo')
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Loading the demo…</h2>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e66c5c',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null // router.push is in flight
  }

  return (
    <>
      {/* Persistent DEMO banner — sticky so it stays visible as the user scrolls */}
      <div
        role="status"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#fff9e6',
          borderBottom: '2px solid #e66c5c',
          color: '#1f2a44',
          padding: '0.65rem 1rem',
          fontSize: '0.9rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem 1rem',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <span>
          <strong>DEMO</strong>
          {visitorName ? ` — Welcome, ${visitorName}.` : ''} Your progress in
          this preview <strong>will not be saved</strong>.
        </span>
        <span style={{ color: '#666' }}>
          Questions?{' '}
          <a href="mailto:james@story.as" className="link">
            james@story.as
          </a>
        </span>
        <button
          onClick={handleExit}
          style={{
            backgroundColor: 'transparent',
            color: '#1f2a44',
            border: '1px solid #1f2a44',
            borderRadius: '4px',
            padding: '0.25rem 0.7rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Exit demo
        </button>
      </div>

      <Workbook />
    </>
  )
}
