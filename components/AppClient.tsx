'use client';
import {useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {supabase} from '@/lib/supabase';

type U={id:string;email?:string|null}; type C={id:string;name:string;description?:string|null};
function Btn({children,href,primary=false,onClick,type='button'}:{children:React.ReactNode;href?:string;primary?:boolean;onClick?:()=>void;type?:'button'|'submit'}){const r=useRouter();return <button type={type} className={'btn '+(primary?'btn-primary':'')} onClick={()=>href?r.push(href):onClick?.()}>{children}</button>}
function Guard({u,children}:{u:U|null;children:React.ReactNode}){const r=useRouter();useEffect(()=>{if(!u)r.replace('/login')},[u,r]);return u?<>{children}</>:<main className="loading">Connexion requise…</main>}
function Shell({u,logout,children}:{u:U|null;logout:()=>void;children:React.ReactNode}){const r=useRouter();return <><header className="top"><div className="wrap nav"><button className="brand" onClick={()=>r.push('/')}>MYRÉA <span>TECH</span></button><nav><button onClick={()=>r.push('/dashboard')}>Dashboard</button><button onClick={()=>r.push('/communautes')}>Communautés</button><button onClick={()=>r.push('/idees')}>Idées</button><button onClick={()=>r.push('/projets')}>Projets</button><button onClick={()=>r.push('/contributions')}>Contributions</button><button onClick={()=>r.push('/actifs')}>Actifs</button></nav><div className="navcta">{u?<><Btn href="/profil">Profil</Btn><Btn primary onClick={logout}>Sortir</Btn></>:<Btn primary href="/login">Connexion</Btn>}</div></div></header>{children}<footer>© MYRÉA TECH · Les humains décident. Les communautés construisent. MYRÉA TECH organise. L’IA assiste.</footer></>}
function Auth({kind}:{kind:'login'|'signup'|'forgot'}){const r=useRouter();const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);async function go(e:React.FormEvent){e.preventDefault();setBusy(true);setMsg('');let error=null as any;if(kind==='login'){({error}=await supabase.auth.signInWithPassword({email,password}));if(!error)r.push('/dashboard')}else if(kind==='signup'){({error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name}}}));if(!error)setMsg('Compte créé. Vérifie ton e-mail si la confirmation est activée.')}else{({error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/profil'}));if(!error)setMsg('Si le compte existe, les instructions ont été envoyées.')}if(error)setMsg(error.message);setBusy(false)}return <main className="auth"><div className="authCard"><span className="eyebrow">MYRÉA TECH</span><h1>{kind==='login'?'Connexion':kind==='signup'?'Créer un compte':'Récupérer l’accès'}</h1><form onSubmit={go}>{kind==='signup'&&<label>Nom<input value={name} onChange={e=>setName(e.target.value)} required/></label>}<label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>{kind!=='forgot'&&<label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/></label>}<button className="btn btn-primary" disabled={busy} type="submit">{busy?'…':kind==='login'?'Se connecter':kind==='signup'?'Créer le compte':'Envoyer le lien'}</button></form>{msg&&<div className="notice">{msg}</div>}<div className="links"><button onClick={()=>r.push('/login')}>Connexion</button><button onClick={()=>r.push('/signup')}>Créer un compte</button><button onClick={()=>r.push('/forgot-password')}>Mot de passe oublié</button></div></div></main>}
function Landing({u}:{u:U|null}){return <main><section className="hero"><div className="wrap heroGrid"><div><span className="eyebrow">CONSTRUIRE · ORGANISER · FAIRE ÉVOLUER</span><h1>Des idées collectives vers des <em>actifs.</em></h1><p>MYRÉA TECH structure les communautés, les idées, les projets, les contributions et les actifs dans un même espace.</p><div className="actions"><Btn primary href={u?'/dashboard':'/signup'}>{u?'Ouvrir mon espace':'Commencer'} →</Btn><Btn href="/contrat">Voir le cadre</Btn></div></div><div className="visual"><div className="vcard"><small>PARCOURS</small><strong>Problème → Idée → Projet → Actif</strong><div className="bar"><i/></div></div><div className="vcard second"><small>PHILOSOPHIE</small><strong>Les humains décident.</strong><span>Les communautés construisent.</span></div></div></div></section><section className="section"><div className="wrap"><h2>Une vraie application collaborative.</h2><p className="lead">Chaque module sert une étape du travail collectif.</p><div className="grid">{[['👥','Communautés','Espaces privés et rôles'],['💡','Idées','Banque et transformation'],['🛠️','Projets','Étapes et Kanban'],['✦','Contributions','Participation et points'],['📦','Actifs','Revenus et évolution'],['◉','Mémoire','Décisions et historique']].map(x=><div className="card" key={x[1]}><b className="icon">{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></section><section className="section dark"><div className="wrap"><h2>Les humains décident.</h2><p className="lead">MYRÉA TECH organise les informations et les workflows ; l’IA peut assister, mais elle ne choisit pas l’idée, le projet ou la répartition économique à la place de la communauté.</p></div></section></main>}
function Dashboard({u}:{u:U}){const [s,setS]=useState<Record<string,number>>({});useEffect(()=>{(async()=>{const ts=['communities','ideas','projects','tasks','contributions','assets'];const a=await Promise.all(ts.map(t=>supabase.from(t).select('*',{count:'exact',head:true})));setS(Object.fromEntries(ts.map((t,i)=>[t,a[i].count||0])));})()},[]);return <Guard u={u}><main className="main"><div className="wrap"><div className="head"><div><span className="eyebrow light">ESPACE DE TRAVAIL</span><h1>Tableau de bord</h1><p>{u.email}</p></div><Btn primary href="/communautes/nouvelle">+ Communauté</Btn></div><div className="stats">{[['communities','Communautés','/communautes'],['ideas','Idées','/idees'],['projects','Projets','/projets'],['tasks','Tâches','/projets'],['contributions','Contributions','/contributions'],['assets','Actifs','/actifs']].map(x=><button className="stat" key={x[0]} onClick={()=>location.href=x[2]}><span>{x[1]}</span><strong>{s[x[0]]??'…'}</strong></button>)}</div><div className="panel"><h2>Prochaine étape</h2><p className="lead">Crée une communauté, accepte le contrat, puis commence à structurer les idées et les projets.</p><Btn primary href="/communautes/nouvelle">Créer ma communauté →</Btn></div></div></main></Guard>}
function Communities({u}:{u:U}){const [cs,setCs]=useState<C[]>([]),[loading,setLoading]=useState(true),[codes,setCodes]=useState<Record<string,string>>({});const r=useRouter();async function load(){const {data}=await supabase.from('communities').select('id,name,description').order('created_at',{ascending:false});setCs(data||[]);setLoading(false)}useEffect(()=>{load()},[]);async function invite(c:C){const code='MREA-'+Math.random().toString(36).slice(2,8).toUpperCase();const {error}=await supabase.from('community_invites').insert({community_id:c.id,code,created_by:u.id});if(!error)setCodes(v=>({...v,[c.id]:code}))}return <Guard u={u}><main className="main"><div className="wrap"><div className="head"><div><h1>Communautés</h1><p>Seules les communautés dont ton compte est membre sont visibles.</p></div><div className="actions"><Btn href="/rejoindre">Rejoindre</Btn><Btn primary href="/communautes/nouvelle">+ Créer</Btn></div></div>{loading?<div className="panel">Chargement…</div>:cs.length===0?<div className="empty">Aucune communauté accessible.</div>:<div className="list">{cs.map(c=><div className="item" key={c.id}><button className="itemMain" onClick={()=>r.push('/dashboard?community='+c.id)}><b>{c.name}</b><span>{c.description||'Communauté de construction collective.'}</span></button><div>{codes[c.id]&&<span className="tag">{codes[c.id]}</span>}<button className="mini" onClick={()=>invite(c)}>Inviter</button></div></div>)}</div>}</div></main></Guard>}
function NewCommunity({u}:{u:U}){const [name,setName]=useState(''),[desc,setDesc]=useState(''),[ok,setOk]=useState(false),[msg,setMsg]=useState('');const r=useRouter();async function go(e:React.FormEvent){e.preventDefault();if(!ok)return setMsg('Accepte le contrat pour continuer.');const {data,error}=await supabase.from('communities').insert({name:name.trim(),description:desc.trim(),owner_id:u.id}).select('id').single();if(error)setMsg(error.message);else{await supabase.from('myrea_contracts').insert({community_id:data.id,user_id:u.id,version:'1.0',acceptance_type:'digital'});r.push('/communautes')}}return <Guard u={u}><main className="main"><div className="wrap narrow"><div className="panel form"><span className="eyebrow light">NOUVEL ESPACE</span><h1>Créer une communauté</h1><form onSubmit={go}><label>Nom<input value={name} onChange={e=>setName(e.target.value)} minLength={2} required/></label><label>Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4}/></label><div className="contract"><b>Contrat MYRÉA TECH — version 1.0</b><p>Plateforme, méthodologie et outils mis à disposition selon le contrat. Contribution prévue : 5 % liée aux actifs, selon l’assiette et les conditions juridiquement définies.</p><label className="check"><input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)}/> J’accepte la version 1.0.</label></div>{msg&&<div className="notice">{msg}</div>}<button className="btn btn-primary">Créer →</button></form></div></div></main></Guard>}
function Join({u}:{u:U}){const [code,setCode]=useState(''),[msg,setMsg]=useState('');const r=useRouter();async function go(e:React.FormEvent){e.preventDefault();const {data,error}=await supabase.rpc('join_with_invite',{p_code:code.trim().toUpperCase()});if(error)setMsg('Code invalide, expiré ou déjà utilisé.');else r.push('/dashboard?community='+data)}return <Guard u={u}><main className="main"><div className="wrap narrow"><div className="panel form"><h1>Rejoindre une communauté</h1><p className="lead">Un code valide ajoute ton compte comme membre.</p><form onSubmit={go}><input value={code} onChange={e=>setCode(e.target.value)} placeholder="MREA-XXXXXX" required/><button className="btn btn-primary">Rejoindre →</button></form>{msg&&<div className="notice">{msg}</div>}</div></div></main></Guard>}
function Projects({u}:{u:U}){
  const [projects,setProjects]=useState<any[]>([]);
  const [communities,setCommunities]=useState<C[]>([]);
  const [community,setCommunity]=useState('');
  const [selected,setSelected]=useState<any|null>(null);
  const [tasks,setTasks]=useState<any[]>([]);
  const [members,setMembers]=useState<any[]>([]);
  const [profiles,setProfiles]=useState<Record<string,string>>({});
  const [form,setForm]=useState<Record<string,string>>({});
  const [task,setTask]=useState({title:'',description:'',priority:'medium',assignee_id:''});
  const [msg,setMsg]=useState('');

  async function loadProjects(){
    const [{data:p},{data:c}]=await Promise.all([
      supabase.from('projects').select('*').order('created_at',{ascending:false}),
      supabase.from('communities').select('id,name').order('created_at',{ascending:false})
    ]);
    setProjects(p||[]);
    setCommunities(c||[]);
    if(!community && c?.[0]) setCommunity(c[0].id);
    if(selected){
      const fresh=(p||[]).find((x:any)=>x.id===selected.id);
      if(fresh) setSelected(fresh);
    }
  }

  async function loadProject(id:string){
    const {data:p}=await supabase.from('projects').select('*').eq('id',id).single();
    if(!p) return;
    setSelected(p);
    setCommunity(p.community_id);
    const [{data:t},{data:pm},{data:cm}]=await Promise.all([
      supabase.from('tasks').select('*').eq('project_id',id).order('created_at',{ascending:true}),
      supabase.from('project_members').select('id,user_id,role,joined_at').eq('project_id',id).order('joined_at'),
      supabase.from('community_members').select('id,user_id,role,joined_at').eq('community_id',p.community_id).order('joined_at')
    ]);
    setTasks(t||[]);
    setMembers(pm||[]);
    const ids=[...new Set([...(pm||[]).map((x:any)=>x.user_id),...(cm||[]).map((x:any)=>x.user_id)])];
    if(ids.length){
      const {data:ps}=await supabase.from('profiles').select('id,display_name').in('id',ids);
      setProfiles(Object.fromEntries((ps||[]).map((x:any)=>[x.id,x.display_name||'Membre'])));
    } else setProfiles({});
  }

  useEffect(()=>{loadProjects()},[]);
  useEffect(()=>{if(selected) loadProject(selected.id)},[selected?.id]);

  async function createProject(e:React.FormEvent){
    e.preventDefault(); setMsg('');
    if(!community) return setMsg('Choisis une communauté.');
    const {data,error}=await supabase.from('projects').insert({
      community_id:community,
      name:form.name?.trim(),
      description:form.description?.trim()||null,
      objective:form.objective?.trim()||null,
      owner_id:u.id
    }).select('*').single();
    if(error) return setMsg(error.message);
    setForm({});
    await loadProjects();
    setSelected(data);
    await loadProject(data.id);
  }

  async function addTask(e:React.FormEvent){
    e.preventDefault(); setMsg('');
    if(!selected) return;
    const {error}=await supabase.from('tasks').insert({
      project_id:selected.id,
      title:task.title.trim(),
      description:task.description.trim()||null,
      priority:task.priority,
      assignee_id:task.assignee_id||null,
      created_by:u.id,
      status:'todo'
    });
    if(error) return setMsg(error.message);
    setTask({title:'',description:'',priority:'medium',assignee_id:''});
    await loadProjects();
    await loadProject(selected.id);
  }

  async function moveTask(id:string,status:'todo'|'doing'|'done'){
    const {error}=await supabase.from('tasks').update({status}).eq('id',id);
    if(error) setMsg(error.message);
    else { await loadProjects(); await loadProject(selected.id); }
  }

  async function changePriority(id:string,priority:string){
    const {error}=await supabase.from('tasks').update({priority}).eq('id',id);
    if(error) setMsg(error.message); else await loadProject(selected.id);
  }

  async function assignTask(id:string,assignee_id:string){
    const {error}=await supabase.from('tasks').update({assignee_id:assignee_id||null}).eq('id',id);
    if(error) setMsg(error.message); else await loadProject(selected.id);
  }

  async function addMember(userId:string){
    if(!selected || !userId) return;
    const {error}=await supabase.from('project_members').insert({project_id:selected.id,user_id:userId,role:'member'});
    if(error) setMsg(error.message); else { await loadProject(selected.id); }
  }

  async function removeMember(userId:string){
    if(!selected) return;
    const {error}=await supabase.from('project_members').delete().eq('project_id',selected.id).eq('user_id',userId);
    if(error) setMsg(error.message); else await loadProject(selected.id);
  }

  const communityMembers=members.length?members:[];
  const availableMembers=Object.entries(profiles).filter(([id])=>!members.some((m:any)=>m.user_id===id));
  const columns=[
    {key:'todo',title:'À faire'},
    {key:'doing',title:'En cours'},
    {key:'done',title:'Terminé'}
  ];
  const visible=(status:string)=>status==='todo'?'todo':status==='doing'||status==='verify'?'doing':'done';

  return <Guard u={u}><main className="main"><div className="wrap">
    <div className="head">
      <div><span className="eyebrow light">PRODUCTION</span><h1>Projets</h1><p>Transforme un projet en travail concret : membres, tâches, Kanban et progression.</p></div>
    </div>

    <div className="panel form">
      <h2>Nouveau projet</h2>
      <form onSubmit={createProject}>
        <select value={community} onChange={e=>setCommunity(e.target.value)} required><option value="">Choisir une communauté</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nom du projet" required/>
        <input value={form.objective||''} onChange={e=>setForm({...form,objective:e.target.value})} placeholder="Objectif"/>
        <textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={3}/>
        <button className="btn btn-primary">Créer le projet</button>
      </form>
    </div>

    {msg&&<div className="notice">{msg}</div>}

    <div className="list">{projects.map(p=><button className={'item itemMain '+(selected?.id===p.id?'selected':'')} key={p.id} onClick={()=>loadProject(p.id)}>
      <div><b>{p.name}</b><span>{p.description||p.objective||'Projet collaboratif'}</span></div>
      <div className="projectProgress"><strong>{p.progress||0}%</strong><span className="miniBar"><i style={{width:(p.progress||0)+'%'}}/></span></div>
    </button>)}</div>

    {!selected ? <div className="empty">Sélectionne un projet pour ouvrir son espace de production.</div> :
    <section className="projectWorkspace">
      <div className="panel projectHeader">
        <div><span className="eyebrow light">PROJET</span><h2>{selected.name}</h2><p>{selected.objective||selected.description||'Aucun objectif renseigné.'}</p></div>
        <div className="progressBox"><strong>{selected.progress||0}%</strong><span>progression automatique</span></div>
      </div>

      <div className="panel form">
        <h2>Ajouter une tâche</h2>
        <form onSubmit={addTask}>
          <input value={task.title} onChange={e=>setTask({...task,title:e.target.value})} placeholder="Titre de la tâche" required/>
          <textarea value={task.description} onChange={e=>setTask({...task,description:e.target.value})} placeholder="Description" rows={2}/>
          <div className="formGrid">
            <select value={task.priority} onChange={e=>setTask({...task,priority:e.target.value})}><option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option><option value="urgent">Urgente</option></select>
            <select value={task.assignee_id} onChange={e=>setTask({...task,assignee_id:e.target.value})}><option value="">Sans attribution</option>{members.map((m:any)=><option key={m.user_id} value={m.user_id}>{profiles[m.user_id]||m.user_id.slice(0,8)}</option>)}</select>
          </div>
          <button className="btn btn-primary">Ajouter la tâche</button>
        </form>
      </div>

      <div className="panel">
        <div className="sectionHead"><div><h2>Membres du projet</h2><p className="lead">Les membres viennent de la communauté.</p></div></div>
        <div className="memberList">{members.map((m:any)=><div className="memberRow" key={m.id}><span><b>{profiles[m.user_id]||m.user_id.slice(0,8)}</b><small>{m.role==='owner'?'Propriétaire':'Membre'}</small></span>{m.role!=='owner'&&<button className="mini" onClick={()=>removeMember(m.user_id)}>Retirer</button>}</div>)}</div>
        <div className="addMember"><select defaultValue="" onChange={e=>{if(e.target.value)addMember(e.target.value)}}><option value="">+ Ajouter un membre</option>{availableMembers.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></div>
      </div>

      <div className="kanban">
        {columns.map(col=><div className="kanbanCol" key={col.key}><div className="kanbanHead"><h3>{col.title}</h3><span>{tasks.filter(t=>visible(t.status)===col.key).length}</span></div>
          {tasks.filter(t=>visible(t.status)===col.key).map(t=><article className="taskCard" key={t.id}>
            <div className="taskTop"><b>{t.title}</b><span className={'priority '+t.priority}>{t.priority}</span></div>
            {t.description&&<p>{t.description}</p>}
            <div className="taskMeta"><span>{t.assignee_id?(profiles[t.assignee_id]||t.assignee_id.slice(0,8)):'Non attribuée'}</span></div>
            <select value={t.assignee_id||''} onChange={e=>assignTask(t.id,e.target.value)}><option value="">Sans attribution</option>{members.map((m:any)=><option key={m.user_id} value={m.user_id}>{profiles[m.user_id]||m.user_id.slice(0,8)}</option>)}</select>
            <div className="taskActions">
              {col.key!=='todo'&&<button className="mini" onClick={()=>moveTask(t.id,'todo')}>À faire</button>}
              {col.key!=='doing'&&<button className="mini" onClick={()=>moveTask(t.id,'doing')}>En cours</button>}
              {col.key!=='done'&&<button className="mini" onClick={()=>moveTask(t.id,'done')}>Terminé</button>}
              <select value={t.priority} onChange={e=>changePriority(t.id,e.target.value)}><option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option><option value="urgent">Urgente</option></select>
            </div>
          </article>)}
        </div>)}
      </div>
    </section>}
  </div></main></Guard>
}
function Profile({u}:{u:U}){const [name,setName]=useState(''),[msg,setMsg]=useState('');useEffect(()=>{supabase.from('profiles').select('display_name').eq('id',u.id).maybeSingle().then(({data})=>setName(data?.display_name||''))},[u.id]);async function save(e:React.FormEvent){e.preventDefault();const {error}=await supabase.from('profiles').upsert({id:u.id,display_name:name});setMsg(error?'Erreur: '+error.message:'Profil enregistré.')}return <Guard u={u}><main className="main"><div className="wrap narrow"><div className="panel form"><h1>Mon profil</h1><p className="lead">{u.email}</p><form onSubmit={save}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom affiché"/><button className="btn btn-primary">Enregistrer</button></form>{msg&&<div className="notice">{msg}</div>}</div></div></main></Guard>}
function Contract({u}:{u:U|null}){return <main className="main"><div className="wrap narrow"><div className="panel"><span className="eyebrow light">CADRE</span><h1>Contrat MYRÉA TECH</h1><p className="lead">MYRÉA TECH met gratuitement à disposition sa plateforme, sa méthodologie, ses outils et ses ressources selon le contrat. Une contribution de 5 % liée aux actifs est prévue selon l’assiette et les conditions juridiquement définies.</p><ul><li>Les humains décident.</li><li>Les points ne sont ni argent ni propriété automatique.</li><li>Chaque communauté reste isolée par les règles d’accès.</li><li>Le texte juridiquement définitif doit être validé avant exploitation commerciale.</li></ul><Btn primary href={u?'/communautes/nouvelle':'/signup'}>{u?'Créer une communauté →':'Créer un compte →'}</Btn></div></div></main>}
export default function AppClient(){const p=usePathname(),r=useRouter();const [u,setU]=useState<U|null>(null),[ready,setReady]=useState(false);useEffect(()=>{supabase.auth.getUser().then(({data})=>{setU(data.user?{id:data.user.id,email:data.user.email}:null);setReady(true)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setU(s?.user?{id:s.user.id,email:s.user.email}:null));return()=>subscription.unsubscribe()},[]);if(!ready)return <main className="loading">Chargement…</main>;async function logout(){await supabase.auth.signOut();r.push('/')}let body:React.ReactNode;if(p==='/')body=<Landing u={u}/>;else if(p==='/login')body=<Auth kind="login"/>;else if(p==='/signup')body=<Auth kind="signup"/>;else if(p==='/forgot-password')body=<Auth kind="forgot"/>;else if(p==='/contrat')body=<Contract u={u}/>;else if(!u)body=<Guard u={null}><></></Guard>;else if(p==='/dashboard')body=<Dashboard u={u}/>;else if(p==='/communautes')body=<Communities u={u}/>;else if(p==='/communautes/nouvelle')body=<NewCommunity u={u}/>;else if(p==='/rejoindre')body=<Join u={u}/>;else if(p==='/idees')body=<Crud u={u} table="ideas" title="Banque d’idées" fields={[['title','Titre'],['description','Description']]}/>;else if(p==='/projets')body=<Projects u={u}/>;else if(p==='/contributions')body=<Crud u={u} table="contributions" title="Contributions" fields={[['title','Contribution'],['points_proposed','Points proposés']]}/>;else if(p==='/actifs')body=<Crud u={u} table="assets" title="Actifs" fields={[['name','Nom'],['description','Description'],['revenue','Revenus']]}/>;else if(p==='/profil')body=<Profile u={u}/>;else body=<Landing u={u}/>;return <Shell u={u} logout={logout}>{body}</Shell>}
