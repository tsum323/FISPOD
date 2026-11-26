import {describe,it,expect} from 'vitest';
import {verifiedExerciseDetails} from './exercise-details';

describe('verified exercise technique cards',()=>{
  it('contains one checked card for each exercise 1–44',()=>{
    expect(Object.keys(verifiedExerciseDetails).map(Number).sort((a,b)=>a-b)).toEqual(Array.from({length:44},(_,i)=>i+1));
  });
  it('has complete card structure and valid figure references',()=>{
    for(const d of Object.values(verifiedExerciseDetails)){
      expect(d.start.length).toBeGreaterThan(10);
      expect(d.execution.length).toBeGreaterThan(0);
      expect(d.rules.length).toBeGreaterThan(0);
      expect(d.equipment.length).toBeGreaterThan(0);
      if(d.figure!==undefined)expect(d.figure).toBeGreaterThan(0);
    }
  });
  it('records official strength exercise equipment masses',()=>{
    expect(verifiedExerciseDetails[10].rules.join(' ')).toContain('мужчины — 24 кг');
    expect(verifiedExerciseDetails[11].rules.join(' ')).toContain('женщины — 16 кг');
    expect(verifiedExerciseDetails[14].rules.join(' ')).toContain('мужчины — 70 кг');
    expect(verifiedExerciseDetails[15].rules.join(' ')).toContain('мужчины — 80 кг');
    expect(verifiedExerciseDetails[16].rules.join(' ')).toContain('женщины — 30 кг');
  });
  it('records running, swimming and obstacle exercise details',()=>{
    expect(verifiedExerciseDetails[17].figure).toBe(17);
    expect(verifiedExerciseDetails[18].execution.join(' ')).toContain('100 м');
    expect(verifiedExerciseDetails[20].rules.join(' ')).toContain('любой способ плавания');
    expect(verifiedExerciseDetails[22].rules.join(' ')).toContain('брасс');
    expect(verifiedExerciseDetails[23].execution.join(' ')).toContain('400 м');
    expect(verifiedExerciseDetails[24].execution.join(' ')).toContain('1 км');
    expect(verifiedExerciseDetails[25].execution.join(' ')).toContain('3 км');
    expect(verifiedExerciseDetails[26].execution.join(' ')).toContain('5 км');
    expect(verifiedExerciseDetails[27].rules.join(' ')).toContain('лыжами');
    expect(verifiedExerciseDetails[28].execution.join(' ')).toContain('500 м');
    expect(verifiedExerciseDetails[29].rules.join(' ')).toContain('30 см');
    expect(verifiedExerciseDetails[30].execution.join(' ')).toContain('два кувырка вперед');
    expect(verifiedExerciseDetails[31].rules.join(' ')).toContain('одной минуты');
    expect(verifiedExerciseDetails[32].rules.join(' ')).toContain('110–125 см');
    expect(verifiedExerciseDetails[33].rules.join(' ')).toContain('курсантов');
    expect(verifiedExerciseDetails[34].execution.join(' ')).toContain('подъем разгибом');
    expect(verifiedExerciseDetails[35].rules.join(' ')).toContain('120–130 см');
    expect(verifiedExerciseDetails[36].rules.join(' ')).toContain('15 × 28 м');
    expect(verifiedExerciseDetails[37].rules.join(' ')).toContain('20 × 40 м');
    expect(verifiedExerciseDetails[38].rules.join(' ')).toContain('2,43 м');
    expect(verifiedExerciseDetails[38].execution.join(' ')).toContain('зоны № 4');
  });
  it('records special exercise equipment and execution requirements',()=>{
    expect(verifiedExerciseDetails[39].equipment.join(' ')).toContain('30 кг');
    expect(verifiedExerciseDetails[40].start).toContain('Лежа на животе');
    expect(verifiedExerciseDetails[41].execution.join(' ')).toContain('три отрезка');
    expect(verifiedExerciseDetails[42].execution.join(' ')).toContain('800 м');
    expect(verifiedExerciseDetails[43].rules.join(' ')).toContain('переходить на шаг');
    expect(verifiedExerciseDetails[44].equipment.join(' ')).toContain('Лыжи');
  });
  it('links the shuttle-run card to its exact source page',()=>{
    expect(verifiedExerciseDetails[19].sourceUrl).toContain('429f0ec0902cc8cc40226528c5d52d0e3e4f244d');
  });
});
