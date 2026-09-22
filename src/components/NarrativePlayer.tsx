import {motion} from 'framer-motion';
import {useEffect,useMemo,useState} from 'react';
import {X,History,Pause,Play} from 'lucide-react';
import {useGame} from '../store/gameStore';
import {episodeById,resolveNode} from '../game/engine';
import {choiceImpact,impactLabel} from '../game/relationships';
import {bg,sprite,cg} from '../assets';
import type {Effects} from '../game/types';

const topRoute=(a:Record<string,number>)=>Object.entries(a).sort((x,y)=>y[1]-x[1])[0]?.[0]||'gael';
const effectFeedback=(effects?:Effects)=>{
 const entries=Object.entries(effects?.affinity||{}).filter(([,v])=>Number(v)!==0);
 if(!entries.length)return null;
 const [id,value]=entries.sort((a,b)=>Math.abs(Number(b[1]))-Math.abs(Number(a[1])))[0];
 const name=id==='gael'?'Gael':id==='leon'?'Leon':id==='ravi'?'Ravi':id;
 return Number(value)>0?`${name} gostou da forma como você lidou com isso.`:`${name} ficou desconfortável com a sua resposta.`;
};

export function NarrativePlayer(){
 const g=useGame();
 const [typed,setTyped]=useState('');
 const [ending,setEnding]=useState<{title:string;cg:string;text:string}|null>(null);
 const [historyOpen,setHistoryOpen]=useState(false);
 const [feedback,setFeedback]=useState<string|null>(null);
 const ep=episodeById(g.story,g.playerEpisode);
 const raw=ep?.nodes[g.playerNode];
 const node=useMemo(()=>raw?resolveNode(raw,g.flags,g.route,topRoute(g.affinity)):undefined,[raw,g.flags,g.route,g.affinity]);
 const fullText=((node?.text||'').replaceAll('{name}',g.name));

 useEffect(()=>{
  if(!g.playerOpen||!node)return;
  if(node.type==='ending'){
   const route=g.route||topRoute(g.affinity);const romance=g.flags.romance!==false;
   const data=!romance?{title:'Minha própria Aurora',cg:'cg_solo',text:'Escolher a própria direção também é um final inteiro.'}:route==='gael'?{title:'Páginas em branco',cg:'cg_gael',text:'Dois cafés, uma agenda finalmente fechada e espaço para escrever algo novo.'}:route==='leon'?{title:'Último acorde',cg:'cg_leon',text:'Leon chama finais de invenção ruim e segura sua mão antes de terminar a frase.'}:{title:'Luz revelada',cg:'cg_ravi',text:'Ravi guarda a câmera. Algumas memórias não precisam de lente.'};
   g.applyEffects({unlockCG:data.cg});setEnding(data);return;
  }
  if(node.unlockCG)g.applyEffects({unlockCG:node.unlockCG});
  if(node.effects)g.applyEffects(node.effects);
  setTyped('');let i=0;
  if(!fullText)return;
  const timer=window.setInterval(()=>{i++;setTyped(fullText.slice(0,i));if(i>=fullText.length)window.clearInterval(timer)},12);
  return()=>window.clearInterval(timer);
 },[g.playerOpen,g.playerNode]);

 const saveLine=()=>{
  if(!node||!ep||!fullText)return;
  g.pushHistory({speaker:node.speaker==='Player'?g.name:node.speaker||'Narrador',text:fullText,episode:ep.id,node:g.playerNode});
 };
 const next=()=>{
  if(!node||!ep||node.choice)return;
  if(typed!==fullText&&fullText){setTyped(fullText);return;}
  saveLine();
  if(node.end){g.completeEpisode(ep.id);return}
  g.nextNode();
 };
 const choose=(text:string,effects?:Effects)=>{
  if(!node||!ep)return;
  saveLine();
  const impact=choiceImpact(effects);
  g.recordDecision({episode:ep.id,node:g.playerNode,text,impact});
  const message=effectFeedback(effects);
  g.applyEffects(effects);
  if(message){setFeedback(message);window.setTimeout(()=>setFeedback(null),2200)}
  g.nextNode();
 };

 useEffect(()=>{
  if(!g.autoMode||!node||node.choice||node.end||typed!==fullText)return;
  const timer=window.setTimeout(next,1450);
  return()=>window.clearTimeout(timer);
 },[g.autoMode,g.playerNode,typed,fullText]);

 if(!g.playerOpen||!ep||!node)return null;
 if(ending)return <div className="player endingView"><img className="playerBg" src={cg(ending.cg)}/><div className="vignette"/><article className="endingCard"><small>FINAL DESBLOQUEADO</small><h1>{ending.title}</h1><p>{ending.text}</p><button onClick={()=>{setEnding(null);g.nextNode()}}>Continuar epílogo</button></article></div>;
 const show=node.show||[];
 return <div className="player">
  <img className="playerBg" src={bg(node.bg||'campus')}/><div className="vignette"/>
  <div className="playerTop"><div><b>{ep.title}</b><small>{node.loc}</small></div><div>
   <button title="Histórico" onClick={()=>setHistoryOpen(true)}><History size={18}/></button>
   <button title={g.autoMode?'Pausar automático':'Modo automático'} className={g.autoMode?'activeControl':''} onClick={()=>g.setAutoMode(!g.autoMode)}>{g.autoMode?<Pause size={18}/>:<Play size={18}/>}</button>
   <button title="Sair" onClick={()=>g.setPlayer(g.playerEpisode,false)}><X size={18}/></button>
  </div></div>
  <div className={`sprites n${show.length}`}>{show.map(([id,expr],i)=><motion.img key={id+i} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} src={sprite(id,expr)} />)}</div>
  {node.choice&&<div className="choices">{node.choice.map((c,i)=>{const impact=choiceImpact(c.effects);return <button key={i} onClick={()=>choose(c.text,c.effects)}><small className={`impact impact-${impact}`}>{impactLabel(impact)}</small><b>{c.text}</b>{c.tag&&<small>{c.tag}</small>}</button>})}</div>}
  <div className="dialogue" onClick={next}><span>{node.speaker==='Player'?g.name:node.speaker||'Narrador'}</span><p>{typed}</p><small>{typed!==fullText?'clique para revelar ▾':'clique para continuar ▾'}</small></div>
  {feedback&&<motion.div className="relationship-feedback" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>{feedback}</motion.div>}
  {historyOpen&&<div className="historyOverlay" onClick={()=>setHistoryOpen(false)}><aside onClick={e=>e.stopPropagation()}><header><div><small>DIÁRIO DA HISTÓRIA</small><h2>Histórico</h2></div><button onClick={()=>setHistoryOpen(false)}>×</button></header><section>{[...g.history].reverse().map((h,i)=><article key={h.at+i}><b>{h.speaker}</b><p>{h.text}</p></article>)}{!g.history.length&&<p className="historyEmpty">As falas aparecem aqui conforme você avança.</p>}</section></aside></div>}
 </div>
}