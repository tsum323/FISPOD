import { verifiedExerciseScores } from '../data/verified-score-tables';
import { verifiedWeightedExerciseScores, type WeightCategory } from '../data/weighted-score-tables';
import { verifiedTimedExerciseScores } from '../data/timed-score-tables';
import { verifiedAgeExerciseScores, getAgeScoreTable } from '../data/age-score-tables';
import { getGradeThresholds } from '../data/evaluation-thresholds';

export type ServiceProfile = {
  specialization?: 'ground-cadet'|'tank-cadet'|'airborne'|'navy'|'mountain';
  kind: 'conscript' | 'contract' | 'cadet';
  sex: 'male' | 'female';
  age?: number;
  course?: 1 | 2 | 3;
  weightCategory?: WeightCategory;
};

export type ScoreResult = {
  points: number;
  grade: 5 | 4 | 3 | 0;
  gradeLabel: string;
  thresholds: { five: number; four: number; three: number };
  exerciseNumber: number;
  result: number;
};

export function calculateExerciseScore(
  exerciseNumber: number,
  result: number,
  profile: ServiceProfile,
): ScoreResult | null {
  if (!Number.isFinite(result)) return null;
  if ([33,34,35,36,37,38,46,47].includes(exerciseNumber) && profile.kind !== 'cadet') return null;
  if ([46,47].includes(exerciseNumber) && profile.kind !== 'cadet') return null;
  const requiredSpecialization: Record<number,NonNullable<ServiceProfile['specialization']>> = {46:'ground-cadet',47:'tank-cadet',48:'airborne',49:'navy',50:'mountain',52:'navy'};
  const required=requiredSpecialization[exerciseNumber];
  if(required && profile.specialization!==required)return null;

  let match: readonly [number, number] | undefined;
  const weightedTable = verifiedWeightedExerciseScores[exerciseNumber];
  const timedTable = verifiedTimedExerciseScores[exerciseNumber];
  const ageTable = verifiedAgeExerciseScores[exerciseNumber];
  if (weightedTable) {
    if (!profile.weightCategory) return null;
    match = weightedTable[profile.weightCategory].find(([official]) => official === result);
  } else if (ageTable) {
    if (!Number.isInteger(profile.age)) return null;
    match = getAgeScoreTable(exerciseNumber, profile.age!)?.find(([official]) => official === result);
  } else if (timedTable) {
    match = timedTable.find(([official]) => official === result);
  } else {
    const table = verifiedExerciseScores[exerciseNumber];
    if (!table) return null;
    match = table.find(([official]) => official === result);
  }
  if (!match) return null;

  const points = match[1];
  const t = getGradeThresholds(profile);
  const grade: 5 | 4 | 3 | 0 =
    points >= t.five ? 5 : points >= t.four ? 4 : points >= t.three ? 3 : 0;

  return {
    points,
    grade,
    gradeLabel: grade === 0 ? 'Ниже оценки «3»' : `Оценка «${grade}»`,
    thresholds: t,
    exerciseNumber,
    result,
  };
}

export function getVerifiedExerciseNumbers() {
  return [...new Set([
    ...Object.keys(verifiedExerciseScores).map(Number),
    ...Object.keys(verifiedWeightedExerciseScores).map(Number),
    ...Object.keys(verifiedTimedExerciseScores).map(Number),
    ...Object.keys(verifiedAgeExerciseScores).map(Number),
  ])].sort((a, b) => a - b);
}
