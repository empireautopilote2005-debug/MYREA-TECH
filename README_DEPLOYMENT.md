# MYREA TECH — Déploiement V1

La V1 est une application Next.js App Router.

## Cloudflare Pages

- Framework preset: **Next.js (Static HTML Export)**
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: `/`
- Production branch: `main`

Le dépôt contient également `MYREA_TECH_SAAS_V1.zip` comme archive de sauvegarde.

## Variables Supabase

Configurer dans Cloudflare Pages > Settings > Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important

Ne pas utiliser `wrangler deploy` pour cette V1 statique. Le déploiement attendu est le build Next.js vers `out`.
