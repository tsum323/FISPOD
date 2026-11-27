import {describe,expect,it} from 'vitest';
import {getExerciseRequirements} from './exercise-requirements';

describe('Требования к количеству и составу упражнений по пункту 88',()=>{
 it('определяет комплект для мужчин-контрактников категорий 1, 2 и 3',()=>{
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:24,category:1}).total).toBe(4);
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:24,category:2}).total).toBe(3);
  const cat3=getExerciseRequirements({kind:'contract',sex:'male',age:24,category:3});
  expect(cat3.total).toBe(3);
  expect(cat3.blocks.map(x=>x.title)).toEqual(['Быстрота или ловкость','Сила','Выносливость']);
 });
 it('переключает мужчин после достижения 50 лет на два ОФУ',()=>{
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:49,category:1}).total).toBe(4);
  const p=getExerciseRequirements({kind:'contract',sex:'male',age:50,category:3});
  expect(p.total).toBe(2);
  expect(p.blocks[1].title).toBe('Выносливость');
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:60,category:2}).total).toBe(2);
 });
 it('определяет женские комплекты по возрастным группам',()=>{
  expect(getExerciseRequirements({kind:'contract',sex:'female',age:44}).total).toBe(3);
  expect(getExerciseRequirements({kind:'contract',sex:'female',age:45}).total).toBe(2);
 });
 it('определяет курсантов первого и последующих курсов',()=>{
  const first=getExerciseRequirements({kind:'cadet',sex:'male',course:1});
  expect(first.total).toBe(4);
  expect(first.blocks.reduce((n,x)=>n+x.count,0)).toBe(4);
  const later=getExerciseRequirements({kind:'cadet',sex:'female',course:2});
  expect(later.total).toBe(5);
  expect(later.blocks.reduce((n,x)=>n+x.count,0)).toBe(5);
 });
 it('не угадывает число упражнений для призывника без данных о подразделении',()=>{
  expect(getExerciseRequirements({kind:'conscript',sex:'male'}).supported).toBe(false);
  expect(getExerciseRequirements({kind:'conscript',sex:'male',conscriptCount:3}).total).toBe(3);
  expect(getExerciseRequirements({kind:'conscript',sex:'male',conscriptCount:4}).total).toBe(4);
 });
 it('требует профильные исходные данные',()=>{
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:24}).supported).toBe(false);
  expect(getExerciseRequirements({kind:'contract',sex:'male',age:17,category:1}).supported).toBe(false);
  expect(getExerciseRequirements({kind:'cadet',sex:'male'}).supported).toBe(false);
 });

 it('обрабатывает IIIа, IIIб и инвалидность без назначения СФУ',()=>{
  const early=getExerciseRequirements({kind:'contract',sex:'male',age:30,healthProfile:'IIIa'});
  expect(early.total).toBe(3);
  expect(early.blocks.map(x=>x.title)).toEqual(['Быстрота или ловкость','Сила','Выносливость']);
  expect(early.blocks.every(x=>!x.special)).toBe(true);
  const older=getExerciseRequirements({kind:'contract',sex:'male',age:50,healthProfile:'IIIb'});
  expect(older.total).toBe(2);
  const female=getExerciseRequirements({kind:'contract',sex:'female',age:45,healthProfile:'disability'});
  expect(female.total).toBe(2);
 });
 it('не выдумывает состав упражнений для призывников',()=>{
  const p=getExerciseRequirements({kind:'conscript',sex:'male',conscriptCount:4});
  expect(p.total).toBe(4);
  expect(p.blocks[0].groups).toEqual([]);
 });
});
