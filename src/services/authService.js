import { authApi } from './api'

// auth-service → localhost:8080, proxied via /auth
export const authService = {
  register:    (data)  => authApi.post('/auth/register', data),
  login:       (data)  => authApi.post('/auth/login', data),
  logout:      (token) => authApi.post('/auth/logout', null, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getUserById: (id)    => authApi.get(`/auth/${id}`),
}
