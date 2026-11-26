import {describe,it,expect} from 'vitest';import {verifiedExerciseDetails} from './exercise-details';
describe('verified exercise technique cards',()=>{it('contains checked descriptions for exercises 1 through 16 and 19',()=>{expect(Object.keys(verifiedExerciseDetails).map(Number)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);});it('has start position, execution, rules, equipment and official figure reference',()=>{for(const d of Object.values(verifiedExerciseDetails)){expect(d.start.length).toBeGreaterThan(10);expect(d.execution.length).toBeGreaterThan(0);expect(d.rules.length).toBeGreaterThan(0);expect(d.equipment.length).toBeGreaterThan(0);if(d.figure!==undefined)expect(d.figure).toBeGreaterThan(0);}});it('records the correct fixed equipment masses and weight categories for strength exercises',()=>{
  expect(verifiedExerciseDetails[10].rules.join(' ')).toContain('мужчины — 24 кг');
  expect(verifiedExerciseDetails[11].rules.join(' ')).toContain('женщины — 16 кг');
  expect(verifiedExerciseDetails[14].rules.join(' ')).toContain('мужчины — 70 кг');
  expect(verifiedExerciseDetails[15].rules.join(' ')).toContain('мужчины — 80 кг');
  expect(verifiedExerciseDetails[16].rules.join(' ')).toContain('женщины — 30 кг');
});it('records verified running and swimming technique for exercises 17–26',()=>{
  expect(verifiedExerciseDetails[17].figure).toBe(17);
  expect(verifiedExerciseDetails[18].execution.join(' ')).toContain('100 м');
  expect(verifiedExerciseDetails[20].rules.join(' ')).toContain('любой способ плавания');
  expect(verifiedExerciseDetails[22].rules.join(' ')).toContain('брасс');
  expect(verifiedExerciseDetails[23].execution.join(' ')).toContain('400 м');
  expect(verifiedExerciseDetails[24].execution.join(' ')).toContain('1 км');
  expect(verifiedExerciseDetails[25].execution.join(' ')).toContain('3 км');
  expect(verifiedExerciseDetails[26].execution.join(' ')).toContain('5 км');\n  expect(verifiedExerciseDetails[27].rules.join(' ')).toContain('лыжах');\n  expect(verifiedExerciseDetails[28].execution.join(' ')).toContain('500 м');
});it('links shuttle-run technique to its exact source page',()=>expect(verifiedExerciseDetails[19].sourceUrl).toContain('429f0ec0902cc8cc40226528c5d52d0e3e4f244d'));});