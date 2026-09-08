import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, ArrowLeftRight, PieChart, Repeat, Upload, LogOut, Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PieChart },
  { to: '/recurring', label: 'Recurring', icon: Repeat },
  { to: '/import', label: 'Import', icon: Upload },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = (user?.fullName || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile Top Header Bar — visible only on small screens */}
      <header className="mobile-header-bar">
        <div className="flex items-center gap-3">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={18} strokeWidth={1.8} />
            <span>Menu</span>
          </button>
          <div style={styles.brand}>
            <div style={styles.brandMark}>K</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>KURA</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          style={styles.themeToggle}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
        </button>
      </header>

      {/* Backdrop behind the sidebar when open on mobile */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobile}
      />

      <aside className={`app-sidebar ${mobileOpen ? 'sidebar-open' : ''}`} style={styles.sidebar}>
        <div className="flex items-center justify-between" style={{ padding: '4px 8px 22px 8px' }}>
          <div style={styles.brand}>
            <div style={styles.brandMark}>K</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>KURA</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              style={styles.themeToggle}
              title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
            </button>
            {/* Close button — strictly visible on mobile drawer only */}
            <button className="mobile-close-btn" onClick={closeMobile} style={styles.themeToggle} aria-label="Close menu">
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobile}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.userName}>{user?.fullName}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={logout}>
            <LogOut size={15} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

const styles = {
  sidebar: {
    width: 232,
    flexShrink: 0,
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 14px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 4,
    background: 'var(--color-accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
  },
  themeToggle: {
    width: 26,
    height: 26,
    borderRadius: 4,
    border: '1px solid var(--color-border-strong)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 10px',
    borderRadius: 4,
    fontSize: 13.5,
    fontWeight: 500,
    color: 'var(--color-text-muted)',
  },
  navItemActive: {
    background: 'var(--color-accent-tint)',
    color: 'var(--color-accent)',
    fontWeight: 600,
  },
  footer: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '0 8px',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 4,
    background: 'var(--color-surface-sunken)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--color-accent)',
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 11.5,
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}