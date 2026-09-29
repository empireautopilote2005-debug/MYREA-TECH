# MYRÉA TECH — SaaS V1

MYRÉA TECH est une plateforme collaborative où les humains décident, les communautés construisent, MYRÉA TECH organise et l’IA assiste.

## V1 livrée
- Authentification Supabase : inscription, connexion, récupération d’accès et déconnexion.
- Communautés privées avec rôles propriétaire/admin/membre et invitations par code.
- RLS PostgreSQL : les données communautaires sont filtrées par appartenance côté base.
- Banque d’idées, projets, tâches/Kanban, contributions et actifs.
- Profil membre et contrat versionné avant création d’une communauté.
- Dashboard responsive mobile/desktop.
- Build Next.js statique compatible Cloudflare Pages.

## Architecture
Next.js + TypeScript → Supabase Auth/PostgreSQL/RLS → Cloudflare Pages.

Le déploiement cible est Cloudflare Pages. Aucun secret serveur n’est envoyé au navigateur : le frontend utilise uniquement l’URL Supabase et la clé publishable.

## Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

## Build
`npm install`
`npm run build`

Sortie statique : `out/`.
