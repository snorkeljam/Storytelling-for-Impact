'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setSessionToken } from '@/lib/auth'

export default function VerifyMagicLink() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyLink = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('Invalid magic link. No token provided.')
        return
      }

      try {
        const response = await fetch('/api/auth/verify-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to verify link')
        }

        const data = await response.json()
        setSessionToken(data.sessionToken)
        setStatus('success')
        setMessage('Link verified! Redirecting to your workbook...')

        // Redirect to workbook after 2 seconds
        setTimeout(() => {
          router.push('/workbook')
        }, 2000)
      } catch (err) {
        setStatus('error')
        setMessage(
          err instanceof Error
            ? err.message
            : 'Failed to verify your link. It may have expired. Please request a new one.'
        )
      }
    }

    verifyLink()
  }, [searchParams, router])

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>
          {status === 'verifying' && 'Verifying Your Link...'}
          {status === 'success' && '✅ Success!'}
          {status === 'error' && '❌ Oops'}
        </h1>

        <p style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>{message}</p>

        {status === 'verifying' && (
          <div style={{ textAlign: 'center' }}>
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
        )}

        {status === 'error' && (
          <a href="/auth/request" className="btn" style={{ display: 'inline-block', textAlign: 'center' }}>
            Request New Magic Link
          </a>
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
