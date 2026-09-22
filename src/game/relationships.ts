export type RelationshipStage={label:string;min:number;next:number|null;description:string};
const stages:RelationshipStage[]=[
 {label:'Conhecidos',min:0,next:15,description:'Vocês ainda estão se entendendo.'},
 {label:'Curiosidade',min:15,next:30,description:'A conversa começa a sair do automático.'},
 {label:'Proximidade',min:30,next:50,description:'Vocês procuram motivos para passar mais tempo juntos.'},
 {label:'Confiança',min:50,next:70,description:'Assuntos pessoais já não parecem tão arriscados.'},
 {label:'Tensão romântica',min:70,next:85,description:'Alguns silêncios dizem mais que as respostas.'},
 {label:'Vínculo profundo',min:85,next:null,description:'A relação já carrega história, intimidade e escolhas.'}
];
export function relationshipStage(value:number){
 const v=Math.max(0,Math.min(100,value));
 return [...stages].reverse().find(s=>v>=s.min)??stages[0];
}
export function relationshipProgress(value:number){
 const v=Math.max(0,Math.min(100,value));
 const stage=relationshipStage(v);
 if(stage.next===null)return 100;
 return Math.max(0,Math.min(100,Math.round(((v-stage.min)/(stage.next-stage.min))*100)));
}
export function choiceImpact(effects?:{affinity?:Record<string,number>;route?:string;flags?:Record<string,unknown>}){
 const deltas=Object.values(effects?.affinity||{}).map(Number).filter(Number.isFinite);
 const max=Math.max(0,...deltas.map(Math.abs));
 if(effects?.route||effects?.flags&&Object.keys(effects.flags).length||max>=4)return 'major' as const;
 if(max>0)return 'relationship' as const;
 return 'neutral' as const;
}
export function impactLabel(impact:'neutral'|'relationship'|'major'){
 return impact==='major'?'DECISÃO IMPORTANTE':impact==='relationship'?'AFETA RELAÇÕES':'TOM DA CONVERSA';
}
