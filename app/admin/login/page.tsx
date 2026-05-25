'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirect     = searchParams.get('redirect') ?? '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Login failed')
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:      #080E1C;
          --navy-2:    #0D1628;
          --navy-3:    #131F38;
          --border:    rgba(255,255,255,0.07);
          --border-hi: rgba(255,255,255,0.14);
          --purple:    #6C3FC5;
          --purple-hi: #7C4FD5;
          --gold:      #F4C842;
          --gold-dim:  rgba(244,200,66,0.12);
          --white:     #FFFFFF;
          --white-60:  rgba(255,255,255,0.6);
          --white-30:  rgba(255,255,255,0.3);
          --white-10:  rgba(255,255,255,0.08);
          --red:       #EF4444;
          --red-dim:   rgba(239,68,68,0.12);
          --green:     #10B981;
          --ff-head:   'Syne', sans-serif;
          --ff-mono:   'DM Mono', monospace;
        }

        html, body { height: 100%; }

        body {
          font-family: var(--ff-head);
          background: var(--navy);
          color: var(--white);
          min-height: 100vh;
          overflow: hidden;
        }

        
      `}</style>

      <div className="scene">

        {/* ── Left panel ── */}
        <div className="left">
          <div className="left-bg" />

          <div className="brand">
            <div className="brand-badge">
              <span className="brand-badge-dot" />
              Admin Console
            </div>
            <div className="brand-name">Change Genius™</div>
            <div className="brand-title">
              Intelligence<br />
              <span>Command</span><br />
              Centre
            </div>
          </div>

          <div className="left-stats">
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div>
                  <div className="stat-label">Access Level</div>
                  <div className="stat-value">Role-Based Control</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🔒</div>
                <div>
                  <div className="stat-label">Security</div>
                  <div className="stat-value">Fully Audited Actions</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div>
                  <div className="stat-label">Intelligence</div>
                  <div className="stat-value">Real-Time Diagnostics</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="right">
          <div className="right-bg" />

          <div className="form-wrap">
            <div className="form-header">
              <div className="form-eyebrow">Restricted Access</div>
              <div className="form-title">Admin Sign In</div>
              <div className="form-sub">
                Authorised personnel only. All activity is logged and monitored.
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {error && (
                <div className="error-box" role="alert">
                  <span className="error-icon">⚠</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              <div className="field">
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <div className="field-input-wrap">
                  <input
                    id="email"
                    type="email"
                    className="field-input"
                    placeholder="admin@changegeniusai.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="field-input-wrap">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    className="field-input has-toggle"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Access Console
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <div className="footer-line" />
              <span className="footer-text">Change Genius™ · Admin Console</span>
              <div className="footer-line" />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}