import type {SceneNode,Story} from './types';
export function resolveNode(node:SceneNode, flags:Record<string,unknown>, route:string|null, topRoute:string):SceneNode{
 if(node.type==='routeVariant'){const key=String(flags[node.flag||'']??'');return node.variants?.[key]??Object.values(node.variants??{})[0]??node}
 if(node.type==='routeScene'){const key=route||topRoute;return node.variants?.[key]??Object.values(node.variants??{})[0]??node}
 return node;
}
export function episodeById(story:Story,id:number){return story.episodes.find(e=>e.id===id)}
export function progressPercent(completed:number,total:number){return total?Math.min(100,Math.round(completed/total*100)):0}
