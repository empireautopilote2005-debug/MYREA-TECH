import Link from "next/link";

const features = [
  ["👥","Communautés","Créer et organiser un espace collectif."],
  ["💡","Idées","Transformer une idée en projet structuré."],
  ["🛠️","Projets","Suivre les étapes, tâches et décisions."],
  ["📦","Actifs","Centraliser les actifs et leur évolution."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav wrap">
          <Link href="/" className="brand">MYRÉA <span>TECH</span></Link>
          <div className="navlinks">
            <a href="#fonctionnement">Fonctionnement</a>
            <a href="#communautes">Communautés</a>
            <a href="#actifs">Actifs</a>
          </div>
          <Link href="/dashboard" className="btn btn-light">Ouvrir l’espace →</Link>
        </nav>

        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Construire ensemble • Organiser • Automatiser</span>
            <h1>Des idées d’aujourd’hui pour une <em>liberté</em> plus grande demain.</h1>
            <p>MYRÉA TECH transforme les idées collectives en projets organisés, puis en actifs capables d’évoluer progressivement.</p>
            <div className="actions">
              <Link href="/dashboard" className="btn btn-primary">Explorer MYRÉA TECH →</Link>
              <Link href="/communautes/nouvelle" className="btn btn-outline">Créer une communauté</Link>
            </div>
          </div>
          <div className="visual">
            <div className="visual-card card-a"><small>PROGRESSION</small><strong>Idée → Projet → Actif</strong><div className="bar"><i/></div></div>
            <div className="visual-card card-b"><small>ESPACE COLLECTIF</small><strong>Organiser · Décider · Construire</strong></div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="section">
        <div className="wrap">
          <h2>Un système pour avancer.</h2>
          <p className="lead">Chaque bouton mène maintenant vers une vraie fonction de la plateforme.</p>
          <div className="grid">
            {features.map(([icon,title,text]) => (
              <Link href={title==="Communautés"?"/communautes":title==="Idées"?"/idees":title==="Projets"?"/projets":"/actifs"} className="tile" key={title}>
                <span className="icon">{icon}</span><h3>{title}</h3><p>{text}</p><b>Ouvrir →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="communautes" className="section dark">
        <div className="wrap two-col">
          <div><h2>Une communauté garde le contrôle.</h2><p className="lead dark-lead">Crée ton premier espace, puis commence à organiser ses membres, ses idées et ses projets.</p></div>
          <Link href="/communautes/nouvelle" className="btn btn-primary">Créer ma communauté →</Link>
        </div>
      </section>

      <section id="actifs" className="section">
        <div className="wrap two-col">
          <div><h2>De la collaboration à un actif.</h2><p className="lead">Le tableau de bord centralise les projets et leur progression.</p></div>
          <Link href="/dashboard" className="btn btn-dark">Voir le tableau de bord →</Link>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap cta">
          <h2>Commencer maintenant.</h2>
          <p className="dark-lead">Entre dans ton espace et réalise les premières actions.</p>
          <Link href="/dashboard" className="btn btn-primary">Commencer →</Link>
        </div>
      </section>
    </main>
  );
}
