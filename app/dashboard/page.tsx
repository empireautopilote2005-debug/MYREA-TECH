"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [communities, setCommunities] = useState<string[]>([]);
  useEffect(() => {
    setCommunities(JSON.parse(localStorage.getItem("myrea_communities") || "[]"));
  }, []);

  return (
    <main className="app-shell">
      <header className="app-nav"><Link href="/" className="brand">MYRÉA <span>TECH</span></Link><Link href="/" className="back">← Accueil</Link></header>
      <div className="wrap dashboard">
        <div className="dashboard-head"><div><span className="eyebrow dark-eyebrow">ESPACE DE TRAVAIL</span><h1>Tableau de bord</h1><p>Ton point de départ pour construire et organiser.</p></div><Link href="/communautes/nouvelle" className="btn btn-primary">+ Nouvelle communauté</Link></div>
        <div className="dashboard-grid">
          <Link href="/communautes" className="dash-card"><span>👥</span><h2>Communautés</h2><strong>{communities.length}</strong><p>Créer et gérer tes espaces.</p></Link>
          <Link href="/idees" className="dash-card"><span>💡</span><h2>Idées</h2><strong>0</strong><p>Prochaines idées à structurer.</p></Link>
          <Link href="/projets" className="dash-card"><span>🛠️</span><h2>Projets</h2><strong>0</strong><p>Suivre les projets actifs.</p></Link>
          <Link href="/actifs" className="dash-card"><span>📦</span><h2>Actifs</h2><strong>0</strong><p>Voir les actifs construits.</p></Link>
        </div>
        <section className="panel"><h2>Prochaine action</h2><p>Commence par créer une communauté. Elle sera conservée dans ce navigateur.</p><Link href="/communautes/nouvelle" className="btn btn-dark">Créer maintenant →</Link></section>
      </div>
    </main>
  );
}
