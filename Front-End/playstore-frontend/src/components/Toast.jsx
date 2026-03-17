import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : styles.hidden}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={() => { setVisible(false); setTimeout(onClose, 300) }}>✕</button>
    </div>
  )
}

// Toast container to manage multiple toasts
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
