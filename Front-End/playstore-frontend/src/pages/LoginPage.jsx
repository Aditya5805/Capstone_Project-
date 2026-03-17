import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'
import styles from './AuthPage.module.css'

const ROLES = [
  {
    value: 'USER',
    icon: '👤',
    label: 'User',
    desc: 'Browse & download apps',
  },
  {
    value: 'OWNER',
    icon: '🏪',
    label: 'Owner',
    desc: 'Publish & manage apps',
  },
]

export default function LoginPage({ addToast }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('USER')
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      // Warn if they picked a role that doesn't match their actual account role
      if (data.role !== selectedRole) {
        addToast(
          `Heads up — your account is registered as ${data.role}, not ${selectedRole}.`,
          'info'
        )
      } else {
        addToast(`Welcome back! Signed in as ${data.role}`, 'success')
      }
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data || 'Invalid email or password'
      addToast(typeof msg === 'string' ? msg : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card} style={{ animationDelay: '0.1s' }}>
        <div className={styles.header}>
          <div className={styles.logo}>▶</div>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>Welcome back to PlayStore</p>
        </div>

        {/* Role selector — shown ABOVE the form fields */}
        <div className={styles.roleSection} style={{ marginBottom: '20px' }}>
          <p className={styles.roleLabel}>Sign in as</p>
          <div className={styles.roleCards}>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRole(r.value)}
                className={`${styles.roleCard} ${selectedRole === r.value ? styles.roleActive : ''}`}
              >
                <span className={styles.roleIcon}>{r.icon}</span>
                <span className={styles.roleName}>{r.label}</span>
                <span className={styles.roleDesc}>{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput
            label="Email address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
            icon="✉"
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            error={errors.password}
            autoComplete="current-password"
            icon="🔒"
            required
          />

          <button
            type="submit"
            className={`${styles.submitBtn} ${selectedRole === 'OWNER' ? styles.submitBtnOwner : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                {ROLES.find((r) => r.value === selectedRole)?.icon}&nbsp;&nbsp;
                Sign in as {ROLES.find((r) => r.value === selectedRole)?.label}
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
