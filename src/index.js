const page = (path) => {
  const routes = {
    "/": {
      title: "MYRÉA TECH — Construire ensemble",
      body: home()
    },
    "/dashboard": {
      title: "Tableau de bord — MYRÉA TECH",
      body: dashboard()
    },
    "/communautes": {
      title: "Communautés — MYRÉA TECH",
      body: communities()
    },
    "/communautes/nouvelle": {
      title: "Nouvelle communauté — MYRÉA TECH",
      body: newCommunity()
    },
    "/idees": {
      title: "Idées — MYRÉA TECH",
      body: modulePage("Idées", "💡", "Transformer une idée en proposition structurée, documentée et exploitable.")
    },
    "/projets": {
      title: "Projets — MYRÉA TECH",
      body: modulePage("Projets", "🛠️", "Passer d'une idée validée à un projet organisé avec étapes, responsabilités et résultats.")
    },
    "/actifs": {
      title: "Actifs — MYRÉA TECH",
      body: modulePage("Actifs", "📦", "Centraliser les actifs créés par les communautés et suivre leur évolution.")
    },
    "/affiliation": {
      title: "Affiliation — MYRÉA TECH",
      body: modulePage("Affiliation", "🔗", "Créer et suivre des opportunités d'affiliation autour des actifs.")
    }
  };
  const r = routes[path] || routes["/"];
  return html(r.title, r.body);
};

const css = \`
:root{--navy:#07111f;--navy2:#0d1b2d;--cyan:#57d8ff;--violet:#8d7bff;--ink:#0a1728;--muted:#66758a;--bg:#f5f7fb;--line:#e4e9f0;--white:#fff;--success:#18794e;--danger:#a52828}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink)}a{text-decoration:none;color:inherit}button,input{font:inherit}.wrap{width:min(1160px,calc(100% - 36px));margin:auto}
.top{background:var(--navy);color:#fff}.nav{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-size:18px;font-weight:950;letter-spacing:.08em}.brand span{color:var(--cyan)}.navlinks{display:flex;gap:22px;font-size:14px;color:#c8d5e4}.navlinks a:hover{color:#fff}.navcta{display:flex;gap:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:13px;padding:12px 17px;border:1px solid var(--line);background:#fff;color:var(--ink);font-weight:800;cursor:pointer}.btn-primary{border:0;background:linear-gradient(135deg,var(--cyan),var(--violet));color:#07111f}.btn-dark{background:var(--navy);border-color:var(--navy);color:#fff}.btn-ghost{background:transparent;border-color:rgba(255,255,255,.16);color:#fff}
.hero{background:var(--navy);color:#fff;padding:72px 0 96px}.heroGrid{display:grid;grid-template-columns:1.08fr .92fr;gap:54px;align-items:center}.eyebrow{display:inline-flex;padding:8px 12px;border:1px solid rgba(87,216,255,.25);background:rgba(87,216,255,.08);border-radius:999px;color:#a9ebff;font-size:12px;font-weight:900}.hero h1{font-size:clamp(44px,7vw,78px);line-height:.96;letter-spacing:-.06em;margin:18px 0}.hero h1 em{font-style:normal;color:var(--cyan)}.hero p{font-size:18px;line-height:1.75;color:#aab8ca;max-width:680px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.visual{height:430px;border-radius:30px;border:1px solid rgba(255,255,255,.12);background:radial-gradient(circle at 25% 25%,rgba(87,216,255,.28),transparent 31%),radial-gradient(circle at 78% 72%,rgba(141,123,255,.3),transparent 35%),linear-gradient(145deg,#102744,#081321);position:relative;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.28)}.orbit{position:absolute;inset:15%;border:1px solid rgba(255,255,255,.12);border-radius:50%}.vcard{position:absolute;padding:20px;border-radius:19px;background:rgba(5,14,26,.9);border:1px solid rgba(255,255,255,.12);box-shadow:0 20px 50px rgba(0,0,0,.25)}.v1{left:7%;top:11%;width:62%}.v2{right:7%;bottom:11%;width:64%}.small{font-size:12px;color:#8ea1b7}.metric{font-size:25px;font-weight:950;margin:8px 0 12px}.bar{height:7px;border-radius:9px;background:#20334b;overflow:hidden}.bar i{display:block;width:76%;height:100%;background:linear-gradient(90deg,var(--cyan),var(--violet))}
.section{padding:88px 0}.dark{background:var(--navy);color:#fff}.section h2{font-size:clamp(32px,5vw,54px);letter-spacing:-.045em;margin:0 0 14px}.lead{max-width:760px;color:var(--muted);line-height:1.75}.dark .lead{color:#aab8ca}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:34px}.card{display:block;padding:24px;border:1px solid var(--line);border-radius:22px;background:#fff;transition:transform .18s,border-color .18s}.card:hover{transform:translateY(-2px);border-color:#cbd5e1}.dark .card{background:var(--navy2);border-color:rgba(255,255,255,.1)}.icon{font-size:28px}.card h3{margin:14px 0 8px}.card p{margin:0 0 16px;color:var(--muted);line-height:1.6}.dark .card p{color:#9cafc3}.steps{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:34px}.step{padding:18px;border:1px solid var(--line);background:#fff;border-radius:18px}.step b{display:block}.step span{display:block;color:var(--muted);font-size:13px;line-height:1.5;margin-top:8px}
.app{min-height:100vh}.appMain{padding:48px 0 80px}.back{display:inline-block;color:#64748b;font-weight:800;margin-bottom:18px}.panel{background:#fff;border:1px solid var(--line);border-radius:24px;padding:28px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:25px 0}.stat{padding:21px;border-radius:18px;background:#f3f6fa;border:1px solid var(--line)}.stat span{color:var(--muted);font-size:13px}.stat strong{display:block;font-size:31px;margin-top:6px}.list{display:grid;gap:11px;margin-top:20px}.item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px;border:1px solid var(--line);border-radius:15px}.tag{font-size:12px;font-weight:900;padding:6px 9px;border-radius:999px;background:#e9f8f0;color:var(--success)}
.form{max-width:650px}.field{margin:18px 0}.field label{display:block;font-weight:850;margin-bottom:8px}.field input{width:100%;padding:14px;border:1px solid #d6dee8;border-radius:12px;outline:none}.field input:focus{border-color:#8d7bff;box-shadow:0 0 0 3px rgba(141,123,255,.12)}.notice{padding:13px 15px;border-radius:12px;margin-top:15px;background:#eef7ff;color:#245a7a}.footer{padding:30px 0;background:#050b14;color:#91a1b5}.footerRow{display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap;font-size:13px}
@media(max-width:850px){.navlinks{display:none}.heroGrid{grid-template-columns:1fr}.visual{height:350px}.steps{grid-template-columns:repeat(2,1fr)}.stats{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.wrap{width:min(100% - 24px,1160px)}.hero{padding-top:48px}.hero h1{font-size:44px}.navcta .btn:first-child{display:none}.steps{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}}
\`;

function html(title, body){
  return \`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f"><title>\${title}</title><style>\${css}</style></head><body>\${body}<footer class="footer"><div class="wrap footerRow"><span>© MYRÉA TECH</span><span>Les humains décident. Les communautés construisent.</span></div></footer></body></html>\`;
}
function header(app=false){
  return \`<header class="top"><div class="wrap nav"><a class="brand" href="/">MYRÉA <span>TECH</span></a><nav class="navlinks"><a href="/communautes">Communautés</a><a href="/idees">Idées</a><a href="/projets">Projets</a><a href="/actifs">Actifs</a><a href="/affiliation">Affiliation</a></nav><div class="navcta"><a class="btn btn-ghost" href="/communautes/nouvelle">Créer</a><a class="btn btn-primary" href="/dashboard">Mon espace</a></div></div></header>\`;
}
function home(){
  return header()+\`<main><section class="hero"><div class="wrap heroGrid"><div><span class="eyebrow">CONSTRUIRE • ORGANISER • FAIRE ÉVOLUER</span><h1>Transformer les idées collectives en <em>actifs.</em></h1><p>MYRÉA TECH donne une structure aux communautés qui veulent rechercher, décider, construire, tester et faire évoluer leurs projets dans un même espace.</p><div class="actions"><a class="btn btn-primary" href="/dashboard">Explorer MYRÉA TECH →</a><a class="btn btn-ghost" href="/communautes/nouvelle">Créer une communauté</a></div></div><div class="visual"><div class="orbit"></div><div class="vcard v1"><div class="small">CHAÎNE DE CONSTRUCTION</div><div class="metric">Idée → Projet → Actif</div><div class="bar"><i></i></div></div><div class="vcard v2"><div class="small">ESPACE COLLECTIF</div><div class="metric">Décider · Construire · Apprendre</div><div class="small">Une structure claire pour chaque étape.</div></div></div></div></section><section class="section" id="fonctionnement"><div class="wrap"><h2>Un système, pas seulement une page.</h2><p class="lead">Chaque module correspond à une étape réelle du travail collectif.</p><div class="steps"><div class="step"><b>01 · Problème</b><span>Comprendre.</span></div><div class="step"><b>02 · Idée</b><span>Explorer.</span></div><div class="step"><b>03 · Projet</b><span>Organiser.</span></div><div class="step"><b>04 · Actif</b><span>Lancer.</span></div><div class="step"><b>05 · Autonomie</b><span>Automatiser.</span></div><div class="step"><b>06 · Portfolio</b><span>Évoluer.</span></div></div></div></section><section class="section dark"><div class="wrap"><h2>Les fonctions principales.</h2><p class="lead">Les accès sont de vraies pages serveur : aucun routeur JavaScript fragile n'est nécessaire.</p><div class="grid"><a class="card" href="/communautes"><div class="icon">👥</div><h3>Communautés</h3><p>Créer et structurer les espaces collectifs.</p><b>Ouvrir →</b></a><a class="card" href="/idees"><div class="icon">💡</div><h3>Idées</h3><p>Faire émerger et documenter les propositions.</p><b>Ouvrir →</b></a><a class="card" href="/projets"><div class="icon">🛠️</div><h3>Projets</h3><p>Organiser la construction et les étapes.</p><b>Ouvrir →</b></a><a class="card" href="/actifs"><div class="icon">📦</div><h3>Actifs</h3><p>Suivre les actifs créés et leur évolution.</p><b>Ouvrir →</b></a><a class="card" href="/affiliation"><div class="icon">🔗</div><h3>Affiliation</h3><p>Créer des opportunités autour des actifs.</p><b>Ouvrir →</b></a></div></div></section><section class="section"><div class="wrap"><div class="panel"><div class="two"><h2>Commencer avec une vraie communauté.</h2><p class="lead">La fondation est volontairement simple et robuste. Les fonctions métier pourront ensuite être branchées à la base de données, aux comptes, aux paiements et aux automatisations.</p><a class="btn btn-dark" href="/communautes/nouvelle">Créer ma communauté →</a></div></div></div></section></main>\`;
}
function appShell(title,body){return header(true)+\`<main class="appMain"><div class="wrap"><a class="back" href="/">← Accueil</a><h1>\${title}</h1>\${body}</div></main>\`}
function dashboard(){
  return appShell("Tableau de bord",\`<div class="stats"><div class="stat"><span>Communautés</span><strong>0</strong></div><div class="stat"><span>Idées</span><strong>0</strong></div><div class="stat"><span>Projets</span><strong>0</strong></div><div class="stat"><span>Actifs</span><strong>0</strong></div></div><div class="panel"><h2>Bienvenue dans MYRÉA TECH</h2><p class="lead">Ton espace central pour passer des idées aux projets puis aux actifs.</p><div class="actions"><a class="btn btn-primary" href="/communautes/nouvelle">+ Créer une communauté</a><a class="btn" href="/communautes">Voir les communautés</a></div></div>\`);
}
function communities(){
  return appShell("Communautés",\`<div class="panel"><p class="lead">Les communautés sont les espaces de travail collectifs de MYRÉA TECH.</p><div class="actions"><a class="btn btn-primary" href="/communautes/nouvelle">+ Nouvelle communauté</a></div><div class="list"><div class="item"><div><b>Ma première communauté</b><div class="small">Exemple de structure</div></div><span class="tag">Modèle</span></div></div></div>\`);
}
function newCommunity(){
  return appShell("Créer une communauté",\`<div class="panel form"><p class="lead">Définis le nom de ton premier espace. Cette première version prépare la structure d'utilisation avant le branchement de la persistance serveur.</p><form method="GET" action="/communautes"><div class="field"><label for="name">Nom de la communauté</label><input id="name" name="name" required minlength="2" maxlength="80" placeholder="Ex. MYRÉA Builders"></div><button class="btn btn-primary" type="submit">Créer la communauté →</button></form><div class="notice">La structure de la plateforme est prête à recevoir l'authentification, la base de données et les règles d'accès sans changer les routes publiques.</div></div>\`);
}
function modulePage(title,icon,desc){
  return appShell(title,\`<div class="panel"><div class="icon">\${icon}</div><h2>\${title}</h2><p class="lead">\${desc}</p><div class="grid"><div class="card"><h3>Structure</h3><p>Interface prête pour les données métier.</p></div><div class="card"><h3>Workflow</h3><p>Étapes organisées et navigation stable.</p></div><div class="card"><h3>Évolution</h3><p>Architecture conçue pour recevoir les fonctions avancées.</p></div></div></div>\`);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    return new Response(page(url.pathname), {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-store, no-cache, must-revalidate"
      }
    });
  }
};