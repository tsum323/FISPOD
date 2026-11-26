import {useMemo,useState} from 'react';
import {AlertTriangle,ShieldCheck,Plus,Trash2,CheckCircle2} from 'lucide-react';
import {exercises} from '../data/exercises';
import {calculateExerciseScore,type ServiceProfile} from '../lib/scoring';
import {evaluateComplex,type ComplexProfile} from '../data/complex-evaluation';

type Item={id:number;exercise:number;result:string};
export default function ComplexEvaluation(){
 const [kind,setKind]=useState<ComplexProfile['kind']>('contract'),[sex,setSex]=useState<ComplexProfile['sex']>('male');
 const [age,setAge]=useState('24'),[course,setCourse]=useState<'1'|'2'|'3'>('1'),[category,setCategory]=useState<'1'|'2'|'3'>('1');
 const [items,setItems]=useState<Item[]>([{id:1,exercise:1,result:''},{id:2,exercise:2,result:''},{id:3,exercise:3,result:''}]);
 const profile:ComplexProfile={kind,sex,age:Number(age),course:Number(course) as 1|2|3,category:Number(category) as 1|2|3};
 const parseResult=(exercise:number,value:string):number=>{
  if(exercise!==13)return Number(value.replace(',','.'));
  const match=value.trim().match(/^(\\d{1,2}):(\\d{2})$/);
  if(!match)return Number.NaN;
  return Number(match[1])*60+Number(match[2]);
 };
 const computed=useMemo(()=>{
  if(items.length<2||items.length>5||items.some(x=>x.result.trim()===''))return null;
  try{
   const serviceProfile:ServiceProfile={kind,sex,age:Number(age),course:Number(course) as 1|2|3};
   const scores=items.map(x=>calculateExerciseScore(x.exercise,parseResult(x.exercise,x.result),serviceProfile));
   if(scores.some(x=>!x))return {error:'Для одного или нескольких результатов нет точного значения в проверенной таблице баллов приложения № 5.'};
   return {result:evaluateComplex(profile,scores.map(x=>x!.points)),scores};
  }catch(e){return {error:e instanceof Error?e.message:'Не удалось выполнить расчёт.'};}
 },[items,kind,sex,age,course,category]);
 const add=()=>setItems(v=>v.length<5?[...v,{id:Math.max(...v.map(x=>x.id))+1,exercise:1,result:''}]:v);
 const update=(id:number,patch:Partial<Item>)=>setItems(v=>v.map(x=>x.id===id?{...x,...patch}:x));
 return <><div className="page-heading"><div><div className="eyebrow">МОДУЛЬ / ПРИЛОЖЕНИЕ № 6</div><h1>Комплексная оценка</h1><p>Расчёт общей оценки по нескольким упражнениям с проверкой минимального балла за каждое.</p></div></div>
 <div className="calculator-layout"><section className="form-card"><h3>Категория военнослужащего</h3><div className="calculator-fields">
 <label>Категория службы<select value={kind} onChange={e=>setKind(e.target.value as ComplexProfile['kind'])}><option value="contract">По контракту</option><option value="conscript">По призыву</option><option value="cadet">Курсант</option></select></label>
 <label>Пол<select value={sex} onChange={e=>setSex(e.target.value as ComplexProfile['sex'])}><option value="male">Мужской</option><option value="female">Женский</option></select></label>
 {kind==='contract'&&<label>Возраст на дату проверки<input type="number" min="18" max="100" value={age} onChange={e=>setAge(e.target.value)}/></label>}
 {kind==='contract'&&sex==='male'&&<label>Номер категории по приложению № 6<select value={category} onChange={e=>setCategory(e.target.value as '1'|'2'|'3')}><option value="1">1 категория</option><option value="2">2 категория</option><option value="3">3 категория</option></select></label>}
 {kind==='cadet'&&<label>Курс<select value={course} onChange={e=>setCourse(e.target.value as '1'|'2'|'3')}><option value="1">1 курс</option><option value="2">2 курс</option><option value="3">3 и последующие курсы</option></select></label>}
 </div><div className="section-row"><h3>Упражнения и результаты</h3><span className="muted">{items.length} из 5</span></div>
 <div className="calculator-fields">{items.map((item,index)=><div className="complex-exercise" key={item.id}><b>Упражнение {index+1}</b><label>Упражнение<select value={item.exercise} onChange={e=>update(item.id,{exercise:Number(e.target.value)})}>{exercises.filter(e=>e.number<=9||e.number===13).map(e=><option key={e.number} value={e.number}>№ {e.number} — {e.title}</option>)}</select></label><label>Результат <input type="text" inputMode={item.exercise===13?"numeric":"decimal"} value={item.result} onChange={e=>update(item.id,{result:e.target.value})} placeholder={item.exercise===13?"ММ:СС, например 4:35":"Точное значение из норматива"}/></label>{items.length>2&&<button className="secondary-btn" onClick={()=>setItems(v=>v.filter(x=>x.id!==item.id))}><Trash2 size={14}/>Убрать</button>}</div>)}
 <button className="secondary-btn" onClick={add} disabled={items.length>=5}><Plus size={15}/>Добавить упражнение</button>
 <div className="calc-source-note"><AlertTriangle size={16}/>Баллы берутся из перенесённых таблиц приложений № 5 и № 12. Сейчас доступны упражнения № 1–9 и № 13. Для № 13 ввод времени в формате ММ:СС.</div></div></section>
 <section className="result-card"><div className="result-heading"><ShieldCheck size={18}/><span>ИТОГОВАЯ ОЦЕНКА</span></div>
 {computed&&'error'in computed?<div className="result-empty">{computed.error}</div>:computed&&'result'in computed?<><div className="result-points">{computed.result.totalPoints}<small>СУММА БАЛЛОВ</small></div><div className="result-grade"><CheckCircle2 size={17}/><b>{computed.result.gradeLabel}</b></div><div className="result-meta"><div><span>Минимум за каждое упражнение</span><b>{computed.result.minimumPerExercise} баллов</b></div><div><span>Количество упражнений</span><b>{computed.result.exerciseCount}</b></div><div><span>Порог «5 / 4 / 3»</span><b>{computed.result.thresholds.five} / {computed.result.thresholds.four} / {computed.result.thresholds.three}</b></div>{computed.result.reason&&<div><span>Причина</span><b className="warn-text">{computed.result.reason}</b></div>}</div></>:<div className="result-empty">Выбери от двух до пяти упражнений и введи результаты. Сначала для каждого результата будут рассчитаны баллы, затем проверен минимум приложения № 6 и общая сумма.</div>}
 <div className="result-foot">Приложение № 6 · квалификационный уровень пока не рассчитывается</div></section></div>
 <div className="notice-panel"><AlertTriangle size={19}/><div><b>Границы текущей реализации</b><p>В расчёт включены категории и пороги общей оценки из приложения № 6. Квалификационные уровни не выводятся, поскольку для некоторых строк таблица содержит объединённые ячейки. Также подключены таблицы упражнений № 1–9 и № 13 из приложения № 5. Для упражнений № 10–12 и № 14–16 таблицы требуют дополнительных параметров (весовая категория) и отдельной верификации.</p></div><span className="tag-warn">ЧАСТИЧНО</span></div></>;
}
