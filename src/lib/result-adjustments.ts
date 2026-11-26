/**
 * Приложение № 11 к приказу МО РФ № 230, ред. 08.12.2025.
 * Поправки к результатам при выполнении в районах Крайнего Севера /
 * приравненных районах (north) или на высоте более 1500 м (altitude).
 * В один расчёт применяется только одна поправка.
 */
export type ExerciseCondition = 'standard' | 'north' | 'altitude';
export type ExerciseCorrection = Readonly<{ amount: number; unit: 'seconds' | 'repetitions' }>;

const corrections: Readonly<Record<number, Readonly<{ north: ExerciseCorrection; altitude: ExerciseCorrection }>>> = {
  23: { north: { amount: -2, unit: 'seconds' }, altitude: { amount: -3, unit: 'seconds' } },
  24: { north: { amount: -10, unit: 'seconds' }, altitude: { amount: -15, unit: 'seconds' } },
  25: { north: { amount: -50, unit: 'seconds' }, altitude: { amount: -60, unit: 'seconds' } },
  26: { north: { amount: -60, unit: 'seconds' }, altitude: { amount: -120, unit: 'seconds' } },
  27: { north: { amount: -120, unit: 'seconds' }, altitude: { amount: -120, unit: 'seconds' } },
  29: { north: { amount: 20, unit: 'repetitions' }, altitude: { amount: 30, unit: 'repetitions' } },
  43: { north: { amount: -90, unit: 'seconds' }, altitude: { amount: -120, unit: 'seconds' } },
  44: { north: { amount: -120, unit: 'seconds' }, altitude: { amount: -180, unit: 'seconds' } },
  45: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  46: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  47: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  48: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  49: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  50: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  51: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  52: { north: { amount: -3, unit: 'seconds' }, altitude: { amount: -5, unit: 'seconds' } },
  41: { north: { amount: -2, unit: 'seconds' }, altitude: { amount: -3, unit: 'seconds' } },
  42: { north: { amount: -5, unit: 'seconds' }, altitude: { amount: -7, unit: 'seconds' } },
  59: { north: { amount: -80, unit: 'seconds' }, altitude: { amount: -120, unit: 'seconds' } },
  60: { north: { amount: -20, unit: 'seconds' }, altitude: { amount: -30, unit: 'seconds' } },
};

export function getExerciseCorrection(exercise: number, condition: ExerciseCondition): ExerciseCorrection | null {
  if (condition === 'standard') return null;
  return corrections[exercise]?.[condition] ?? null;
}

export function applyExerciseCorrection(exercise: number, result: number, condition: ExerciseCondition): number {
  if (!Number.isFinite(result)) return Number.NaN;
  const correction = getExerciseCorrection(exercise, condition);
  return correction ? result + correction.amount : result;
}

export function hasExerciseCorrection(exercise: number): boolean {
  return exercise in corrections;
}
