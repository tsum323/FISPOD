import {describe,it,expect} from 'vitest';import {calculateExerciseScore,getVerifiedExerciseNumbers} from './scoring';
describe('Нормативный калькулятор: подтверждённые таблицы',()=>{
 const male={kind:'contract' as const,sex:'male' as const,age:24};
 it('exposes only verified exercise tables',()=>expect(getVerifiedExerciseNumbers()).toEqual([1,2,3,4,5,6,7,8,9]));
 it('uses exact values without interpolation',()=>{expect(calculateExerciseScore(1,50,male)?.points).toBe(100);expect(calculateExerciseScore(1,49.5,male)).toBeNull();});
 it('applies Appendix 12 thresholds for male contract service under 25',()=>{expect(calculateExerciseScore(1,35,male)?.grade).toBe(5);expect(calculateExerciseScore(1,25,male)?.grade).toBe(4);expect(calculateExerciseScore(1,17,male)?.grade).toBe(3);expect(calculateExerciseScore(1,10,male)?.grade).toBe(0);});
 it('applies female contract thresholds',()=>expect(calculateExerciseScore(1,10,{kind:'contract',sex:'female',age:52})?.grade).toBe(5));
 it('applies conscript thresholds',()=>expect(calculateExerciseScore(1,30,{kind:'conscript',sex:'male'})?.grade).toBe(3));
 it('does not extrapolate outside a table',()=>expect(calculateExerciseScore(1,51,male)).toBeNull());
 it('handles timed static hold using exact seconds from the table',()=>{expect(calculateExerciseScore(9,40,male)?.points).toBe(100);expect(calculateExerciseScore(9,40.5,male)).toBeNull();});
});