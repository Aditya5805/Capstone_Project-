import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glow1} /><div className={styles.glow2} />
      <div className={styles.hero}>
        <h1 className={styles.headline}>Your apps.<br /><span className={styles.accent}>Discovered.</span></h1>
        <p className={styles.sub}>PlayStore is a full-stack microservices platform built with Spring Boot &amp; React. Browse, download, review apps — or publish your own.</p>
        <div className={styles.actions}>
          {isAuthenticated
            ? <Link to="/apps" className={styles.primaryBtn}>Browse Apps →</Link>
            : <><Link to="/register" className={styles.primaryBtn}>Get started — it's free</Link><Link to="/login" className={styles.secondaryBtn}>Sign in</Link></>
          }
        </div>

      </div>

    </div>
  )
}
