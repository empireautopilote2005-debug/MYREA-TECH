# MYREA TECH — Déploiement V1

## Déploiement actuellement utilisé

La version réellement servie par le projet est le **Cloudflare Worker** défini par `wrangler.toml` :

- Worker : `myrea-tech`
- Entrée : `src/index.js`
- Branche : `main`
- Commande Cloudflare : `npx wrangler deploy`

Le fichier `src/index.js` contient maintenant la version fonctionnelle de l'interface et de ses routes. Les fichiers Next.js présents dans `app/` restent une base de travail, mais **ils ne pilotent pas le Worker actuellement déployé**.

## Important

Ne pas modifier uniquement `app/page.tsx` en pensant modifier le site actuellement servi par le Worker. Pour une correction immédiate du site en production Worker, modifier `src/index.js`, puis déployer.

## Routes V1

- `/` accueil
- `/dashboard` tableau de bord
- `/communautes` liste des communautés
- `/communautes/nouvelle` création d'une communauté
- `/idees`
- `/projets`
- `/actifs`

La création de communauté de cette V1 est stockée localement dans le navigateur. La prochaine étape de persistance multi-appareils est Supabase.
