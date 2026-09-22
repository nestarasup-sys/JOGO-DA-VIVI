import {messages,characters} from '../data/content';import {useMemo,useState} from 'react';import {Header} from './Episodes';import {useGame} from '../store/gameStore';import {relationshipStage} from '../game/relationships';
const idByName:Record<string,'gael'|'leon'|'ravi'|null>={Gael:'gael',Leon:'leon',Ravi:'ravi','Sistema Aurora':null,Maya:null};
const dynamicLine=(name:string,aff:number,route:string|null)=>{
 if(name==='Maya')return route?'Então... oficialmente eu posso começar a te provocar por causa dessa rota?':'Meu diagnóstico continua o mesmo: você está emocionalmente comprometida com esse projeto.';
 if(name==='Sistema Aurora')return 'Seu progresso, decisões e memórias são salvos automaticamente neste dispositivo.';
 const id=idByName[name];if(!id)return '';
 const who=characters[id].name;
 if(route===id)return `${who}: Acho que a gente devia conversar sem fingir que isso ainda é só amizade.`;
 if(aff>=85)return `${who}: Tem coisas que eu só consigo dizer quando é você do outro lado da tela.`;
 if(aff>=70)return `${who}: Você percebe que nossas conversas estão ficando perigosamente pessoais, né?`;
 if(aff>=50)return `${who}: Me avisa quando estiver livre. Sem motivo específico. Talvez.`;
 if(aff>=30)return `${who}: Vi uma coisa hoje e pensei em você. O que é irritantemente específico.`;
 if(aff>=15)return `${who}: Você é bem menos previsível por mensagem do que eu imaginava.`;
 return '';
};
export function Phone(){const g=useGame();const [active,setActive]=useState(Object.keys(messages)[0]);const threads=useMemo(()=>Object.fromEntries(Object.entries(messages).map(([name,arr])=>{const id=idByName[name];const aff=id?g.affinity[id]||0:0;const extra=dynamicLine(name,aff,g.route);return [name,extra?[...arr,extra]:arr]})),[g.affinity,g.route]);const list=threads[active]||[];const id=idByName[active];const stage=id?relationshipStage(g.affinity[id]||0):null;return <><Header title="Celular" text="As conversas refletem o que você construiu na história."/><div className="phone"><aside>{Object.entries(threads).map(([name,arr])=><button className={active===name?'active':''} onClick={()=>setActive(name)} key={name}><i>{name==='Sistema Aurora'?'✦':name[0]}</i><span><b>{name}</b><small>{(arr as string[]).at(-1)}</small></span></button>)}</aside><section><header><i>{active[0]}</i><div><b>{active}</b><small>{stage?stage.label:'online recentemente'}</small></div></header><div className="chat">{list.map((x:string,i:number)=><p key={i}>{x}</p>)}</div><footer><button disabled>Respostas contextuais</button><button disabled>♡ vínculo pela história</button></footer></section></div></>}