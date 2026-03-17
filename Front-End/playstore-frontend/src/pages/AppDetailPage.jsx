import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appService } from '../services/appService'
import { reviewService, downloadService } from '../services/interactionService'
import s from './Shared.module.css'
import styles from './AppDetailPage.module.css'

export default function AppDetailPage({ addToast }) {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [app, setApp]               = useState(null)
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [downloaded, setDownloaded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [myReview, setMyReview]     = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [existingReview, setExistingReview] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [appRes, revRes] = await Promise.all([
          appService.getAppById(id),
          reviewService.getReviewsByApp(id),
        ])
        setApp(appRes.data)
        setReviews(revRes.data)
        if (isAuthenticated && user?.role === 'USER') {
          try {
            const chk = await downloadService.hasDownloaded(id)
            setDownloaded(chk.data)
            const myRev = revRes.data.find(r => r.userEmail === user.email)
            if (myRev) { setExistingReview(myRev); setMyReview({ rating: myRev.rating, comment: myRev.comment || '' }) }
          } catch {}
        }
      } catch { addToast('App not found', 'error'); navigate('/apps') }
      finally { setLoading(false) }
    }
    load()
  }, [id])
  console.log(reviews)
  const handleDownload = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setDownloading(true)
    try {
      await downloadService.downloadApp({ appId: Number(id) })
      setDownloaded(true)
      addToast(`${app.name} downloaded successfully!`, 'success')
    } catch (err) {
      addToast(err.response?.data || 'Download failed', 'error')
    } finally { setDownloading(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    setSubmitting(true)
    try {
      const res = await reviewService.submitReview({ appId: Number(id), ...myReview })
      setExistingReview(res.data)
      const revRes = await reviewService.getReviewsByApp(id)
      setReviews(revRes.data)
      addToast(existingReview ? 'Review updated!' : 'Review submitted!', 'success')
    } catch (err) {
      addToast(err.response?.data || 'Failed to submit review', 'error')
    } finally { setSubmitting(false) }
  }

  const handleDeleteReview = async () => {
    try {
      await reviewService.deleteReview(id)
      setExistingReview(null)
      setMyReview({ rating: 5, comment: '' })
      const revRes = await reviewService.getReviewsByApp(id)
      setReviews(revRes.data)
      addToast('Review deleted', 'info')
    } catch { addToast('Failed to delete review', 'error') }
  }

  const stars = (r) => '★'.repeat(r) + '☆'.repeat(5 - r)
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—'
  console.log(avgRating);
  
  if (loading) return <div className={styles.loadingPage}><div className={s.spinner} /></div>
  if (!app) return null
  console.log(app)

  return (
    <div className={s.page}>
      <div className={`${s.container} ${styles.layout}`}>
        {/* Left — app details */}
        <div className={styles.main}>
          <div className={s.card}>
            <div className={styles.appHeader}>
              <div className={styles.appIcon}>{app.name[0]}</div>
              <div className={styles.appInfo}>
                <h1 className={styles.appName}>{app.name}</h1>
                <p className={styles.appOwner}>by {app.ownerEmail}</p>
                <div className={styles.appTags}>
                  {app.genre && <span className={`${s.tag} ${s.tagGray}`}>{app.genre}</span>}
                  {app.category && <span className={`${s.tag} ${s.tagGreen}`}>{app.category.name}</span>}
                  <span className={`${s.tag} ${s.tagPurple}`}>v{app.version}</span>
                  {!app.visible && <span className={`${s.tag} ${s.tagRed}`}>Hidden</span>}
                </div>
              </div>
              <div className={styles.ratingBig}>
                <span className={styles.ratingNum}>{avgRating}</span>
                <span className={styles.ratingStars}>{reviews.length ? stars(Math.round(Number(avgRating))) : '—'}</span>
                <span className={styles.ratingCount}>{reviews.length} reviews</span>
              </div>
            </div>
            <p className={styles.description}>{app.description || 'No description provided.'}</p>

            {/* Download button */}
            {user?.role === 'USER' && (
              <button
                className={`${s.btn} ${downloaded ? s.btnSecondary : s.btnPrimary} ${styles.downloadBtn}`}
                onClick={handleDownload} disabled={downloading}
              >
                {downloading ? <span className={s.spinner} /> : downloaded ? '✓ Downloaded' : '⬇ Download'}
              </button>
            )}
          </div>

          {/* Reviews list */}
          <div className={styles.reviewsSection}>
            <h2 className={s.sectionTitle}>Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div className={s.emptyState}><div className={s.emptyIcon}>💬</div><p className={s.emptyTitle}>No reviews yet</p><p className={s.emptyDesc}>Be the first to review this app</p></div>
            ) : (
              <div className={styles.reviewList}>
                {reviews.map((r, i) => (
                  <div key={i} className={styles.reviewCard}>
                    <div className={styles.reviewTop}>
                      <span className={styles.reviewUser}>{r.userEmail}</span>
                      <span className={s.stars}>{stars(r.rating)}</span>
                    </div>
                    {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
                    <p className={styles.reviewDate}>{r.createdDate?.split('T')[0]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — submit review */}
        {isAuthenticated && user?.role === 'USER' && (
          <div className={styles.sidebar}>
            <div className={s.card}>
              <h3 className={s.sectionTitle}>{existingReview ? 'Update Your Review' : 'Write a Review'}</h3>
              <form onSubmit={handleReview} className={styles.reviewForm}>
                <div className={styles.ratingPicker}>
                  <p className={styles.ratingPickerLabel}>Your rating</p>
                  <div className={styles.starRow}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button"
                        className={`${styles.starBtn} ${myReview.rating >= n ? styles.starActive : ''}`}
                        onClick={() => setMyReview(r => ({...r, rating: n}))}>★</button>
                    ))}
                  </div>
                </div>
                <textarea
                  className={styles.reviewTextarea}
                  placeholder="Share your thoughts (optional)…"
                  value={myReview.comment}
                  onChange={e => setMyReview(r => ({...r, comment: e.target.value}))}
                  rows={4}
                />
                <button type="submit" className={`${s.btn} ${s.btnPrimary}`} style={{width:'100%'}} disabled={submitting}>
                  {submitting ? <span className={s.spinner}/> : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {existingReview && (
                  <button type="button" className={`${s.btn} ${s.btnDanger}`} style={{width:'100%'}} onClick={handleDeleteReview}>
                    Delete Review
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
