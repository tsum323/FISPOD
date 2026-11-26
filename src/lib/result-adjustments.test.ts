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
});
