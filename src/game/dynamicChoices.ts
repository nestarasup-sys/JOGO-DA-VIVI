import type {Choice,Effects} from './types';

type DynamicChoice=Choice&{requirement:string};
const trait=(traits:Record<string,number>,key:string,min:number)=>Number(traits[key]||0)>=min;

export function dynamicChoices(episode:number,node:number,traits:Record<string,number>,route:string|null):DynamicChoice[]{
 const choices:DynamicChoice[]=[];
 if(episode===5&&node===2&&trait(traits,'empathy',3))choices.push({
  text:'“Eu não preciso confiar cegamente. Só preciso acreditar que você está tentando ser honesto agora.”',
  tag:'Resposta de personalidade • Sensível',requirement:'Empatia 3',
  effects:{affinity:{gael:7},flags:{trustGael:true,traitMomentEmpathy:true}} as Effects
 });
 if(episode===8&&node===2&&trait(traits,'courage',3))choices.push({
  text:'“Eu não vou diminuir meu futuro para tornar essa conversa menos desconfortável.”',
  tag:'Resposta de personalidade • Direta',requirement:'Coragem 3',
  effects:{flags:{stayed:false,traitMomentCourage:true},traits:{courage:1}} as Effects
 });
 if(episode===9&&node===2&&trait(traits,'humor',3)&&route)choices.push({
  text:'“Ótimo. Agora eu vou ter que admitir que todas as piadas eram mecanismo de defesa.”',
  tag:'Resposta de personalidade • Irônica',requirement:'Humor 3',
  effects:{flags:{romance:true,traitMomentHumor:true},traits:{humor:1},unlockCG:'cg_confession'} as Effects
 });
 return choices;
}
