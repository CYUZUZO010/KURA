import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggleButton from '../components/shared/ThemeToggleButton'

export default function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register, loading, error } = useAuth()

  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const ok = await login(loginEmail, loginPassword)
    if (ok) navigate('/dashboard')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const ok = await register(regName, regEmail, regPassword)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <div style={{ position: 'fixed', top: 20, right: 20 }}>
      <ThemeToggleButton />
    </div>
      <div style={styles.wordmarkRow}>
        <div style={styles.mark}>K</div>
        <span style={styles.wordmark}>KURA</span>
      </div>

      <div className="auth-card" style={styles.card}>
        <div
          style={{
            ...styles.track,
            transform: mode === 'login' ? 'translateX(0%)' : 'translateX(-50%)',
          }}
        >
          {/* Scene 1 — login form on the left, signup promo on the right */}
          <div className="auth-scene" style={styles.scene}>
            <FormPane>
              <h1 className="text-display" style={styles.heading}>Welcome back</h1>
              <p className="text-muted" style={{ marginBottom: 26 }}>Sign in to see where your money went.</p>

              <form onSubmit={handleLogin} className="flex-col gap-4">
                <div className="field">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                {mode === 'login' && error && <ErrorBox message={error} />}

                <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </FormPane>

            <AccentPane
              title="New here?"
              text="Create an account to start tracking your spending, set budgets, and see the trend."
              cta="Create account"
              onClick={() => setMode('register')}
            />
          </div>

          {/* Scene 2 — signin promo on the left, register form on the right */}
          <div className="auth-scene" style={styles.scene}>
            <AccentPane
              title="Welcome back"
              text="Already tracking your money with us? Sign back in to pick up where you left off."
              cta="Sign in"
              onClick={() => setMode('login')}
            />

            <FormPane>
              <h1 className="text-display" style={styles.heading}>Create your account</h1>
              <p className="text-muted" style={{ marginBottom: 26 }}>Track spending, set budgets, see the trend.</p>

              <form onSubmit={handleRegister} className="flex-col gap-4">
                <div className="field">
                  <label>Full name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Jordan Lee"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="At least 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>

                {mode === 'register' && error && <ErrorBox message={error} />}

                <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            </FormPane>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormPane({ children }) {
  return <div className="auth-form-pane" style={styles.formPane}>{children}</div>
}

function AccentPane({ title, text, cta, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="auth-accent-pane" style={styles.accentPane}>
      <div>
        <h2 style={styles.accentTitle}>{title}</h2>
        <p style={styles.accentText}>{text}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.accentButton,
          background: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
          borderColor: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
        }}
      >
        {cta}
      </button>
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div style={{
      background: 'var(--color-negative-tint)',
      color: 'var(--color-negative)',
      padding: '10px 12px',
      borderRadius: 4,
      fontSize: 13,
    }}>
      {message}
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    padding: 20,
  },
  wordmarkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    marginBottom: 22,
  },
  mark: {
    width: 30,
    height: 30,
    borderRadius: 4,
    background: 'var(--color-accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
  },
  wordmark: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '-0.01em',
    color: 'var(--color-text)',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    position: 'relative',
  },
  track: {
    display: 'flex',
    width: '200%',
    height: '100%',
    transition: 'transform 480ms cubic-bezier(0.65, 0, 0.35, 1)',
  },
  scene: {
    width: '50%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    flexShrink: 0,
  },
  formPane: {
    padding: '52px 44px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  heading: {
    fontSize: 22,
    marginBottom: 4,
  },
  accentPane: {
    background: 'var(--color-accent)',
    color: '#fff',
    padding: '52px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 28,
  },
  accentTitle: {
    fontSize: 21,
    fontWeight: 700,
    marginBottom: 10,
    letterSpacing: '-0.01em',
  },
  accentText: {
    fontSize: 13.5,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.82)',
  },
  accentButton: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.6)',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 150ms ease, border-color 150ms ease',
  },
}