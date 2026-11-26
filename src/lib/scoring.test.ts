import { describe, it, expect } from 'vitest';
import { calculateExerciseScore, getVerifiedExerciseNumbers } from './scoring';

describe('Нормативный калькулятор: подтверждённые таблицы', () => {
  const male = { kind: 'contract' as const, sex: 'male' as const, age: 24 };

  it('exposes only verified exercise tables', () => {
    expect(getVerifiedExerciseNumbers()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 13]);
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
    expect(calculateExerciseScore(13, 650, male)?.points).toBe(6);\n    expect(calculateExerciseScore(13, 655, male)).toBeNull();
  });

  it('handles timed static hold using exact seconds from the table', () => {
    expect(calculateExerciseScore(9, 40, male)?.points).toBe(100);
    expect(calculateExerciseScore(9, 40.5, male)).toBeNull();
  });
});
