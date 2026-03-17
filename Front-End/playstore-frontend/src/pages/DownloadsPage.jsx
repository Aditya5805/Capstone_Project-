import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { downloadService } from '../services/interactionService'
import { appService } from '../services/appService'
import s from './Shared.module.css'

export default function DownloadsPage({ addToast }) {
  const [downloads, setDownloads] = useState([])
  const [appNames, setAppNames]   = useState({})   // { [appId]: name }
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await downloadService.getMyDownloads()
        const list = res.data
        setDownloads(list)

        // Fetch names for all unique app IDs in parallel
        const uniqueIds = [...new Set(list.map(d => d.appId))]
        const entries = await Promise.all(
          uniqueIds.map(id =>
            appService.getAppById(id)
              .then(r => [id, r.data.name])
              .catch(() => [id, `App #${id}`])
          )
        )
        setAppNames(Object.fromEntries(entries))
      } catch {
        addToast('Failed to load downloads', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>My Downloads</h1>
          <p className={s.pageSubtitle}>{downloads.length} apps downloaded</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <span className={s.spinner} />
          </div>
        ) : downloads.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>⬇</div>
            <p className={s.emptyTitle}>No downloads yet</p>
            <p className={s.emptyDesc}>Head over to the app store and download something!</p>
            <Link to="/apps" className={`${s.btn} ${s.btnPrimary}`}
              style={{ marginTop: '16px', textDecoration: 'none' }}>
              Browse Apps →
            </Link>
          </div>
        ) : (
          <div className={s.grid2}>
            {downloads.map(d => (
              <Link to={`/apps/${d.appId}`} key={d.id} className={s.cardSm}
                style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--accent-dim)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', flexShrink: 0,
                    color: 'var(--accent-dark)', fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                  }}>
                    {appNames[d.appId]?.[0] ?? '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      color: 'var(--text-primary)', fontSize: '0.9375rem',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {appNames[d.appId] ?? `App #${d.appId}`}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Downloaded {d.downloadedAt?.split('T')[0]}
                    </p>
                  </div>
                  <span className={`${s.tag} ${s.tagGreen}`}>✓ Downloaded</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
