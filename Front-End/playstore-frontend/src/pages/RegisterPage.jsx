import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'
import styles from './AuthPage.module.css'

export default function RegisterPage({ addToast }) {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
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
      await register(form.name, form.email, form.password, form.role)
      addToast('Account created! Please sign in.', 'success')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data || 'Registration failed'
      addToast(typeof msg === 'string' ? msg : 'Registration failed', 'error')
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
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join PlayStore today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormInput
            label="Full name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Aditya Shukla"
            error={errors.name}
            autoComplete="name"
            icon="👤"
            required
          />
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
            placeholder="Min. 6 characters"
            error={errors.password}
            autoComplete="new-password"
            icon="🔒"
            required
          />
          <FormInput
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            error={errors.confirmPassword}
            autoComplete="new-password"
            icon="🔒"
            required
          />

          {/* Role Selector */}
          <div className={styles.roleSection}>
            <p className={styles.roleLabel}>Account type</p>
            <div className={styles.roleCards}>
              {['USER', 'OWNER'].map((r) => (
                <label
                  key={r}
                  className={`${styles.roleCard} ${form.role === r ? styles.roleActive : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                    className={styles.roleInput}
                  />
                  <span className={styles.roleIcon}>{r === 'USER' ? '👤' : '🏪'}</span>
                  <span className={styles.roleName}>{r}</span>
                  <span className={styles.roleDesc}>
                    {r === 'USER' ? 'Browse & download apps' : 'Publish & manage apps'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : 'Create account'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
