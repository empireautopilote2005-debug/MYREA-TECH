# MYRÉA TECH — Production Cloudflare Pages

## Build
- Framework : Next.js App Router
- Output : static export
- Command : `npm run build`
- Output directory : `out`
- Node : 22+

## Variables Cloudflare Pages
`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Supabase
Appliquer `supabase/migrations/001_initial.sql` au projet MYRÉA TECH. Les tables publiques doivent rester protégées par RLS et les droits Data API doivent être accordés explicitement.

## Vérification
Après configuration des variables, ouvrir :
`/`, `/login`, `/signup`, `/dashboard`, `/communautes`, `/idees`, `/projets`, `/contributions`, `/actifs`.

Les routes privées doivent rediriger vers la connexion et les requêtes de données restent protégées par RLS.
