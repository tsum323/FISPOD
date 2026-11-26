export type ResultInputKind = 'clock' | 'decimal-seconds' | 'seconds' | 'variant' | 'hits' | 'distance' | 'count';
export type ResultInputConfig = { kind: ResultInputKind; label: string; placeholder: string; inputMode: 'text' | 'decimal' | 'numeric'; unit: string };
const clockExercises = new Set([13,21,22,23,24,25,26,27,28,41,42,43,44,45,46,47,48,49,50,51,52,56,57,59,60,61]);
const decimalSecondExercises = new Set([17,18,19,20,30,32,36,37,38,39,40,62]);
const secondExercises = new Set([9,67,70]);
const variantExercises = new Set([33,34,35,65]);
const hitExercises = new Set([54,55,69]);
const distanceExercises = new Set([58,68]);
export function getResultInputConfig(exercise:number):ResultInputConfig {
 if(clockExercises.has(exercise))return {kind:'clock',label:'Время, ММ:СС',placeholder:'Например, 1:35',inputMode:'text',unit:'сек.'};
 if(decimalSecondExercises.has(exercise))return {kind:'decimal-seconds',label:'Время, секунды',placeholder:'Например, 11,5',inputMode:'decimal',unit:'сек.'};
 if(secondExercises.has(exercise))return {kind:'seconds',label:'Время удержания, секунды',placeholder:'Например, 32',inputMode:'decimal',unit:'сек.'};
 if(variantExercises.has(exercise))return {kind:'variant',label:'Выполненный вариант',placeholder:'1, 2 или 3',inputMode:'numeric',unit:'вариант'};
 if(hitExercises.has(exercise))return {kind:'hits',label:'Количество засчитанных попаданий',placeholder:'1, 2 или 3',inputMode:'numeric',unit:'попадания'};
 if(distanceExercises.has(exercise))return {kind:'distance',label:'Дальность, метры',placeholder:'Например, 30',inputMode:'numeric',unit:'м'};
 return {kind:'count',label:'Результат по таблице',placeholder:'Введи точное значение из таблицы',inputMode:'decimal',unit:'ед.'};
}
export function parseOfficialResult(exercise:number,raw:string):number {
 const value=raw.trim().replace(',','.'); if(!value)return Number.NaN;
 if(clockExercises.has(exercise)){const match=value.match(/^(\d{1,2}):(\d{2})$/);if(!match||Number(match[2])>59)return Number.NaN;return Number(match[1])*60+Number(match[2]);}
 const parsed=Number(value);return Number.isFinite(parsed)?parsed:Number.NaN;
}
export const exercisesWithoutNumericScoreTable=[53] as const;