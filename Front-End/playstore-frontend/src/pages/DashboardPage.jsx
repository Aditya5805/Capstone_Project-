import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appService } from '../services/appService'
import { downloadService, reviewService, notificationService } from '../services/interactionService'
import s from './Shared.module.css'
import styles from './DashboardPage.module.css'

export default function DashboardPage({ addToast }) {
  const { user } = useAuth()
  const isOwner = user?.role === 'OWNER'
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (isOwner) {
          const [appsRes, notifRes] = await Promise.all([
            appService.getMyApps(),
            notificationService.getUnread(),
          ])
          const totalDl = await Promise.all(
            appsRes.data.map(a => downloadService.getDownloadCount(a.id).then(r => r.data).catch(() => 0))
          )
          setStats({
            apps: appsRes.data.length,
            downloads: totalDl.reduce((a,b) => a+b, 0),
            unread: notifRes.data.length,
            visible: appsRes.data.filter(a => a.visible).length,
          })
        } else {
          const [dlRes, revRes, notifRes] = await Promise.all([
            downloadService.getMyDownloads(),
            reviewService.getMyReviews(),
            notificationService.getUnread(),
          ])
          setStats({ downloads: dlRes.data.length, reviews: revRes.data.length, unread: notifRes.data.length })
        }
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [isOwner])

  const userQuickLinks = [
    { to:'/apps',          icon:'🔍', label:'Browse Apps',    desc:'Explore available applications' },
    { to:'/downloads',     icon:'⬇', label:'My Downloads',   desc:'Apps you have downloaded'       },
    { to:'/notifications', icon:'🔔', label:'Notifications',  desc:'Updates and alerts'              },
  ]
  const ownerQuickLinks = [
    { to:'/owner/apps',   icon:'📱', label:'My Apps',        desc:'Manage your published apps'     },
    { to:'/owner/create', icon:'➕', label:'Add App',         desc:'Publish a new application'      },
    { to:'/notifications',icon:'🔔', label:'Notifications',  desc:'Download & update alerts'        },
  ]
  const quickLinks = isOwner ? ownerQuickLinks : userQuickLinks

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* Welcome */}
        <div className={styles.welcome}>
          <div className={styles.avatarRing}>
            <div className={styles.avatar}>{user?.email?.[0]?.toUpperCase()}</div>
          </div>
          <div className={styles.welcomeText}>
            <h1 className={styles.greeting}>Welcome back!</h1>
            <div className={styles.userMeta}>
              <span className={styles.email}>{user?.email}</span>
              <span className={`${s.tag} ${isOwner ? s.tagGreen : s.tagPurple}`}>{user?.role}</span>
            </div>
          </div>
          {isOwner && (
            <Link to="/owner/create" className={`${s.btn} ${s.btnPrimary}`} style={{textDecoration:'none',marginLeft:'auto'}}>
              ➕ New App
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {isOwner ? (
            <>
              <StatCard icon="📱" label="My Apps"      value={loading ? '…' : stats.apps ?? 0} />
              <StatCard icon="⬇" label="Total Downloads" value={loading ? '…' : stats.downloads ?? 0} />
              <StatCard icon="👁" label="Visible Apps"  value={loading ? '…' : stats.visible ?? 0} />
              <StatCard icon="🔔" label="Unread Alerts" value={loading ? '…' : stats.unread ?? 0} accent />
            </>
          ) : (
            <>
              <StatCard icon="⬇" label="Downloaded"   value={loading ? '…' : stats.downloads ?? 0} />
              <StatCard icon="⭐" label="Reviews Given" value={loading ? '…' : stats.reviews ?? 0} />
              <StatCard icon="🔔" label="Unread"        value={loading ? '…' : stats.unread ?? 0} accent />
            </>
          )}
        </div>

        {/* Quick links */}
        <h2 className={s.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickGrid}>
          {quickLinks.map(l => (
            <Link key={l.to} to={l.to} className={styles.quickCard} style={{textDecoration:'none'}}>
              <span className={styles.quickIcon}>{l.icon}</span>
              <div>
                <p className={styles.quickLabel}>{l.label}</p>
                <p className={styles.quickDesc}>{l.desc}</p>
              </div>
              <span className={styles.quickArrow}>→</span>
            </Link>
          ))}
        </div>

        {/* Status banner */}
        <div className={styles.statusBanner}>
          <span className={styles.statusDot}/>
          <div>
            <p className={styles.statusTitle}>All Systems Operational</p>
            <p className={styles.statusDesc}>Auth :8080 · App :8081 · Interaction :8082 · Eureka :8761</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statAccent : ''}`}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  )
}
