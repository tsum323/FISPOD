import {describe,it,expect} from 'vitest';
import {evaluateComplex} from './complex-evaluation';
describe('Приложение № 6: комплексная оценка',()=>{
 it('оценивает призывника по 3 упражнениям и проверяет минимум каждого',()=>{
  expect(evaluateComplex({kind:'conscript',sex:'male'},[60,60,50]).grade).toBe(5);
  const r=evaluateComplex({kind:'conscript',sex:'male'},[25,100,100]);
  expect(r.grade).toBe(0); expect(r.reason).toMatch(/минимальный балл/);
 });
 it('оценивает контрактника-мужчину по возрасту и номеру категории',()=>{
  expect(evaluateComplex({kind:'contract',sex:'male',age:24,category:1},[70,70,70]).grade).toBe(5);
  expect(evaluateComplex({kind:'contract',sex:'male',age:24,category:2},[70,70,70]).thresholds).toEqual({five:200,four:180,three:130});
  expect(evaluateComplex({kind:'contract',sex:'male',age:24,category:3},[190,190,190]).minimumPerExercise).toBe(30);
 });
 it('supports 2 exercises for older contract servicemen',()=>{
  expect(evaluateComplex({kind:'contract',sex:'male',age:57,category:2},[20,20]).grade).toBe(5);
  expect(evaluateComplex({kind:'contract',sex:'male',age:62,category:1},[8,8]).grade).toBe(3);
 });
 it('uses 4 exercises for first-year male cadets and 5 for later courses',()=>{
  expect(evaluateComplex({kind:'cadet',sex:'male',course:1},[60,60,60,60]).grade).toBe(5);
  expect(evaluateComplex({kind:'cadet',sex:'male',course:2},[70,70,70,70,70]).grade).toBe(5);
 });
 it('uses female contract and cadet rows',()=>{
  expect(evaluateComplex({kind:'contract',sex:'female',age:32},[20,20,20]).grade).toBe(5);
  expect(evaluateComplex({kind:'contract',sex:'female',age:51},[15,15]).grade).toBe(5);
  expect(evaluateComplex({kind:'cadet',sex:'female',course:3},[30,30,30]).grade).toBe(5);
 });
 it('rejects unsupported exercise counts and missing male category',()=>{
  expect(()=>evaluateComplex({kind:'contract',sex:'male',age:24,category:1},[50,50])).toThrow(/не предусмотрена/);
  expect(()=>evaluateComplex({kind:'contract',sex:'male',age:24},[50,50,50])).toThrow(/номер категории/);
 });
 it('rejects sums below satisfactory threshold and invalid points',()=>{
  expect(evaluateComplex({kind:'conscript',sex:'male'},[26,26,26]).grade).toBe(0);
  expect(()=>evaluateComplex({kind:'conscript',sex:'male'},[20.5,50,50])).toThrow(/целыми/);
 });
});
