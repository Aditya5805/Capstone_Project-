import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ps_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('ps_token')
    const storedUser  = localStorage.getItem('ps_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      try { setUser(JSON.parse(storedUser)) } catch { localStorage.removeItem('ps_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password })
    const { token, email: userEmail, role } = res.data
    const userData = { email: userEmail, role }
    setToken(token); setUser(userData)
    localStorage.setItem('ps_token', token)
    localStorage.setItem('ps_user', JSON.stringify(userData))
    return res.data
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    const res = await authService.register({ name, email, password, role })
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout(token) } catch {}
    finally {
      setToken(null); setUser(null)
      localStorage.removeItem('ps_token')
      localStorage.removeItem('ps_user')
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
