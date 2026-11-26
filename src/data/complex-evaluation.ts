/**
 * Приложение № 6 к приказу МО РФ № 230 (ред. 08.12.2025).
 * Общая оценка: минимум за каждое упражнение + порог суммы.
 * Квалификационные уровни намеренно не рассчитываются: структура
 * объединённых ячеек для некоторых контрактных категорий требует отдельной сверки.
 */
export type ComplexProfile = {
  kind: 'conscript' | 'contract' | 'cadet';
  sex: 'male' | 'female';
  age?: number;
  course?: 1 | 2 | 3;
  category?: 1 | 2 | 3;
};
export type ComplexGrade = 5 | 4 | 3 | 0;
export type ComplexEvaluation = {
  status: 'passed' | 'failed';
  grade: ComplexGrade;
  gradeLabel: string;
  totalPoints: number;
  minimumPerExercise: number;
  exerciseCount: number;
  reason?: string;
  thresholds: { five: number; four: number; three: number };
};
type Row = { minimum: number; byCount: Partial<Record<2|3|4|5,{five:number;four:number;three:number}>> };
const row=(minimum:number, values:Row['byCount']):Row=>({minimum,byCount:values});
const t=(five:number,four:number,three:number)=>({five,four,three});
const contractMale: Record<number,Record<number,Row>> = {
  1:{1:row(30,{3:t(210,190,140),4:t(240,210,180)}),2:row(30,{3:t(200,180,130)}),3:row(30,{3:t(190,170,120)})},
  2:{1:row(28,{3:t(200,180,130),4:t(230,200,160)}),2:row(28,{3:t(190,170,120)}),3:row(28,{3:t(180,160,110)})},
  3:{1:row(26,{3:t(190,170,120),4:t(210,180,140)}),2:row(26,{3:t(180,160,110)}),3:row(26,{3:t(170,150,100)})},
  4:{1:row(22,{3:t(170,150,100),4:t(200,170,120)}),2:row(22,{3:t(160,140,90)}),3:row(22,{3:t(150,130,80)})},
  5:{1:row(20,{3:t(150,130,90),4:t(180,150,110)}),2:row(20,{3:t(140,120,80)}),3:row(20,{3:t(130,110,70)})},
  6:{1:row(16,{3:t(130,110,80),4:t(140,110,100)}),2:row(16,{3:t(120,100,70)}),3:row(16,{3:t(100,80,60)})},
  7:{1:row(12,{2:t(50,40,30)}),2:row(12,{2:t(50,40,30)}),3:row(12,{2:t(50,40,30)})},
  8:{1:row(10,{2:t(40,30,20)}),2:row(10,{2:t(40,30,20)}),3:row(10,{2:t(40,30,20)})},
  9:{1:row(8,{2:t(25,20,16)}),2:row(8,{2:t(25,20,16)}),3:row(8,{2:t(25,20,16)})},
};
const contractFemale: Row[] = [
  row(8,{3:t(80,70,40)}),row(7,{3:t(70,60,35)}),row(6,{3:t(60,50,30)}),
  row(5,{3:t(50,40,25)}),row(4,{3:t(40,30,20)}),
  row(3,{2:t(20,15,10)}),row(2,{2:t(15,10,5)}),
];
const cadetMale: Row[] = [
  row(30,{4:t(240,210,180)}),row(34,{5:t(350,310,250)}),row(38,{5:t(360,320,260)}),
];
const cadetFemale: Row[] = [
  row(8,{3:t(80,70,40)}),row(9,{3:t(85,75,45)}),row(10,{3:t(90,80,50)}),
];
const conscriptMaleRow=row(26,{3:t(170,150,120),4:t(230,200,160)});
function ageGroup(age:number, female=false):number {
  if(!Number.isInteger(age)||age<18) throw new Error('Укажи полный возраст не менее 18 лет.');
  if(female) return age<25?1:age<30?2:age<35?3:age<40?4:age<45?5:age<50?6:7;
  return age<25?1:age<30?2:age<35?3:age<40?4:age<45?5:age<50?6:age<55?7:age<60?8:9;
}
function resolveRow(p:ComplexProfile):Row {
  if(p.kind==='conscript'){
    if(p.sex!=='male') throw new Error('Для женщины-призывника приложение № 6 не содержит отдельной строки.');
    return conscriptMaleRow;
  }
  if(p.kind==='cadet'){
    if(p.course!==1&&p.course!==2&&p.course!==3) throw new Error('Укажи курс обучения.');
    return (p.sex==='male'?cadetMale:cadetFemale)[p.course-1];
  }
  const group=ageGroup(p.age??NaN,p.sex==='female');
  if(p.sex==='female') return contractFemale[group-1];
  if(p.category!==1&&p.category!==2&&p.category!==3) throw new Error('Для контрактника-мужчины укажи номер категории: 1, 2 или 3.');
  return contractMale[group][p.category];
}
export function evaluateComplex(p:ComplexProfile, points:readonly number[]):ComplexEvaluation {
  if(points.length<2||points.length>5) throw new Error('Для комплексной оценки требуется от двух до пяти упражнений.');
  if(points.some(x=>!Number.isFinite(x)||!Number.isInteger(x)||x<0)) throw new Error('Баллы каждого упражнения должны быть целыми неотрицательными числами.');
  const profileRow=resolveRow(p);
  const thresholds=profileRow.byCount[points.length as 2|3|4|5];
  if(!thresholds) throw new Error('Для этой категории приказом не предусмотрена оценка с таким количеством упражнений.');
  const totalPoints=points.reduce((a,b)=>a+b,0);
  const belowMinimum=points.some(x=>x<profileRow.minimum);
  const grade:ComplexGrade=belowMinimum?0:totalPoints>=thresholds.five?5:totalPoints>=thresholds.four?4:totalPoints>=thresholds.three?3:0;
  const reason=belowMinimum?'Не набран минимальный балл хотя бы за одно упражнение.':grade===0?'Сумма баллов ниже порога оценки «3».':undefined;
  return {status:grade===0?'failed':'passed',grade,gradeLabel:grade===0?'Неудовлетворительно':`Оценка «${grade}»`,totalPoints,minimumPerExercise:profileRow.minimum,exerciseCount:points.length,reason,thresholds};
}
