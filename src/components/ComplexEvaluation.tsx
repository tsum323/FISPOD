import {useMemo,useState} from 'react';
import {AlertTriangle,ShieldCheck,Plus,Trash2,CheckCircle2} from 'lucide-react';
import {exercises} from '../data/exercises';
import {calculateExerciseScore,type ServiceProfile} from '../lib/scoring';
import {evaluateComplex,type ComplexProfile} from '../data/complex-evaluation';

type Item={id:number;exercise:number;result:string};
export default function ComplexEvaluation(){
 const [kind,setKind]=useState<ComplexProfile['kind']>('contract'),[sex,setSex]=useState<ComplexProfile['sex']>('male');
 const [age,setAge]=useState('24'),[course,setCourse]=useState<'1'|'2'|'3'>('1'),[category,setCategory]=useState<'1'|'2'|'3'>('1'),[weightCategory,setWeightCategory]=useState<'1'|'2'|'3'>('1');
 const [items,setItems]=useState<Item[]>([{id:1,exercise:1,result:''},{id:2,exercise:2,result:''},{id:3,exercise:3,result:''}]);
 const profile:ComplexProfile={kind,sex,age:Number(age),course:Number(course) as 1|2|3,category:Number(category) as 1|2|3};
 const parseResult=(exercise:number,value:string):number=>{
  if(exercise===20)return Number(value.replace(',','.'));
  if(![13,21,22,23,24,25,26,27,28,41,42,43,44].includes(exercise))return Number(value.replace(',','.'));
  const match=value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if(!match||Number(match[2])>59)return Number.NaN;
  return Number(match[1])*60+Number(match[2]);
 };
 const computed=useMemo(()=>{
  if(items.length<2||items.length>5||items.some(x=>x.result.trim()===''))return null;
  try{
   const serviceProfile:ServiceProfile={kind,sex,age:Number(age),course:Number(course) as 1|2|3,weightCategory};
   const scores=items.map(x=>calculateExerciseScore(x.exercise,parseResult(x.exercise,x.result),serviceProfile));
   if(scores.some(x=>!x))return {error:'Для одного или нескольких результатов нет точного значения в проверенной таблице баллов приложения № 5.'};
   return {result:evaluateComplex(profile,scores.map(x=>x!.points)),scores};
  }catch(e){return {error:e instanceof Error?e.message:'Не удалось выполнить расчёт.'};}
 },[items,kind,sex,age,course,category,weightCategory]);
 const add=()=>setItems(v=>v.length<5?[...v,{id:Math.max(...v.map(x=>x.id))+1,exercise:1,result:''}]:v);
 const update=(id:number,patch:Partial<Item>)=>setItems(v=>v.map(x=>x.id===id?{...x,...patch}:x));
 return <><div className="page-heading"><div><div className="eyebrow">МОДУЛЬ / ПРИЛОЖЕНИЕ № 6</div><h1>Комплексная оценка</h1><p>Расчёт общей оценки по нескольким упражнениям с проверкой минимального балла за каждое.</p></div></div>
 <div className="calculator-layout"><section className="form-card"><h3>Категория военнослужащего</h3><div className="calculator-fields">
 <label>Категория службы<select value={kind} onChange={e=>setKind(e.target.value as ComplexProfile['kind'])}><option value="contract">По контракту</option><option value="conscript">По призыву</option><option value="cadet">Курсант</option></select></label>
 <label>Пол<select value={sex} onChange={e=>setSex(e.target.value as ComplexProfile['sex'])}><option value="male">Мужской</option><option value="female">Женский</option></select></label>
 <label>Возраст на дату проверки<input type="number" min="18" max="100" value={age} onChange={e=>setAge(e.target.value)}/></label>
 {kind==='contract'&&sex==='male'&&<label>Номер категории по приложению № 6<select value={category} onChange={e=>setCategory(e.target.value as '1'|'2'|'3')}><option value="1">1 категория</option><option value="2">2 категория</option><option value="3">3 категория</option></select></label>}
 {kind==='cadet'&&<label>Курс<select value={course} onChange={e=>setCourse(e.target.value as '1'|'2'|'3')}><option value="1">1 курс</option><option value="2">2 курс</option><option value="3">3 и последующие курсы</option></select></label>}
 <label>Весовая категория для силовых упражнений<select value={weightCategory} onChange={e=>setWeightCategory(e.target.value as '1'|'2'|'3')}><option value="1">{sex==='female'?'до 60 кг':'до 70 кг'}</option><option value="2">{sex==='female'?'60–70 кг':'70–80 кг'}</option><option value="3">{sex==='female'?'свыше 70 кг':'свыше 80 кг'}</option></select></label>
 </div><div className="section-row"><h3>Упражнения и результаты</h3><span className="muted">{items.length} из 5</span></div>
 <div className="calculator-fields">{items.map((item,index)=><div className="complex-exercise" key={item.id}><b>Упражнение {index+1}</b><label>Упражнение<select value={item.exercise} onChange={e=>update(item.id,{exercise:Number(e.target.value)})}>{exercises.filter(e=>e.number<=19||[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44].includes(e.number)).map(e=><option key={e.number} value={e.number}>№ {e.number} — {e.title}</option>)}</select></label><label>Результат <input type="text" inputMode={[13,21,22,23,24,25,26,27,28,41,42,43,44].includes(item.exercise)?"text":item.exercise===20||item.exercise===30||item.exercise===32||item.exercise===36||item.exercise===37||item.exercise===38||item.exercise===39||item.exercise===40||item.exercise===41||item.exercise===42||item.exercise===43||item.exercise===44||item.exercise===39||item.exercise===40||item.exercise===17||item.exercise===18?"decimal":"numeric"} value={item.result} onChange={e=>update(item.id,{result:e.target.value})} placeholder={[13,21,22,23,24,25,26,27,28,41,42].includes(item.exercise)?"ММ:СС, например 1:35":item.exercise===20?"Секунды, например 30,3":item.exercise===32?"Секунды, например 11,5":[36,37,38,39,40].includes(item.exercise)?"Секунды, например 11,0":[17,18,19].includes(item.exercise)?"Секунды, например 8,4":[33,34,35].includes(item.exercise)?"Номер варианта: 1, 2 или 3":"Точное значение из таблицы"}/></label>{items.length>2&&<button className="secondary-btn" onClick={()=>setItems(v=>v.filter(x=>x.id!==item.id))}><Trash2 size={14}/>Убрать</button>}</div>)}
 <button className="secondary-btn" onClick={add} disabled={items.length>=5}><Plus size={15}/>Добавить упражнение</button>
 <div className="calc-source-note"><AlertTriangle size={16}/>Баллы берутся из проверенных таблиц приложения № 5 и порогов приложения № 12. Подключены № 1–16, № 17–19, № 20–22, № 23–32 и № 33–37 (последние пять — курсантские упражнения с вариантами и контрольными мячевыми заданиями). Для силовых упражнений № 10–12 и № 14–16 обязательно выбери весовую категорию. Для № 13, № 21–28 и № 41–44 ввод времени в формате ММ:СС; для № 17–18 и № 20 — секунды с десятыми. Возраст влияет на таблицы № 17–19 и № 23–29. Для упражнений № 33–35 вводится номер выполненного варианта (1–3); упражнения № 33–38 предназначены для курсантов; № 39–44 — специальные упражнения с оружием и экипировкой для курсантов.</div></div></section>
 <section className="result-card"><div className="result-heading"><ShieldCheck size={18}/><span>ИТОГОВАЯ ОЦЕНКА</span></div>
 {computed&&'error'in computed?<div className="result-empty">{computed.error}</div>:computed&&'result'in computed?<><div className="result-points">{computed.result.totalPoints}<small>СУММА БАЛЛОВ</small></div><div className="result-grade"><CheckCircle2 size={17}/><b>{computed.result.gradeLabel}</b></div><div className="result-meta"><div><span>Минимум за каждое упражнение</span><b>{computed.result.minimumPerExercise} баллов</b></div><div><span>Количество упражнений</span><b>{computed.result.exerciseCount}</b></div><div><span>Порог «5 / 4 / 3»</span><b>{computed.result.thresholds.five} / {computed.result.thresholds.four} / {computed.result.thresholds.three}</b></div>{computed.result.reason&&<div><span>Причина</span><b className="warn-text">{computed.result.reason}</b></div>}</div></>:<div className="result-empty">Выбери от двух до пяти упражнений и введи результаты. Сначала для каждого результата будут рассчитаны баллы, затем проверен минимум приложения № 6 и общая сумма.</div>}
 <div className="result-foot">Приложение № 6 · квалификационный уровень пока не рассчитывается</div></section></div>
 <div className="notice-panel"><AlertTriangle size={19}/><div><b>Границы текущей реализации</b><p>В расчёт включены категории и пороги общей оценки из приложения № 6. Квалификационные уровни не выводятся, поскольку для некоторых строк таблица содержит объединённые ячейки. Подключены таблицы упражнений № 1–16, включая отдельный выбор весовой категории для упражнений № 10–12 и № 14–16, а также № 13. Остальные упражнения пока не участвуют в этом калькуляторе.</p></div><span className="tag-warn">ЧАСТИЧНО</span></div></>;
}
