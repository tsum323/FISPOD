/**
 * Приложение № 12 к приказу МО РФ от 20.04.2023 № 230.
 * Пороги баллов для индивидуальной оценки одного упражнения.
 * Источник: консолидированная редакция от 08.12.2025.
 *
 * ВАЖНО: мужские строки «55–60 лет» и «60 лет и старше» пересекаются
 * на возрасте 60 лет в опубликованной таблице. Для ровно 60 лет
 * автоматический выбор намеренно запрещён до нормативного уточнения.
 */
export type GradeThresholds = Readonly<{ five: number; four: number; three: number }>;
export type ThresholdProfile = Readonly<{
  kind: 'conscript' | 'contract' | 'cadet';
  sex: 'male' | 'female';
  age?: number;
  course?: 1 | 2 | 3;
}>;

const conscriptMale: GradeThresholds = { five: 60, four: 40, three: 30 };

const cadet: Record<'male' | 'female', readonly GradeThresholds[]> = {
  male: [
    { five: 65, four: 55, three: 45 },
    { five: 70, four: 65, three: 55 },
    { five: 75, four: 70, three: 65 },
  ],
  female: [
    { five: 22, four: 15, three: 9 },
    { five: 24, four: 17, three: 10 },
    { five: 26, four: 19, three: 11 },
  ],
};

const contractMale: readonly { maxAgeExclusive: number; thresholds: GradeThresholds }[] = [
  { maxAgeExclusive: 25, thresholds: { five: 70, four: 50, three: 34 } },
  { maxAgeExclusive: 30, thresholds: { five: 68, four: 48, three: 32 } },
  { maxAgeExclusive: 35, thresholds: { five: 60, four: 40, three: 30 } },
  { maxAgeExclusive: 40, thresholds: { five: 55, four: 36, three: 26 } },
  { maxAgeExclusive: 45, thresholds: { five: 50, four: 30, three: 24 } },
  { maxAgeExclusive: 50, thresholds: { five: 40, four: 25, three: 18 } },
  { maxAgeExclusive: 55, thresholds: { five: 30, four: 20, three: 14 } },
  { maxAgeExclusive: 60, thresholds: { five: 20, four: 16, three: 12 } },
  { maxAgeExclusive: Number.POSITIVE_INFINITY, thresholds: { five: 15, four: 12, three: 10 } },
];

const contractFemale: readonly { maxAgeExclusive: number; thresholds: GradeThresholds }[] = [
  { maxAgeExclusive: 25, thresholds: { five: 22, four: 15, three: 9 } },
  { maxAgeExclusive: 30, thresholds: { five: 20, four: 14, three: 8 } },
  { maxAgeExclusive: 35, thresholds: { five: 18, four: 13, three: 7 } },
  { maxAgeExclusive: 40, thresholds: { five: 16, four: 12, three: 6 } },
  { maxAgeExclusive: 45, thresholds: { five: 14, four: 11, three: 5 } },
  { maxAgeExclusive: 50, thresholds: { five: 12, four: 9, three: 4 } },
  { maxAgeExclusive: Number.POSITIVE_INFINITY, thresholds: { five: 10, four: 7, three: 3 } },
];

function byAge(
  age: number,
  rows: readonly { maxAgeExclusive: number; thresholds: GradeThresholds }[],
): GradeThresholds {
  return rows.find((row) => age < row.maxAgeExclusive)!.thresholds;
}

export function getGradeThresholds(profile: ThresholdProfile): GradeThresholds {
  if (profile.kind === 'conscript') {
    if (profile.sex !== 'male') {
      throw new Error('Для женщины-призывника приложение № 12 не содержит подтверждённой отдельной строки. Автоматический расчёт заблокирован.');
    }
    return conscriptMale;
  }

  if (profile.kind === 'cadet') {
    if (profile.course !== 1 && profile.course !== 2 && profile.course !== 3) {
      throw new Error('Укажи курс обучения: 1, 2 или 3 и старше.');
    }
    return cadet[profile.sex][profile.course - 1];
  }

  const age = profile.age;
  if (!Number.isInteger(age) || age! < 18) {
    throw new Error('Укажи корректный полный возраст военнослужащего (не менее 18 лет).');
  }

  if (profile.sex === 'male' && age === 60) {
    throw new Error('В приложении № 12 пересекаются возрастные интервалы 55–60 и 60 лет и старше. Требуется ручная проверка категории для 60 лет.');
  }

  return byAge(age!, profile.sex === 'male' ? contractMale : contractFemale);
}
