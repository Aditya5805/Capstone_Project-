import { appApi } from './api'

// app-service → localhost:8081, proxied via /apps and /categories
export const appService = {
  // Applications
  getAllApps:       ()         => appApi.get('/apps'),
  getAppById:       (id)       => appApi.get(`/apps/${id}`),
  createApp:        (data)     => appApi.post('/apps', data),
  updateApp:        (id, data) => appApi.put(`/apps/${id}`, data),
  deleteApp:        (id)       => appApi.delete(`/apps/${id}`),
  toggleVisibility: (id)       => appApi.patch(`/apps/${id}/visibility`),
  getMyApps:        ()         => appApi.get('/apps/my'),
  searchApps:       (name)     => appApi.get(`/apps/search?name=${encodeURIComponent(name)}`),
  getByCategory:    (catId)    => appApi.get(`/apps/category/${catId}`),
  getByGenre:       (genre)    => appApi.get(`/apps/genre/${genre}`),
  getByRating:      (min)      => appApi.get(`/apps/rating?min=${min}`),

  // Categories
  getAllCategories:  ()         => appApi.get('/categories'),
  getCategoryById:  (id)       => appApi.get(`/categories/${id}`),
  createCategory:   (data)     => appApi.post('/categories', data),
  updateCategory:   (id, data) => appApi.put(`/categories/${id}`, data),
  deleteCategory:   (id)       => appApi.delete(`/categories/${id}`),
}
