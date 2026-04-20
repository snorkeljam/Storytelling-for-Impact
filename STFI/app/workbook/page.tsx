'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionToken, clearSessionToken } from '@/lib/auth'
import Workbook from '@/components/Workbook'

export default function WorkbookPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getSessionToken()
    if (!token) {
      // Redirect to auth page if not authenticated
      router.push('/auth/request')
    } else {
      // Verify session is still valid
      const verifySession = async () => {
        try {
          const response = await fetch('/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })

          if (response.ok) {
            setAuthenticated(true)
          } else {
            clearSessionToken()
            router.push('/auth/request')
          }
        } catch {
          clearSessionToken()
          router.push('/auth/request')
        } finally {
          setLoading(false)
        }
      }

      verifySession()
    }
  }, [router])

  const handleLogout = () => {
    clearSessionToken()
    router.push('/auth/request')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>Loading...</h2>
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

  if (!authenticated) {
    return null // This will be handled by the useEffect redirect
  }

  return (
    <>
      <Workbook />
      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f0f0f0' }}>
        <button onClick={handleLogout} className="logout-btn" style={{ display: 'inline-block' }}>
          Logout
        </button>
      </div>
    </>
  )
}
