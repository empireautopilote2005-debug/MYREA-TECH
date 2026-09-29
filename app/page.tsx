'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div><strong>MYRÉA</strong><small>TECH</small></div>
        </div>
        <button className="button ghost" onClick={() => router.push('/login')}>Se connecter</button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="pill">PLATEFORME COLLABORATIVE</span>
          <h1>Les humains décident.<br /><em>Les communautés construisent.</em></h1>
          <p>MYRÉA TECH organise les idées, les projets et les contributions pour transformer une vision collective en résultats concrets.</p>
          <div className="hero-actions">
            <button className="button primary large" onClick={() => router.push('/signup')}>Créer mon espace</button>
            <button className="button ghost large" onClick={() => router.push('/login')}>J’ai déjà un compte</button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="mini-label">MYRÉA TECH</div>
          <div className="hero-card">
            <div className="line-title"><span>Projet collectif</span><b>68%</b></div>
            <div className="progress"><i style={{width:'68%'}} /></div>
            <div className="hero-metrics"><span><b>12</b> membres</span><span><b>24</b> idées</span><span><b>8</b> tâches</span></div>
          </div>
        </div>
      </section>

      <section className="principles">
        <div><b>01</b><h3>Organiser</h3><p>Un espace clair pour chaque communauté et chaque projet.</p></div>
        <div><b>02</b><h3>Construire</h3><p>Les idées deviennent des projets, puis des réalisations.</p></div>
        <div><b>03</b><h3>Contribuer</h3><p>Chaque contribution garde une trace de la valeur créée.</p></div>
      </section>
      <footer>MYRÉA TECH · Les humains décident. L’IA assiste.</footer>
    </main>
  )
}
