import { useState } from 'react'
import InvoiceModal from '../components/InvoiceModal'

export default function InvoicePage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const correct = import.meta.env.VITE_INVOICE_PASSWORD
    if (password === correct) {
      setError('')
      setUnlocked(true)
    } else {
      setError('Incorrect password')
    }
  }

  if (unlocked) {
    return <InvoiceModal open={true} onClose={() => {}} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF7F2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', color: '#1A1A1A', lineHeight: 1 }}>
            echorise
          </span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#FF6A00', lineHeight: 1 }}>
            .
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(255,106,0,0.08)',
              border: '1.5px solid rgba(255,106,0,0.25)',
              color: '#FF6A00',
            }}
          >
            Admin Access
          </span>
        </div>
      </div>

      {/* Login card */}
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          background: '#FFFFFF',
          border: '1px solid rgba(75,63,114,0.10)',
          borderRadius: '20px',
          boxShadow: '0 2px 16px rgba(26,26,26,0.06)',
          padding: '32px 28px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '1.4rem',
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            marginBottom: '6px',
          }}
        >
          Sign In
        </h1>
        <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '24px' }}>
          Enter your password to access the invoice panel.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6B6B6B',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••••••"
              autoComplete="current-password"
              style={{
                width: '100%',
                borderRadius: '12px',
                padding: '11px 16px',
                fontSize: '14px',
                outline: 'none',
                background: '#F5F3F0',
                border: error ? '1.5px solid #ee0979' : '1.5px solid transparent',
                color: '#1A1A1A',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = '#FF6A00' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'transparent' }}
            />
            {error && (
              <p style={{ fontSize: '12px', color: '#ee0979', marginTop: '6px' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '999px',
              background: '#FF6A00',
              color: '#FFFFFF',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,106,0,0.28)',
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = '#E85F00'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(255,106,0,0.40)' }}
            onMouseLeave={e => { e.target.style.background = '#FF6A00'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(255,106,0,0.28)' }}
          >
            Login →
          </button>
        </form>
      </div>
    </div>
  )
}
