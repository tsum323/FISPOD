import { describe, it, expect } from 'vitest';
import { calculateExerciseScore, getVerifiedExerciseNumbers } from './scoring';

describe('Нормативный калькулятор: подтверждённые таблицы', () => {
  const male = { kind: 'contract' as const, sex: 'male' as const, age: 24 };

  it('exposes only verified exercise tables', () => {
    expect(getVerifiedExerciseNumbers()).toEqual([...Array.from({length:52},(_,i)=>i+1).filter(n=>n!==53),54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]);
  });

  it('uses exact values without interpolation', () => {
    expect(calculateExerciseScore(1, 50, male)?.points).toBe(100);
    expect(calculateExerciseScore(1, 49.5, male)).toBeNull();
  });

  it('applies Appendix 12 thresholds for male contract service under 25', () => {
    expect(calculateExerciseScore(1, 35, male)?.grade).toBe(5);
    expect(calculateExerciseScore(1, 25, male)?.grade).toBe(4);
    expect(calculateExerciseScore(1, 17, male)?.grade).toBe(3);
    expect(calculateExerciseScore(1, 10, male)?.grade).toBe(0);
  });

  it('applies female contract thresholds', () => {
    expect(calculateExerciseScore(1, 10, { kind: 'contract', sex: 'female', age: 52 })?.grade).toBe(5);
  });

  it('applies conscript thresholds only to the supported male category', () => {
    expect(calculateExerciseScore(1, 15, { kind: 'conscript', sex: 'male' })?.grade).toBe(3);
    expect(() => calculateExerciseScore(1, 15, { kind: 'conscript', sex: 'female' })).toThrow(/женщины-призывника/);
  });

  it('requires an explicit cadet course instead of silently assuming course 3', () => {
    expect(() => calculateExerciseScore(1, 15, { kind: 'cadet', sex: 'male' })).toThrow(/Укажи курс/);
    expect(calculateExerciseScore(1, 15, { kind: 'cadet', sex: 'female', course: 1 })?.thresholds).toEqual({ five: 22, four: 15, three: 9 });
  });

  it('rejects missing, fractional and underage contract ages', () => {
    expect(() => calculateExerciseScore(1, 15, { kind: 'contract', sex: 'male' })).toThrow(/полный возраст/);
    expect(() => calculateExerciseScore(1, 15, { kind: 'contract', sex: 'male', age: 24.5 })).toThrow(/полный возраст/);
    expect(() => calculateExerciseScore(1, 15, { kind: 'contract', sex: 'male', age: 17 })).toThrow(/полный возраст/);
  });

  it('does not extrapolate outside a verified exercise table', () => {
    expect(calculateExerciseScore(1, 51, male)).toBeNull();
  });

  it('flags the overlapping 60-year threshold printed in Appendix 12', () => {
    expect(() => calculateExerciseScore(1, 10, { kind: 'contract', sex: 'male', age: 60 })).toThrow(/пересекаются/);
  });

  it('handles exercise 13 exact times in seconds without interpolation', () => {
    expect(calculateExerciseScore(13, 180, male)?.points).toBe(100);
    expect(calculateExerciseScore(13, 275, male)?.points).toBe(81);
    expect(calculateExerciseScore(13, 645, male)?.points).toBe(7);
    expect(calculateExerciseScore(13, 650, male)?.points).toBe(6);
    expect(calculateExerciseScore(13, 655, male)).toBeNull();
  });


  it('calculates weighted strength tables by body-mass category', () => {
    expect(calculateExerciseScore(10, 65, { ...male, weightCategory: '1' })?.points).toBe(100);
    expect(calculateExerciseScore(10, 75, { ...male, weightCategory: '2' })?.points).toBe(100);
    expect(calculateExerciseScore(10, 85, { ...male, weightCategory: '3' })?.points).toBe(100);
    expect(calculateExerciseScore(10, 47, { ...male, weightCategory: '1' })?.points).toBe(64);
    expect(calculateExerciseScore(11, 22, { ...male, weightCategory: '1' })?.points).toBe(100);
    expect(calculateExerciseScore(12, 28, { ...male, weightCategory: '3' })?.points).toBe(100);
    expect(calculateExerciseScore(14, 30, { ...male, weightCategory: '3' })?.points).toBe(100);
    expect(calculateExerciseScore(15, 22, { ...male, weightCategory: '1' })?.points).toBe(100);
    expect(calculateExerciseScore(16, 30, { ...male, weightCategory: '3' })?.points).toBe(100);
  });

  it('does not calculate weighted exercises without an explicit weight category', () => {
    expect(calculateExerciseScore(10, 65, male)).toBeNull();
    expect(calculateExerciseScore(10, 999, { ...male, weightCategory: '1' })).toBeNull();
  });

  it('calculates exact swimming times for exercises 20–22', () => {
    expect(calculateExerciseScore(20, 30.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(20, 57.7, male)?.points).toBe(7);
    expect(calculateExerciseScore(20, 58.2, male)?.points).toBe(2);
    expect(calculateExerciseScore(20, 58.3, male)).toBeNull();
    expect(calculateExerciseScore(21, 70, male)?.points).toBe(100);
    expect(calculateExerciseScore(21, 195, male)?.points).toBe(2);
    expect(calculateExerciseScore(21, 196, male)).toBeNull();
    expect(calculateExerciseScore(22, 90, male)?.points).toBe(100);
    expect(calculateExerciseScore(22, 220, male)?.points).toBe(2);
    expect(calculateExerciseScore(22, 221, male)).toBeNull();
  });

  it('uses the correct age column for exercises 17, 18 and 23', () => {
    expect(calculateExerciseScore(17, 7.8, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(17, 8.0, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(17, 8.9, { ...male, age: 34 })?.points).toBe(65);
    expect(calculateExerciseScore(18, 12.0, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(18, 13.0, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(19, 24, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(19, 25, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(19, 25.1, { ...male, age: 35 })?.points).toBe(99);
    expect(calculateExerciseScore(23, 60, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(24, 195, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(24, 205, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(24, 385, { ...male, age: 34 })?.points).toBe(2);
    expect(calculateExerciseScore(25, 630, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(25, 720, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(25, 1015, { ...male, age: 34 })?.points).toBe(2);
    expect(calculateExerciseScore(26, 1230, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(26, 1410, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(26, 2640, { ...male, age: 34 })?.points).toBe(2);
    expect(calculateExerciseScore(27, 1080, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(27, 1200, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(27, 2115, { ...male, age: 34 })?.points).toBe(2);
    expect(calculateExerciseScore(28, 540, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(28, 570, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(28, 1075, { ...male, age: 35 })?.points).toBe(2);
    expect(calculateExerciseScore(29, 400, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(29, 360, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(29, 217, { ...male, age: 34 })?.points).toBe(2);
    expect(calculateExerciseScore(30, 9.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(30, 18.6, male)?.points).toBe(2);
    expect(calculateExerciseScore(30, 18.7, male)).toBeNull();
    expect(calculateExerciseScore(31, 180, male)?.points).toBe(100);
    expect(calculateExerciseScore(31, 100, male)?.points).toBe(20);
    expect(calculateExerciseScore(31, 99, male)).toBeNull();
    expect(calculateExerciseScore(32, 11.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(32, 23.0, male)?.points).toBe(1);
    expect(calculateExerciseScore(32, 23.5, male)).toBeNull();
    expect(calculateExerciseScore(33, 3, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(100);
    expect(calculateExerciseScore(34, 2, { kind: 'cadet', sex: 'female', course: 2 })?.points).toBe(70);
    expect(calculateExerciseScore(35, 1, { kind: 'cadet', sex: 'male', course: 3 })?.points).toBe(40);
    expect(calculateExerciseScore(33, 3, male)).toBeNull();
    expect(calculateExerciseScore(36, 11.0, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(100);
    expect(calculateExerciseScore(36, 20.8, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(2);
    expect(calculateExerciseScore(36, 20.9, { kind: 'cadet', sex: 'male', course: 1 })).toBeNull();
    expect(calculateExerciseScore(37, 10.5, { kind: 'cadet', sex: 'female', course: 2 })?.points).toBe(100);
    expect(calculateExerciseScore(37, 20.3, { kind: 'cadet', sex: 'female', course: 2 })?.points).toBe(2);
    expect(calculateExerciseScore(37, 20.4, { kind: 'cadet', sex: 'female', course: 2 })).toBeNull();
    expect(calculateExerciseScore(36, 11.0, male)).toBeNull();
    expect(calculateExerciseScore(38, 12.2, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(100);
    expect(calculateExerciseScore(38, 23.0, { kind: 'cadet', sex: 'female', course: 2 })?.points).toBe(2);
    expect(calculateExerciseScore(38, 23.1, { kind: 'cadet', sex: 'male', course: 1 })).toBeNull();
    expect(calculateExerciseScore(38, 12.2, male)).toBeNull();
    expect(calculateExerciseScore(39, 15.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(39, 22.0, male)?.points).toBe(12);
    expect(calculateExerciseScore(39, 22.1, male)).toBeNull();
    expect(calculateExerciseScore(40, 11.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(40, 18.0, male)?.points).toBe(12);
    expect(calculateExerciseScore(41, 75, male)?.points).toBe(100);
    expect(calculateExerciseScore(41, 138, male)?.points).toBe(3);
    expect(calculateExerciseScore(42, 175, male)?.points).toBe(100);
    expect(calculateExerciseScore(42, 240, male)?.points).toBe(8);
    expect(calculateExerciseScore(43, 1380, male)?.points).toBe(100);
    expect(calculateExerciseScore(43, 2040, male)?.points).toBe(10);
    expect(calculateExerciseScore(44, 1610, male)?.points).toBe(100);
    expect(calculateExerciseScore(44, 2520, male)?.points).toBe(8);
    expect(calculateExerciseScore(46, 170, {kind:'cadet',sex:'male',course:1,specialization:'ground-cadet'})?.points).toBe(100);
    expect(calculateExerciseScore(46, 170, {kind:'cadet',sex:'male',course:1,specialization:'airborne'})).toBeNull();
    expect(calculateExerciseScore(47, 170, {kind:'cadet',sex:'male',course:1,specialization:'tank-cadet'})?.points).toBe(100);
    expect(calculateExerciseScore(48, 170, {...male,specialization:'airborne'})?.points).toBe(100);
    expect(calculateExerciseScore(49, 170, {...male,specialization:'navy'})?.points).toBe(100);
    expect(calculateExerciseScore(50, 210, {...male,specialization:'mountain'})?.points).toBe(100);
    expect(calculateExerciseScore(51, 237, male)?.points).toBe(100);
    expect(calculateExerciseScore(52, 184, {kind:'contract',sex:'male',age:24,specialization:'navy'})?.points).toBe(100);
    expect(calculateExerciseScore(54, 3, male)?.points).toBe(100);
    expect(calculateExerciseScore(54, 2, male)?.points).toBe(70);
    expect(calculateExerciseScore(54, 0, male)).toBeNull();
    expect(calculateExerciseScore(55, 1, male)?.points).toBe(40);
    expect(calculateExerciseScore(56, 75, male)?.points).toBe(100);
    expect(calculateExerciseScore(56, 105, male)?.points).toBe(10);
    expect(calculateExerciseScore(57, 140, male)?.points).toBe(100);
    expect(calculateExerciseScore(57, 230, male)?.points).toBe(10);
    expect(calculateExerciseScore(58, 40, male)?.points).toBe(100);
    expect(calculateExerciseScore(58, 12, male)?.points).toBe(8);
    expect(calculateExerciseScore(39, 15.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(39, 22.0, male)?.points).toBe(12);
    expect(calculateExerciseScore(39, 22.1, male)).toBeNull();
    expect(calculateExerciseScore(40, 11.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(40, 18.0, male)?.points).toBe(12);
    expect(calculateExerciseScore(40, 18.1, male)).toBeNull();
    expect(calculateExerciseScore(41, 75, male)?.points).toBe(100);
    expect(calculateExerciseScore(41, 138, male)?.points).toBe(3);
    expect(calculateExerciseScore(41, 139, male)).toBeNull();
    expect(calculateExerciseScore(42, 175, male)?.points).toBe(100);
    expect(calculateExerciseScore(42, 240, male)?.points).toBe(8);
    expect(calculateExerciseScore(42, 241, male)).toBeNull();
    expect(calculateExerciseScore(43, 1380, male)?.points).toBe(100);
    expect(calculateExerciseScore(43, 2040, male)?.points).toBe(10);
    expect(calculateExerciseScore(43, 2041, male)).toBeNull();
    expect(calculateExerciseScore(44, 1610, male)?.points).toBe(100);
    expect(calculateExerciseScore(44, 2520, male)?.points).toBe(8);
    expect(calculateExerciseScore(44, 2521, male)).toBeNull();
    expect(calculateExerciseScore(45, 110, { ...male, age: 34 })?.points).toBe(100);
    expect(calculateExerciseScore(45, 120, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(45, 136, { ...male, age: 34 })?.points).toBe(73);
    expect(calculateExerciseScore(45, 161, { ...male, age: 34 })?.points).toBe(8);
    expect(calculateExerciseScore(45, 162, { ...male, age: 34 })).toBeNull();


    expect(calculateExerciseScore(38, 12.2, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(100);
    expect(calculateExerciseScore(38, 23.0, { kind: 'cadet', sex: 'male', course: 1 })?.points).toBe(2);
    expect(calculateExerciseScore(38, 20.5, { kind: 'cadet', sex: 'male', course: 1 })).toBeNull();
    expect(calculateExerciseScore(38, 12.2, male)).toBeNull();




    expect(calculateExerciseScore(23, 64, { ...male, age: 35 })?.points).toBe(100);
    expect(calculateExerciseScore(23, 59, { ...male, age: 34 })).toBeNull();
    expect(calculateExerciseScore(17, 7.8, { kind: 'contract', sex: 'male' })).toBeNull();
  });

  it('calculates special exercise score tables 59–70 exactly', () => {
    expect(calculateExerciseScore(59, 840, male)?.points).toBe(100);
    expect(calculateExerciseScore(59, 1020, male)?.points).toBe(10);
    expect(calculateExerciseScore(59, 1022, male)).toBeNull();
    expect(calculateExerciseScore(60, 290, male)?.points).toBe(100);
    expect(calculateExerciseScore(60, 382, male)?.points).toBe(8);
    expect(calculateExerciseScore(60, 383, male)).toBeNull();
    expect(calculateExerciseScore(61, 75, male)?.points).toBe(100);
    expect(calculateExerciseScore(61, 95, male)?.points).toBe(8);
    expect(calculateExerciseScore(61, 96, male)).toBeNull();
    expect(calculateExerciseScore(62, 30.0, male)?.points).toBe(100);
    expect(calculateExerciseScore(62, 39.2, male)?.points).toBe(8);
    expect(calculateExerciseScore(62, 39.3, male)).toBeNull();
    expect(calculateExerciseScore(63, 30, male)?.points).toBe(100);
    expect(calculateExerciseScore(63, 4, male)?.points).toBe(8);
    expect(calculateExerciseScore(63, 3, male)).toBeNull();
    expect(calculateExerciseScore(64, 42, male)?.points).toBe(100);
    expect(calculateExerciseScore(64, 90, male)?.points).toBe(9);
    expect(calculateExerciseScore(64, 91, male)).toBeNull();
    expect(calculateExerciseScore(65, 3, { ...male, specialization: 'transport-aviation' })?.points).toBe(100);
    expect(calculateExerciseScore(65, 1, { ...male, specialization: 'army-aviation' })?.points).toBe(40);
    expect(calculateExerciseScore(65, 2, { ...male, specialization: 'tactical-aviation' })?.points).toBe(70);
    expect(calculateExerciseScore(65, 3, male)).toBeNull();
    expect(calculateExerciseScore(66, 32, male)?.points).toBe(100);
    expect(calculateExerciseScore(66, 1, male)?.points).toBe(9);
    expect(calculateExerciseScore(66, 0, male)).toBeNull();
    expect(calculateExerciseScore(67, 340, male)?.points).toBe(100);
    expect(calculateExerciseScore(67, 60, male)?.points).toBe(10);
    expect(calculateExerciseScore(67, 59, male)).toBeNull();
    expect(calculateExerciseScore(68, 46, male)?.points).toBe(100);
    expect(calculateExerciseScore(68, 20, male)?.points).toBe(10);
    expect(calculateExerciseScore(68, 19, male)).toBeNull();
    expect(calculateExerciseScore(69, 3, male)?.points).toBe(100);
    expect(calculateExerciseScore(69, 1, male)?.points).toBe(40);
    expect(calculateExerciseScore(69, 0, male)).toBeNull();
    expect(calculateExerciseScore(70, 130, male)?.points).toBe(100);
    expect(calculateExerciseScore(70, 39, male)?.points).toBe(9);
    expect(calculateExerciseScore(70, 38, male)?.points).toBe(8);
    expect(calculateExerciseScore(70, 37, male)).toBeNull();
  });

  it('handles timed static hold using exact seconds from the table', () => {
    expect(calculateExerciseScore(9, 40, male)?.points).toBe(100);
    expect(calculateExerciseScore(9, 40.5, male)).toBeNull();
  });
});
