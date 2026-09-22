import {describe,expect,it} from 'vitest';
import {achievements,decisionConsequences,dominantTrait,protagonistIdentity} from '../src/game/progression';
import {dynamicChoices} from '../src/game/dynamicChoices';

describe('progression and replay systems',()=>{
 it('derives protagonist personality from repeated choices',()=>{
  expect(dominantTrait({empathy:4,courage:1,humor:2})).toBe('empathy');
  expect(protagonistIdentity({empathy:0,courage:0,humor:0}).name).toBe('Em formação');
  expect(dominantTrait({empathy:3,courage:3,humor:1})).toBeNull();
 });
 it('unlocks personality dialogue only at the intended threshold',()=>{
  expect(dynamicChoices(5,2,{empathy:2,courage:0,humor:0},null)).toHaveLength(0);
  expect(dynamicChoices(5,2,{empathy:3,courage:0,humor:0},null)[0].requirement).toBe('Empatia 3');
  expect(dynamicChoices(9,2,{empathy:0,courage:0,humor:3},'leon')[0].effects?.flags?.romance).toBe(true);
 });
 it('summarizes persistent story consequences',()=>{
  const list=decisionConsequences({rain:'ravi',trustGael:false,stayed:true,romance:false},'leon');
  expect(list.map(x=>x.label)).toContain('Na tempestade');
  expect(list.map(x=>x.label)).toContain('A confissão');
  expect(list.map(x=>x.label)).toContain('Rota principal');
 });
 it('computes achievements from existing save state without new grind',()=>{
  const list=achievements({completed:[1,10],unlockedCG:['1','2','3','4','5','6'],affinity:{gael:86,leon:1,ravi:1},traits:{empathy:4,courage:2,humor:1},route:'gael',flags:{romance:true},decisionLog:Array.from({length:12},(_,i)=>({episode:1,node:i,text:'x',impact:'neutral' as const,at:i})),visited:['a','b','c','d'],eventDone:['a','b','c']});
  expect(list.filter(x=>x.unlocked).length).toBeGreaterThanOrEqual(8);
 });
});
