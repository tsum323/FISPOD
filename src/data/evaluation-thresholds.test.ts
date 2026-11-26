import { describe, it, expect } from 'vitest';
import { getGradeThresholds } from './evaluation-thresholds';

describe('Приложение № 12: пороги индивидуальной оценки', () => {
  it.each([
    [18, { five: 70, four: 50, three: 34 }],
    [25, { five: 68, four: 48, three: 32 }],
    [30, { five: 60, four: 40, three: 30 }],
    [35, { five: 55, four: 36, three: 26 }],
    [40, { five: 50, four: 30, three: 24 }],
    [45, { five: 40, four: 25, three: 18 }],
    [50, { five: 30, four: 20, three: 14 }],
    [55, { five: 20, four: 16, three: 12 }],
    [59, { five: 20, four: 16, three: 12 }],
    [61, { five: 15, four: 12, three: 10 }],
  ])('выбирает мужскую возрастную строку для возраста %i', (age, expected) => {
    expect(getGradeThresholds({ kind: 'contract', sex: 'male', age })).toEqual(expected);
  });

  it('блокирует ровно 60 лет из-за пересечения интервалов в опубликованной таблице', () => {
    expect(() => getGradeThresholds({ kind: 'contract', sex: 'male', age: 60 })).toThrow(/пересекаются/);
  });

  it.each([
    [18, { five: 22, four: 15, three: 9 }],
    [25, { five: 20, four: 14, three: 8 }],
    [30, { five: 18, four: 13, three: 7 }],
    [35, { five: 16, four: 12, three: 6 }],
    [40, { five: 14, four: 11, three: 5 }],
    [45, { five: 12, four: 9, three: 4 }],
    [50, { five: 10, four: 7, three: 3 }],
  ])('выбирает женскую возрастную строку для возраста %i', (age, expected) => {
    expect(getGradeThresholds({ kind: 'contract', sex: 'female', age })).toEqual(expected);
  });

  it.each([
    ['male', 1, { five: 65, four: 55, three: 45 }],
    ['male', 2, { five: 70, four: 65, three: 55 }],
    ['male', 3, { five: 75, four: 70, three: 65 }],
    ['female', 1, { five: 22, four: 15, three: 9 }],
    ['female', 2, { five: 24, four: 17, three: 10 }],
    ['female', 3, { five: 26, four: 19, three: 11 }],
  ] as const)('возвращает пороги курсанта: %s, курс %i', (sex, course, expected) => {
    expect(getGradeThresholds({ kind: 'cadet', sex, course })).toEqual(expected);
  });

  it('не назначает мужские пороги женщине-призывнику', () => {
    expect(() => getGradeThresholds({ kind: 'conscript', sex: 'female' })).toThrow(/женщины-призывника/);
  });

  it('использует пороги призывника-мужчины', () => {
    expect(getGradeThresholds({ kind: 'conscript', sex: 'male' })).toEqual({ five: 60, four: 40, three: 30 });
  });
});
