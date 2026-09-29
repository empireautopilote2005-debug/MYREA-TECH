"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Communities(){
 const [items,setItems]=useState<string[]>([]);
 useEffect(()=>setItems(JSON.parse(localStorage.getItem("myrea_communities")||"[]")),[]);
 return <main className="app-shell"><header className="app-nav"><Link href="/dashboard" className="brand">MYRÉA <span>TECH</span></Link><Link href="/dashboard" className="back">← Tableau de bord</Link></header><div className="wrap dashboard"><div className="dashboard-head"><div><h1>Communautés</h1><p>Les espaces que tu as créés.</p></div><Link href="/communautes/nouvelle" className="btn btn-primary">+ Créer</Link></div>{items.length===0?<div className="empty">Aucune communauté pour le moment.<br/><Link href="/communautes/nouvelle">Créer la première →</Link></div>:<div className="list">{items.map((x,i)=><div className="list-item" key={i}>👥 <strong>{x}</strong><span>Communauté active</span></div>)}</div>}</div></main>
}
