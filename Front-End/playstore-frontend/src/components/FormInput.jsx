import { useState } from 'react'
import styles from './FormInput.module.css'

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  autoComplete,
  icon,
}) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.req}>*</span>}
        </label>
      )}
      <div
        className={`${styles.inputBox} ${focused ? styles.focused : ''} ${
          error ? styles.errored : ''
        }`}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={styles.input}
        />
        {type === 'password' && (
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword((p) => !p)}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
