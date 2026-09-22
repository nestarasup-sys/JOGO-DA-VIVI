import {describe,expect,it} from 'vitest';
import {choiceImpact,relationshipProgress,relationshipStage} from '../src/game/relationships';

describe('relationship model',()=>{
 it('moves through emotional stages at canonical thresholds',()=>{
  expect(relationshipStage(0).label).toBe('Conhecidos');
  expect(relationshipStage(15).label).toBe('Curiosidade');
  expect(relationshipStage(30).label).toBe('Proximidade');
  expect(relationshipStage(50).label).toBe('Confiança');
  expect(relationshipStage(70).label).toBe('Tensão romântica');
  expect(relationshipStage(85).label).toBe('Vínculo profundo');
 });
 it('keeps stage progress bounded',()=>{
  expect(relationshipProgress(-50)).toBeGreaterThanOrEqual(0);
  expect(relationshipProgress(100)).toBe(100);
 });
 it('classifies choices without exposing a correct answer',()=>{
  expect(choiceImpact()).toBe('neutral');
  expect(choiceImpact({affinity:{gael:2}})).toBe('relationship');
  expect(choiceImpact({affinity:{gael:5}})).toBe('major');
  expect(choiceImpact({flags:{confession:true}})).toBe('major');
 });
});
