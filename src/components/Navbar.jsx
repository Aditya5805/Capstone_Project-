import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/interactionService'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login')
  }

  const userLinks = [
    { to: '/apps',          label: 'Browse Apps', icon: '🔍' },
    { to: '/downloads',     label: 'Downloads',   icon: '⬇' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  const ownerLinks = [
    { to: '/owner/apps',    label: 'My Apps',     icon: '📱' },
    { to: '/owner/create',  label: 'Add App',     icon: '➕' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  const navLinks = isAuthenticated
    ? (user?.role === 'OWNER' ? ownerLinks : userLinks)
    : []

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>▶</span>
          <span className={styles.brandText}>PlayStore</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={`${styles.link} ${isActive(l.to) ? styles.active : ''}`}>
              <span className={styles.linkIcon}>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          {isAuthenticated ? (
            <>
              <div className={styles.userBadge}>
                <span className={styles.userEmail}>{user?.email}</span>
                <span className={`${styles.rolePill} ${user?.role === 'OWNER' ? styles.roleOwner : styles.roleUser}`}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout} disabled={loggingOut} className={styles.logoutBtn}>
                {loggingOut ? '…' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.link} ${isActive('/login') ? styles.active : ''}`}>Sign in</Link>
              <Link to="/register" className={styles.ctaBtn}>Get started</Link>
            </>
          )}
          {/* Mobile hamburger */}
          <button className={styles.hamburger} onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              {l.icon} {l.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <>
              <Link to="/login"    className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Get started</Link>
            </>
          )}
          {isAuthenticated && (
            <button className={styles.mobileLink} onClick={handleLogout}>Sign out</button>
          )}
        </div>
      )}
    </nav>
  )
}
