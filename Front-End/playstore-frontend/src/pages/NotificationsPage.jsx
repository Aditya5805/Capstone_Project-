import { useState, useEffect } from 'react'
import { notificationService } from '../services/interactionService'
import s from './Shared.module.css'
import styles from './NotificationsPage.module.css'

export default function NotificationsPage({ addToast }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | unread

  const load = async () => {
    setLoading(true)
    try {
      const res = filter === 'unread'
        ? await notificationService.getUnread()
        : await notificationService.getMyNotifications()
      setNotifications(res.data)
    } catch { addToast('Failed to load notifications', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(n => n.map(x => x.id === id ? {...x, isRead: true} : x))
    } catch { addToast('Failed to mark as read', 'error') }
  }

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(n => n.map(x => ({...x, isRead: true})))
      addToast('All marked as read', 'success')
    } catch { addToast('Failed', 'error') }
  }

  const del = async (id) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications(n => n.filter(x => x.id !== id))
    } catch { addToast('Failed to delete', 'error') }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={styles.header}>
          <div>
            <h1 className={s.pageTitle}>Notifications</h1>
            <p className={s.pageSubtitle}>{unreadCount} unread</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.filterTabs}>
              {['all','unread'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`${styles.filterTab} ${filter === f ? styles.filterActive : ''}`}>
                  {f === 'all' ? 'All' : 'Unread'}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button className={`${s.btn} ${s.btnSecondary}`} onClick={markAll}>Mark all read</button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><span className={s.spinner}/></div>
        ) : notifications.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🔔</div>
            <p className={s.emptyTitle}>No notifications</p>
            <p className={s.emptyDesc}>You're all caught up!</p>
          </div>
        ) : (
          <div className={styles.list}>
            {notifications.map(n => (
              <div key={n.id} className={`${styles.notifCard} ${!n.isRead ? styles.unread : ''}`}>
                <div className={styles.notifIcon}>{n.isRead ? '🔔' : '🔴'}</div>
                <div className={styles.notifBody}>
                  <p className={styles.notifMessage}>{n.message}</p>
                  {n.appId && <p className={styles.notifMeta}>App #{n.appId}</p>}
                  <p className={styles.notifDate}>{n.createdAt?.split('T')[0]}</p>
                </div>
                <div className={styles.notifActions}>
                  {!n.isRead && (
                    <button className={`${s.btn} ${s.btnSecondary}`} style={{fontSize:'0.75rem',padding:'5px 10px'}} onClick={() => markRead(n.id)}>Mark read</button>
                  )}
                  <button className={`${s.btn} ${s.btnDanger}`} style={{fontSize:'0.75rem',padding:'5px 10px'}} onClick={() => del(n.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
