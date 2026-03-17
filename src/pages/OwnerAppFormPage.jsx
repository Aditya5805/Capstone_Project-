import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { appService } from '../services/appService'
import FormInput from '../components/FormInput'
import s from './Shared.module.css'
import styles from './OwnerAppFormPage.module.css'

const GENRES = ['ACTION','ADVENTURE','PUZZLE','EDUCATION','PRODUCTIVITY','SOCIAL','ENTERTAINMENT','HEALTH','FINANCE','TOOLS']

export default function OwnerAppFormPage({ addToast }) {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState({ name:'', description:'', version:'', genre:'ACTION', categoryId:'', visible: true })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    appService.getAllCategories().then(r => setCategories(r.data)).catch(() => {})
    if (isEdit) {
      appService.getAppById(id).then(r => {
        const a = r.data
        setForm({ name: a.name, description: a.description || '', version: a.version, genre: a.genre, categoryId: a.category?.id || '', visible: a.visible })
      }).catch(() => { addToast('App not found', 'error'); navigate('/owner/apps') })
    }
  }, [id])

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name = 'App name is required'
    if (!form.version.trim()) errs.version = 'Version is required'
    if (!form.genre)          errs.genre = 'Genre is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const payload = { ...form, categoryId: form.categoryId ? Number(form.categoryId) : null }
    try {
      if (isEdit) {
        await appService.updateApp(id, payload)
        addToast('App updated successfully!', 'success')
      } else {
        await appService.createApp(payload)
        addToast('App published successfully!', 'success')
      }
      navigate('/owner/apps')
    } catch (err) {
      addToast(err.response?.data || 'Failed to save app', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className={s.page}>
      <div className={s.container} style={{maxWidth:'640px'}}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>{isEdit ? 'Edit App' : 'Publish New App'}</h1>
          <p className={s.pageSubtitle}>{isEdit ? 'Update your app details' : 'Fill in the details to list your app on PlayStore'}</p>
        </div>

        <div className={s.card}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <FormInput label="App Name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="My Awesome App" error={errors.name} icon="📱" required />
            <FormInput label="Version" type="text" name="version" value={form.version} onChange={handleChange} placeholder="1.0.0" error={errors.version} icon="🏷" required />

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe your app…" className={styles.textarea} rows={4} />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Genre <span className={styles.req}>*</span></label>
                <select name="genre" value={form.genre} onChange={handleChange} className={styles.select}>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.genre && <p className={styles.error}>⚠ {errors.genre}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className={styles.select}>
                  <option value="">No category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} className={styles.checkbox} />
              <div>
                <p className={styles.checkLabel}>Publish immediately</p>
                <p className={styles.checkDesc}>App will be visible to users right away</p>
              </div>
            </label>

            <div className={styles.formActions}>
              <button type="button" className={`${s.btn} ${s.btnSecondary}`} onClick={() => navigate('/owner/apps')}>Cancel</button>
              <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={loading}>
                {loading ? <span className={s.spinner}/> : isEdit ? '✓ Save Changes' : '🚀 Publish App'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
