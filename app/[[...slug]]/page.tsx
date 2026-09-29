import AppClient from '@/components/AppClient';
const routes=['','login','signup','forgot-password','dashboard','communautes','communautes/nouvelle','rejoindre','idees','projets','contributions','actifs','profil','contrat'];
export function generateStaticParams(){return routes.map(slug=>({slug:slug?slug.split('/'):[]}));}
export default function Page(){return <AppClient/>}
