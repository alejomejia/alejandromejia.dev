'use client'

import { useEffect } from 'react'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Last-resort error boundary. Next renders this only when a root layout itself
 * throws, so it replaces the whole document and must provide its own
 * `<html>`/`<body>`. Kept dependency-light with inline styles; the app's CSS
 * and fonts may be exactly what failed to load.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#0a0a0a',
          color: '#ededed',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: '28rem', color: '#a1a1aa', margin: 0 }}>
          A critical error occurred and the page could not be displayed. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 'none',
            borderRadius: '9999px',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            background: '#ededed',
            color: '#0a0a0a',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
