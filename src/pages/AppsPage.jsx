import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { appService } from '../services/appService'
import { reviewService } from '../services/interactionService' // ✅ NEW
import s from './Shared.module.css'
import styles from './AppsPage.module.css'

const GENRES = ['ACTION','ADVENTURE','PUZZLE','EDUCATION','PRODUCTIVITY','SOCIAL','ENTERTAINMENT','HEALTH','FINANCE','TOOLS']

export default function AppsPage({ addToast }) {
  const [apps, setApps] = useState([])
  const [categories, setCategories] = useState([])
  const [ratings, setRatings] = useState({}) // ✅ NEW
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selCat, setSelCat] = useState('')
  const [selGenre, setSelGenre] = useState('')
  const [minRating, setMinRating] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [appsRes, catRes] = await Promise.all([
        appService.getAllApps(),
        appService.getAllCategories(),
      ])

      setApps(appsRes.data)
      setCategories(catRes.data)

      // ✅ FETCH RATINGS SEPARATELY
      const ratingMap = {}

      await Promise.all(
        appsRes.data.map(async (app) => {
          try {
            const res = await reviewService.getAverageRating(app.id)
            ratingMap[app.id] = res.data
          } catch {
            ratingMap[app.id] = 0
          }
        })
      )

      setRatings(ratingMap)

    } catch {
      addToast('Failed to load apps', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) { load(); return }

    setLoading(true)
    try {
      const res = await appService.searchApps(search)
      setApps(res.data)
    } catch {
      addToast('Search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    setLoading(true)
    try {
      let res
      if (selCat) res = await appService.getByCategory(selCat)
      else if (selGenre) res = await appService.getByGenre(selGenre)
      else if (minRating) res = await appService.getByRating(minRating)
      else res = await appService.getAllApps()

      setApps(res.data)
    } catch {
      addToast('Filter failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setSelCat('')
    setSelGenre('')
    setMinRating('')
    load()
  }

  const stars = (r) => {
    const n = Math.round(r || 0)
    return '★'.repeat(Math.max(0, n)) + '☆'.repeat(Math.max(0, 5 - n))
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Browse Apps</h1>
          <p className={s.pageSubtitle}>{apps.length} apps available</p>
        </div>

        {/* Search + Filters */}
        <div className={styles.filterBar}>
          <form onSubmit={handleSearch} className={styles.searchRow}>
            <input
              className={styles.searchInput}
              placeholder="Search apps by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>
              🔍 Search
            </button>
          </form>

          <div className={styles.filterRow}>
            <select
              className={styles.select}
              value={selCat}
              onChange={e => {
                setSelCat(e.target.value)
                setSelGenre('')
                setMinRating('')
              }}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              className={styles.select}
              value={selGenre}
              onChange={e => {
                setSelGenre(e.target.value)
                setSelCat('')
                setMinRating('')
              }}
            >
              <option value="">All Genres</option>
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              className={styles.select}
              value={minRating}
              onChange={e => {
                setMinRating(e.target.value)
                setSelCat('')
                setSelGenre('')
              }}
            >
              <option value="">Any Rating</option>
              {[1,2,3,4].map(r => (
                <option key={r} value={r}>
                  {'★'.repeat(r)}+ ({r}+)
                </option>
              ))}
            </select>

            <button className={`${s.btn} ${s.btnSecondary}`} onClick={handleFilter}>
              Apply
            </button>

            <button className={`${s.btn} ${s.btnSecondary}`} onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>📭</div>
            <p className={s.emptyTitle}>No apps found</p>
            <p className={s.emptyDesc}>Try a different search or clear your filters</p>
          </div>
        ) : (
          <div className={s.grid2}>
            {apps.map(app => {
              const r = ratings[app.id] || 0 // ✅ USE DYNAMIC RATING

              return (
                <Link to={`/apps/${app.id}`} key={app.id} className={styles.appCard}>
                  <div className={styles.appTop}>
                    <div className={styles.appIconBox}>{
                      <Link to="/" className={styles.brand}>
                              <span className={styles.brandIcon}>▶</span>
                            </Link>}
                    </div>
                    <div className={styles.appMeta}>
                      <p className={styles.appName}>{app.name}</p>
                      <p className={styles.appVersion}>v{app.version}</p>
                    </div>
                    <span className={`${s.tag} ${s.tagGray}`}>{app.genre}</span>
                  </div>

                  <p className={styles.appDesc}>
                    {app.description || 'No description provided.'}
                  </p>

                  <div className={styles.appBottom}>
                    <span className={s.stars}>{stars(r)}</span>
                    <span className={s.ratingNum}>
                      {r > 0 ? r.toFixed(1) : '0.0'}
                    </span>

                    {app.category && (
                      <span className={`${s.tag} ${s.tagGreen}`}>
                        {app.category.name}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
