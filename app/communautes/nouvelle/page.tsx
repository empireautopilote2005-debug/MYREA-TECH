"use client";
import Link from "next/link";
import { useState } from "react";
export default function NewCommunity(){
 const [name,setName]=useState(""); const [saved,setSaved]=useState(false);
 function create(e:React.FormEvent){e.preventDefault();if(!name.trim())return;const old=JSON.parse(localStorage.getItem("myrea_communities")||"[]");localStorage.setItem("myrea_communities",JSON.stringify([...old,name.trim()]));setSaved(true);}
 if(saved)return <main className="app-shell"><div className="wrap form-page"><div className="success"><h1>Communauté créée ✓</h1><p>Ton espace « {name} » est prêt.</p><Link href="/communautes" className="btn btn-primary">Ouvrir mes communautés →</Link></div></div></main>;
 return <main className="app-shell"><header className="app-nav"><Link href="/dashboard" className="brand">MYRÉA <span>TECH</span></Link><Link href="/communautes" className="back">← Communautés</Link></header><div className="wrap form-page"><div className="form-card"><span className="eyebrow dark-eyebrow">NOUVEL ESPACE</span><h1>Créer une communauté</h1><p>Donne un nom à ton premier espace de travail.</p><form onSubmit={create}><label>Nom de la communauté<input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. Équipe MYRÉA" required/></label><button className="btn btn-primary" type="submit">Créer la communauté →</button></form></div></div></main>
}
