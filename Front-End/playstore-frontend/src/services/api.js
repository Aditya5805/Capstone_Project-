import axios from 'axios'

// Each microservice has its own base URL.
// In dev, Vite proxy (vite.config.js) routes by path prefix — no CORS issues.
// In prod, set these env vars to the actual deployed URLs.
const AUTH_BASE         = import.meta.env.VITE_AUTH_URL         || 'http://localhost:8080/'   // proxied → localhost:8080
const APP_BASE          = import.meta.env.VITE_APP_URL          || 'http://localhost:8081/'   // proxied → localhost:8081
const INTERACTION_BASE  = import.meta.env.VITE_INTERACTION_URL  || 'http://localhost:8082/'   // proxied → localhost:8082

const makeInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  })

  // Attach JWT to every request
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('ps_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // Global error handling
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('ps_token')
        localStorage.removeItem('ps_user')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
  return instance
}

// Three separate axios instances — one per microservice
export const authApi        = makeInstance(AUTH_BASE)
export const appApi         = makeInstance(APP_BASE)
export const interactionApi = makeInstance(INTERACTION_BASE)

// Default export for backwards compatibility
export default authApi
