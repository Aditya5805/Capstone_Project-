import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appService } from '../services/appService'
import { downloadService, reviewService } from '../services/interactionService' // ✅ ADD reviewService
import s from './Shared.module.css'
import styles from './OwnerAppsPage.module.css'

export default function OwnerAppsPage({ addToast }) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({})
  const [ratings, setRatings] = useState({}) // ✅ NEW

  const load = async () => {
    setLoading(true)
    try {
      const res = await appService.getMyApps()
      setApps(res.data)

      // ✅ Download counts
      const countMap = {}
      await Promise.all(
        res.data.map(async app => {
          try {
            const c = await downloadService.getDownloadCount(app.id)
            countMap[app.id] = c.data
          } catch {
            countMap[app.id] = 0
          }
        })
      )
      setCounts(countMap)

      // ✅ Ratings (NEW)
      const ratingMap = {}
      await Promise.all(
        res.data.map(async app => {
          try {
            const r = await reviewService.getAverageRating(app.id)
            ratingMap[app.id] = r.data
          } catch {
            ratingMap[app.id] = 0
          }
        })
      )
      setRatings(ratingMap)

    } catch {
      addToast('Failed to load your apps', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id) => {
    try {
      const res = await appService.toggleVisibility(id)
      setApps(a => a.map(x => x.id === id ? res.data : x))
      addToast(`App ${res.data.visible ? 'published' : 'hidden'}`, 'success')
    } catch {
      addToast('Failed to toggle visibility', 'error')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await appService.deleteApp(id)
      setApps(a => a.filter(x => x.id !== id))
      addToast(`"${name}" deleted`, 'info')
    } catch {
      addToast('Failed to delete app', 'error')
    }
  }

  const stars = (r) => {
    if (!r || r <= 0) return '☆☆☆☆☆'
    const n = Math.round(r)
    return '★'.repeat(Math.max(0, n)) + '☆'.repeat(Math.max(0, 5 - n))
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={styles.header}>
          <div>
            <h1 className={s.pageTitle}>My Apps</h1>
            <p className={s.pageSubtitle}>{apps.length} published apps</p>
          </div>
          <Link
            to="/owner/create"
            className={`${s.btn} ${s.btnPrimary}`}
            style={{ textDecoration: 'none' }}
          >
            ➕ Add New App
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <span className={s.spinner} />
          </div>
        ) : apps.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>📱</div>
            <p className={s.emptyTitle}>No apps yet</p>
            <p className={s.emptyDesc}>Publish your first app to the PlayStore</p>
            <Link to="/owner/create" style={{ marginTop: '16px', display: 'inline-block' }}>
              <span className={`${s.btn} ${s.btnPrimary}`}>➕ Add New App</span>
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>App</th>
                  <th>Genre</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Downloads</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apps.map(app => {
                  const r = ratings[app.id] || 0 // ✅ USE DYNAMIC RATING

                  return (
                    <tr key={app.id} className={styles.tableRow}>
                      <td>
                        <div className={styles.appCell}>
                          <div className={styles.appIconSm}>
                          <Link to="/" className={styles.brand}>
                           <span className={styles.brandIcon}>▶</span>
                          </Link>
                          </div>
                          <div>
                            <p className={styles.appNameSm}>{app.name}</p>
                            <p className={styles.appVer}>v{app.version}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`${s.tag} ${s.tagGray}`}>{app.genre}</span>
                      </td>

                      <td>
                        <span className={`${s.tag} ${s.tagGreen}`}>
                          {app.category?.name || '—'}
                        </span>
                      </td>

                      {/* ✅ UPDATED RATING COLUMN */}
                      <td>
                        <span className={s.stars} style={{ fontSize: '0.75rem' }}>
                          {stars(r)}
                        </span>
                        <span className={s.ratingNum}>
                          {r > 0 ? r.toFixed(1) : '0.0'}
                        </span>
                      </td>

                      <td>
                        <span className={styles.countBadge}>
                          {counts[app.id] ?? '…'}
                        </span>
                      </td>

                      <td>
                        <span className={`${s.tag} ${app.visible ? s.tagGreen : s.tagRed}`}>
                          {app.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <Link
                            to={`/owner/edit/${app.id}`}
                            className={`${s.btn} ${s.btnOwner}`}
                            style={{ fontSize: '0.75rem', padding: '5px 10px', textDecoration: 'none' }}
                          >
                            ✏ Edit
                          </Link>

                          <button
                            className={`${s.btn} ${s.btnSecondary}`}
                            style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                            onClick={() => handleToggle(app.id)}
                          >
                            {app.visible ? '🙈 Hide' : '👁 Show'}
                          </button>

                          <button
                            className={`${s.btn} ${s.btnDanger}`}
                            style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                            onClick={() => handleDelete(app.id, app.name)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  )
}
