import { verifiedExerciseScores } from '../data/verified-score-tables';
export type ServiceProfile={kind:'conscript'|'contract'|'cadet';sex:'male'|'female';age?:number;course?:1|2|3};
export type ScoreResult={points:number;grade:5|4|3|0;gradeLabel:string;thresholds:{five:number;four:number;three:number};exerciseNumber:number;result:number};
function thresholds(profile:ServiceProfile){
 if(profile.kind==='conscript')return {five:60,four:40,three:30};
 if(profile.kind==='cadet'){
  if(profile.sex==='female')return profile.course===1?{five:22,four:15,three:9}:profile.course===2?{five:24,four:17,three:10}:{five:26,four:19,three:11};
  return profile.course===1?{five:65,four:55,three:45}:profile.course===2?{five:70,four:65,three:55}:{five:75,four:70,three:65};
 }
 const age=profile.age;
 if(!age||age<18)throw new Error('Укажи корректный возраст военнослужащего.');
 if(profile.sex==='female'){
  if(age<25)return {five:22,four:15,three:9};
  if(age<30)return {five:20,four:14,three:8};
  if(age<35)return {five:18,four:13,three:7};
  if(age<40)return {five:16,four:12,three:6};
  if(age<45)return {five:14,four:11,three:5};
  if(age<50)return {five:12,four:9,three:4};
  return {five:10,four:7,three:3};
 }
 if(age<25)return {five:70,four:50,three:34};
 if(age<30)return {five:68,four:48,three:32};
 if(age<35)return {five:60,four:40,three:30};
 if(age<40)return {five:55,four:36,three:26};
 if(age<45)return {five:50,four:30,three:24};
 if(age<50)return {five:40,four:25,three:18};
 if(age<55)return {five:30,four:20,three:14};
 if(age<60)return {five:20,four:16,three:12};
 if(age===60)throw new Error('В приложении № 12 пересекаются возрастные интервалы 55–60 и 60 лет и старше. Требуется ручная проверка категории для 60 лет.');
 return {five:15,four:12,three:10};
}
export function calculateExerciseScore(exerciseNumber:number,result:number,profile:ServiceProfile):ScoreResult|null{
 const table=verifiedExerciseScores[exerciseNumber];if(!table||!Number.isFinite(result))return null;
 const match=table.find(([official])=>official===result);if(!match)return null;
 const points=match[1],t=thresholds(profile);
 const grade:5|4|3|0=points>=t.five?5:points>=t.four?4:points>=t.three?3:0;
 return {points,grade,gradeLabel:grade===0?'Ниже оценки «3»':`Оценка «${grade}»`,thresholds:t,exerciseNumber,result};
}
export function getVerifiedExerciseNumbers(){return Object.keys(verifiedExerciseScores).map(Number).sort((a,b)=>a-b);}
