import { interactionApi } from './api'

// interaction-service → localhost:8082

export const reviewService = {
  submitReview:      (data)  => interactionApi.post('/reviews', data),
  getReviewsByApp:   (appId) => interactionApi.get(`/reviews/app/${appId}`),
  getMyReviews:      ()      => interactionApi.get('/reviews/my'),
  getMyReviewForApp: (appId) => interactionApi.get(`/reviews/my/app/${appId}`),
  deleteReview:      (appId) => interactionApi.delete(`/reviews/app/${appId}`),

  // NEW (USE SAME BASE API)
  getAverageRating:  (appId) => interactionApi.get(`/reviews/app/${appId}/average`)
}

export const downloadService = {
  downloadApp:       (data)  => interactionApi.post('/downloads', data),
  getMyDownloads:    ()      => interactionApi.get('/downloads/my'),
  getDownloadsByApp: (appId) => interactionApi.get(`/downloads/app/${appId}`),
  getDownloadCount:  (appId) => interactionApi.get(`/downloads/app/${appId}/count`),
  hasDownloaded:     (appId) => interactionApi.get(`/downloads/app/${appId}/check`),
}

export const notificationService = {
  getMyNotifications: ()     => interactionApi.get('/notifications'),
  getUnread:          ()     => interactionApi.get('/notifications/unread'),
  markAsRead:         (id)   => interactionApi.patch(`/notifications/${id}/read`),
  markAllAsRead:      ()     => interactionApi.patch('/notifications/read-all'),
  announceUpdate:     (data) => interactionApi.post('/notifications/announce', data),
  deleteNotification: (id)   => interactionApi.delete(`/notifications/${id}`),
}
