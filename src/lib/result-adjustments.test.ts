import {describe,expect,it} from 'vitest';
import {applyExerciseCorrection,getExerciseCorrection,hasExerciseCorrection} from './result-adjustments';

describe('Приложение № 11: поправки к результатам',()=>{
 it('возвращает поправки по времени для бега',()=>{
  expect(getExerciseCorrection(24,'north')).toEqual({amount:-10,unit:'seconds'});
  expect(applyExerciseCorrection(24,240,'north')).toBe(230);
  expect(applyExerciseCorrection(24,240,'altitude')).toBe(225);
 });
 it('добавляет повторения для восхождения на платформу',()=>{
  expect(applyExerciseCorrection(29,100,'north')).toBe(120);
  expect(applyExerciseCorrection(29,100,'altitude')).toBe(130);
 });
 it('поддерживает специальные упражнения',()=>{
  expect(applyExerciseCorrection(59,300,'north')).toBe(220);
  expect(applyExerciseCorrection(60,300,'altitude')).toBe(270);
 });
 it('не применяет поправку при обычных условиях и к неуказанным упражнениям',()=>{
  expect(applyExerciseCorrection(24,240,'standard')).toBe(240);
  expect(applyExerciseCorrection(1,50,'north')).toBe(50);
  expect(hasExerciseCorrection(1)).toBe(false);
  expect(hasExerciseCorrection(52)).toBe(true);
 });

 it('сверяет полный набор из 20 упражнений приложения № 11 с нумерацией приложения № 5',()=>{
  const expected=[23,24,25,26,27,29,41,42,43,44,45,46,47,48,49,50,51,52,59,60];
  expect(expected.every(hasExerciseCorrection)).toBe(true);
  expect([1,22,28,30,40,53,58,61,70].some(hasExerciseCorrection)).toBe(false);
  expect(applyExerciseCorrection(23,60,'north')).toBe(58);
  expect(applyExerciseCorrection(25,300,'north')).toBe(250);
  expect(applyExerciseCorrection(26,300,'altitude')).toBe(180);
  expect(applyExerciseCorrection(27,900,'altitude')).toBe(780);
  expect(applyExerciseCorrection(41,300,'altitude')).toBe(297);
  expect(applyExerciseCorrection(42,300,'altitude')).toBe(293);
  expect(applyExerciseCorrection(43,600,'north')).toBe(510);
  expect(applyExerciseCorrection(44,600,'altitude')).toBe(420);
  for(const exercise of [45,46,47,48,49,50,51,52]){
   expect(applyExerciseCorrection(exercise,100,'north')).toBe(97);
   expect(applyExerciseCorrection(exercise,100,'altitude')).toBe(95);
  }
 });
});
