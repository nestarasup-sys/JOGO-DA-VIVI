import type {DecisionLog} from './types';

export type TraitKey='empathy'|'courage'|'humor';
export const traitLabels:Record<TraitKey,{name:string;description:string}>={
 empathy:{name:'Sensível',description:'Você tende a ouvir, acolher e perceber o que fica nas entrelinhas.'},
 courage:{name:'Direta',description:'Você encara tensão de frente e prefere clareza a conforto.'},
 humor:{name:'Irônica',description:'Você usa humor para criar intimidade e atravessar situações desconfortáveis.'}
};

export function dominantTrait(traits:Record<string,number>){
 const entries=(Object.keys(traitLabels) as TraitKey[]).map(k=>[k,traits[k]||0] as const).sort((a,b)=>b[1]-a[1]);
 if(!entries.length||entries[0][1]===0)return null;
 const tied=entries.filter(([,v])=>v===entries[0][1]);
 return tied.length===1?tied[0][0]:null;
}
export function protagonistIdentity(traits:Record<string,number>){
 const key=dominantTrait(traits);
 return key?traitLabels[key]:{name:'Em formação',description:'Suas escolhas ainda não apontam para uma personalidade dominante.'};
}
export type Achievement={id:string;title:string;description:string;unlocked:boolean};
export function achievements(state:{
 completed:number[];unlockedCG:string[];affinity:Record<string,number>;traits:Record<string,number>;
 route:string|null;flags:Record<string,unknown>;decisionLog:DecisionLog[];visited:string[];eventDone:string[];
}):Achievement[]{
 const highest=Math.max(0,...Object.values(state.affinity));
 return [
  {id:'first_step',title:'Primeira impressão',description:'Conclua o primeiro episódio.',unlocked:state.completed.includes(1)},
  {id:'city_walker',title:'Conheço um atalho',description:'Visite quatro lugares de Aurora.',unlocked:state.visited.length>=4},
  {id:'memory_keeper',title:'Colecionadora de momentos',description:'Desbloqueie seis memórias.',unlocked:state.unlockedCG.length>=6},
  {id:'close_enough',title:'Perto demais',description:'Chegue a 50 de afinidade com alguém.',unlocked:highest>=50},
  {id:'deep_bond',title:'Sem fingir neutralidade',description:'Chegue a 85 de afinidade com alguém.',unlocked:highest>=85},
  {id:'own_voice',title:'Do meu jeito',description:'Faça 12 escolhas.',unlocked:state.decisionLog.length>=12},
  {id:'social_life',title:'A vida acontece fora da rota',description:'Conclua três eventos opcionais.',unlocked:state.eventDone.length>=3},
  {id:'chosen_route',title:'Eu escolho você',description:'Abra uma rota principal.',unlocked:Boolean(state.route)},
  {id:'independent',title:'Inteira por conta própria',description:'Recuse transformar a confissão em romance.',unlocked:state.flags.romance===false},
  {id:'season_one',title:'Depois da meia-noite',description:'Conclua a primeira temporada.',unlocked:state.completed.includes(10)}
 ];
}
export function decisionConsequences(flags:Record<string,unknown>,route:string|null){
 const out:{label:string;value:string}[]=[];
 if(flags.rain)out.push({label:'Na tempestade',value:`Você chamou ${String(flags.rain)}.`});
 if(flags.festival)out.push({label:'No festival',value:`Você procurou ${String(flags.festival)} primeiro.`});
 if('trustGael' in flags)out.push({label:'Segredo do Projeto Aurora',value:flags.trustGael?'Você decidiu confiar em Gael.':'Você decidiu manter distância antes de confiar.'});
 if(flags.afterRehearsal)out.push({label:'Depois do ensaio',value:`Você ficou com ${String(flags.afterRehearsal)}.`});
 if('stayed' in flags)out.push({label:'A proposta individual',value:flags.stayed?'Você ficou no projeto em dupla.':'Você decidiu aceitar a oportunidade individual.'});
 if(route)out.push({label:'Rota principal',value:`Você escolheu ${route}.`});
 if('romance' in flags)out.push({label:'A confissão',value:flags.romance?'Você correspondeu ao romance.':'Você escolheu preservar o vínculo sem romance.'});
 return out;
}
