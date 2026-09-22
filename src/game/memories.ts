export type MemoryDef={id:string;title:string;description:string;episode:number;route?:string};
export const memories:MemoryDef[]=[
 {id:'cg_intro',title:'Primeiro dia',description:'O instante em que Aurora deixou de ser apenas um nome no mapa.',episode:1},
 {id:'cg_rain',title:'Debaixo do mesmo guarda-chuva',description:'Uma tempestade e um caminho que pareceu curto demais.',episode:2},
 {id:'cg_rooftop',title:'Rumores em neon',description:'Quando sarcasmo e ciúme ficaram próximos demais.',episode:3},
 {id:'cg_festival',title:'Luzes de Aurora',description:'A primeira noite em que você foi procurar alguém.',episode:4},
 {id:'cg_library',title:'Entre páginas e segredos',description:'Uma descoberta que colocou confiança à prova.',episode:5},
 {id:'cg_studio',title:'Depois do ensaio',description:'Quando trabalhar juntos começou a parecer outra coisa.',episode:6},
 {id:'cg_photo',title:'A foto que ficou',description:'O momento em que escolher uma dupla virou escolher proximidade.',episode:7},
 {id:'cg_confession',title:'Sem ensaio',description:'Uma resposta capaz de mudar o nome da relação.',episode:9},
 {id:'cg_gael',title:'Páginas em branco',description:'Final romântico de Gael.',episode:10,route:'gael'},
 {id:'cg_leon',title:'Último acorde',description:'Final romântico de Leon.',episode:10,route:'leon'},
 {id:'cg_ravi',title:'Luz revelada',description:'Final romântico de Ravi.',episode:10,route:'ravi'},
 {id:'cg_solo',title:'Minha própria Aurora',description:'Um final em que escolher a si mesma também é uma escolha completa.',episode:10,route:'independent'}
];
export const memoryById=(id:string)=>memories.find(m=>m.id===id);
