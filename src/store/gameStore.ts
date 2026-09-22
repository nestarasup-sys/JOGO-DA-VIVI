import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Effects,Story} from '../game/types';
import rawStory from '../data/season1.json';
import {storySchema} from '../game/schema';
export type GameState={name:string;coins:number;episode:number;unlockedEpisode:number;completed:number[];affinity:Record<string,number>;traits:Record<string,number>;route:string|null;flags:Record<string,unknown>;choices:number;unlockedCG:string[];ownedOutfits:string[];equipped:string;visited:string[];eventDone:string[];messages:string[];story:Story;playerOpen:boolean;playerEpisode:number;playerNode:number;setPlayer:(ep:number,open?:boolean)=>void;nextNode:()=>void;applyEffects:(e?:Effects)=>void;completeEpisode:(ep:number)=>void;buyOutfit:(id:string,price:number)=>boolean;visit:(id:string)=>void;finishEvent:(id:string,reward:number,aff?:string|null)=>void;setStory:(story:Story)=>void;resetStory:()=>void;resetGame:()=>void;};
const initial={name:'Lia',coins:260,episode:1,unlockedEpisode:1,completed:[],affinity:{gael:0,leon:0,ravi:0},traits:{empathy:0,courage:0,humor:0},route:null,flags:{},choices:0,unlockedCG:[],ownedOutfits:['starter'],equipped:'starter',visited:[],eventDone:[],messages:['Sistema Aurora'],story:rawStory as Story,playerOpen:false,playerEpisode:1,playerNode:0};
export const useGame=create<GameState>()(persist((set,get)=>({...initial,
 setPlayer:(ep,open=true)=>set({playerEpisode:ep,playerNode:0,playerOpen:open}),
 nextNode:()=>set(s=>({playerNode:s.playerNode+1})),
 applyEffects:(e={})=>set(s=>{const affinity={...s.affinity};Object.entries(e.affinity||{}).forEach(([k,v])=>affinity[k]=(affinity[k]||0)+(v||0));const traits={...s.traits};Object.entries(e.traits||{}).forEach(([k,v])=>traits[k]=(traits[k]||0)+(v||0));return {affinity,traits,flags:{...s.flags,...(e.flags||{})},coins:s.coins+(e.coins||0),route:e.route??s.route,messages:[...new Set([...s.messages,...(e.messages||[])])],unlockedCG:[...new Set([...s.unlockedCG,...(e.unlockCG?[e.unlockCG]:[])])],ownedOutfits:[...new Set([...s.ownedOutfits,...(e.outfit?[e.outfit]:[])])],equipped:e.outfit??s.equipped,choices:s.choices+1}}),
 completeEpisode:(ep)=>set(s=>({completed:[...new Set([...s.completed,ep])],unlockedEpisode:Math.max(s.unlockedEpisode,Math.min(s.story.episodes.length,ep+1)),episode:Math.max(s.episode,Math.min(s.story.episodes.length,ep+1)),playerOpen:false})),
 buyOutfit:(id,price)=>{const s=get();if(s.ownedOutfits.includes(id)){set({equipped:id});return true}if(s.coins<price)return false;set({coins:s.coins-price,ownedOutfits:[...s.ownedOutfits,id],equipped:id});return true},
 visit:(id)=>set(s=>s.visited.includes(id)?{}:{visited:[...s.visited,id],coins:s.coins+15}),
 finishEvent:(id,reward,aff)=>set(s=>{if(s.eventDone.includes(id))return {};const affinity={...s.affinity};if(aff)affinity[aff]=(affinity[aff]||0)+6;return {eventDone:[...s.eventDone,id],coins:s.coins+reward,affinity}}),
 setStory:(story)=>{storySchema.parse(story);set({story})}, resetStory:()=>set({story:rawStory as Story}), resetGame:()=>set({...initial,story:get().story})
}),{name:'aurora-v3-save',partialize:s=>({...s,playerOpen:false})}));
