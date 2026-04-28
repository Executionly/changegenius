'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/lib/auth'
import { dividerStyle, googleBtnStyle } from '@/components/auth/AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await signIn({ email, password })
    if (res.error) { setError(res.error); setLoading(false); return }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const res = await signInWithGoogle()
    if (res.error) { setError(res.error); setGoogleLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--sage)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:'var(--radius)', padding:'52px 44px', maxWidth:420, width:'100%', boxShadow:'0 4px 24px rgba(10,37,64,.08)' }}>
        <Link href="/" style={{ fontSize:16, fontWeight:800, color:'var(--navy)', textDecoration:'none', display:'block', marginBottom:20 }}>ChangeGenius™</Link>
        <h1 style={{ fontSize:26, fontWeight:800, color:'var(--navy)', marginBottom:6 }}>Welcome back</h1>
        <p style={{ fontSize:14, color:'var(--text-3)', marginBottom:28 }}>Sign in to your account</p>
        {/* Google */}
        <button onClick={handleGoogle} disabled={googleLoading} style={googleBtnStyle}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.805.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>
        <div style={dividerStyle}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#dc2626', marginBottom:16 }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{ width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{ width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding:'12px', background:'var(--blue)', color:'white', border:'none', borderRadius:'100px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', opacity:loading?0.7:1 }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--text-3)' }}>
          <Link href="/forgot-password" style={{ color:'var(--blue)', textDecoration:'none' }}>Forgot password?</Link>
          <span style={{ margin:'0 10px' }}>·</span>
          <Link href="/signup" style={{ color:'var(--blue)', textDecoration:'none' }}>Create account</Link>
        </div>
      </div>
    </div>
  )
}
