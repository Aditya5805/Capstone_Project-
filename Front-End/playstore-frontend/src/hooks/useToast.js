import { useState, useCallback } from 'react'
let id = 0
export function useToast() {
  const [toasts, setToasts] = useState([])
  const removeToast = useCallback((tid) => setToasts(p => p.filter(t => t.id !== tid)), [])

  // toast(message, type) — works as a plain function AND has .success/.error/.info helpers
  const toast = useCallback((message, type = 'success') => {
    const tid = ++id
    setToasts(p => [...p, { id: tid, message, type }])
  }, [])
  toast.success = (m) => toast(m, 'success')
  toast.error   = (m) => toast(m, 'error')
  toast.info    = (m) => toast(m, 'info')

  return { toasts, removeToast, toast }
}
