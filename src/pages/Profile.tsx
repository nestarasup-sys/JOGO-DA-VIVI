import {sprite} from '../assets';
import {useGame} from '../store/gameStore';
import {Header} from './Episodes';
import {achievements,decisionConsequences,protagonistIdentity,traitLabels} from '../game/progression';
import {impactLabel} from '../game/relationships';

export function Profile(){
 const g=useGame();const identity=protagonistIdentity(g.traits);const earned=achievements(g);const consequences=decisionConsequences(g.flags,g.route);
 return <><Header title="Perfil" text="Sua protagonista é construída pelas decisões que você repete — e pelas que decide quebrar."/>
 <div className="profile">
  <aside><img src={sprite('player','smile')}/><h1>{g.name}</h1><p>Universidade Aurora • Comunicação</p><div className="identityCard"><small>PERSONALIDADE DOMINANTE</small><h2>{identity.name}</h2><p>{identity.description}</p></div></aside>
  <section>
   <div className="stats"><div><b>{g.choices}</b><small>ESCOLHAS</small></div><div><b>{g.unlockedCG.length}</b><small>MEMÓRIAS</small></div><div><b>{g.completed.length}</b><small>CAPÍTULOS</small></div></div>
   <h2>Traços</h2>
   {Object.entries(g.traits).map(([k,v])=><div className="trait" key={k}><span>{traitLabels[k as keyof typeof traitLabels]?.name||k}</span><div className="meter"><i style={{width:Math.min(100,Number(v)*10)+'%'}}/></div><b>{v}</b></div>)}
   <div className="profileSection"><h2>Decisões que ficaram</h2>{consequences.length?consequences.map((x,i)=><article className="consequence" key={i}><small>{x.label}</small><p>{x.value}</p></article>):<p className="muted">As consequências principais aparecem aqui conforme a temporada avança.</p>}</div>
   <div className="profileSection"><h2>Linha do tempo</h2><div className="decisionTimeline">{[...g.decisionLog].reverse().slice(0,12).map((d,i)=><article key={d.at+i}><small>EP {String(d.episode).padStart(2,'0')} • {impactLabel(d.impact)}</small><p>{d.text}</p></article>)}{!g.decisionLog.length&&<p className="muted">Suas escolhas importantes serão registradas aqui.</p>}</div></div>
   <div className="profileSection"><h2>Conquistas</h2><div className="achievementGrid">{earned.map(a=><article className={a.unlocked?'achievement unlocked':'achievement'} key={a.id}><b>{a.unlocked?'✦':'○'} {a.title}</b><p>{a.description}</p></article>)}</div></div>
  </section>
 </div></>
}