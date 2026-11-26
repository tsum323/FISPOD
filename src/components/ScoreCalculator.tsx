import {useMemo,useState} from 'react';
import {AlertTriangle,Calculator,CheckCircle2,Copy} from 'lucide-react';
import {exercises} from '../data/exercises';
import {calculateExerciseScore,type ServiceProfile,getVerifiedExerciseNumbers} from '../lib/scoring';
import {getResultInputConfig,parseOfficialResult,exercisesWithoutNumericScoreTable} from '../lib/result-input';

export default function ScoreCalculator(){
 const [exercise,setExercise]=useState(1);
 const [kind,setKind]=useState<ServiceProfile['kind']>('contract');
 const [sex,setSex]=useState<ServiceProfile['sex']>('male');
 const [age,setAge]=useState('24');
 const [course,setCourse]=useState<'1'|'2'|'3'>('1');
 const [weightCategory,setWeightCategory]=useState<'1'|'2'|'3'>('1');
 const [specialization,setSpecialization]=useState<ServiceProfile['specialization']>();
 const [result,setResult]=useState('');
 const verified=new Set(getVerifiedExerciseNumbers());
 const selected=exercises.find(e=>e.number===exercise)!;
 const config=getResultInputConfig(exercise);
 const weighted=[10,11,12,14,15,16].includes(exercise);
 const needsSpecialization=[46,47,48,49,50,52,65].includes(exercise);
 const ageAmbiguous=kind==='contract'&&sex==='male'&&Number(age)===60;
 const computed=useMemo(()=>{
  if(result.trim()===''||!verified.has(exercise)||exercisesWithoutNumericScoreTable.includes(exercise as 53))return null;
  try{return calculateExerciseScore(exercise,parseOfficialResult(exercise,result),{kind,sex,age:Number(age),course:Number(course) as 1|2|3,weightCategory,specialization});}
  catch(error){return {error:error instanceof Error?error.message:'Не удалось выполнить расчёт.'};}
 },[result,exercise,kind,sex,age,course,weightCategory,specialization]);
 const copy=()=>{if(!computed||'error' in computed)return;void navigator.clipboard?.writeText('Упражнение № '+exercise+': '+result+' — '+computed.points+' баллов, '+computed.gradeLabel);};
 return <><div className="page-heading"><div><div className="eyebrow">МОДУЛЬ / 02 · ПРИЛОЖЕНИЯ № 5 И № 12</div><h1>Калькулятор баллов</h1><p>Точные значения таблиц приложения № 5 и индивидуальные пороги приложения № 12. Промежуточные значения не интерполируются.</p></div></div>
 <div className="calculator-layout"><section className="form-card"><h3>Исходные данные</h3><div className="calculator-fields">
 <label>Упражнение<select value={exercise} onChange={e=>{setExercise(Number(e.target.value));setResult('');}}>{exercises.map(e=><option key={e.number} value={e.number} disabled={!verified.has(e.number)||e.number===53}>№ {e.number} — {e.title}{e.number===53?' (нет числовой шкалы)':!verified.has(e.number)?' (нет таблицы)':''}</option>)}</select></label>
 <label>Категория службы<select value={kind} onChange={e=>setKind(e.target.value as ServiceProfile['kind'])}><option value="contract">Военнослужащий по контракту</option><option value="conscript">Военнослужащий по призыву</option><option value="cadet">Курсант</option></select></label>
 <label>Пол<select value={sex} onChange={e=>setSex(e.target.value as ServiceProfile['sex'])}><option value="male">Мужской</option><option value="female">Женский</option></select></label>
 {kind==='contract'&&<label>Возраст на дату проверки<input type="number" min="18" max="100" value={age} onChange={e=>setAge(e.target.value)}/></label>}
 {kind==='cadet'&&<label>Курс<select value={course} onChange={e=>setCourse(e.target.value as '1'|'2'|'3')}><option value="1">1 курс</option><option value="2">2 курс</option><option value="3">3 и последующие курсы</option></select></label>}
 {weighted&&<label>Весовая категория<select value={weightCategory} onChange={e=>setWeightCategory(e.target.value as '1'|'2'|'3')}><option value="1">{sex==='female'?'до 60 кг':'до 70 кг'}</option><option value="2">{sex==='female'?'60–70 кг':'70–80 кг'}</option><option value="3">{sex==='female'?'свыше 70 кг':'свыше 80 кг'}</option></select></label>}
 {needsSpecialization&&<label>Профиль специального упражнения<select value={specialization||''} onChange={e=>setSpecialization((e.target.value||undefined) as ServiceProfile['specialization'])}><option value="">Выбери профиль</option><option value="ground-cadet">Курсант: Сухопутные войска / морская пехота (№ 46)</option><option value="tank-cadet">Курсант: танковые и указанные специальные части (№ 47)</option><option value="airborne">Воздушно-десантные войска (№ 48)</option><option value="navy">Надводные корабли / подводные лодки (№ 49, 52)</option><option value="mountain">Горные подразделения (№ 50)</option><option value="transport-aviation">Военно-транспортная / дальняя авиация (№ 65)</option><option value="army-aviation">Армейская авиация (№ 65)</option><option value="tactical-aviation">Оперативно-тактическая авиация (№ 65)</option></select></label>}
 <label>{config.label}<input type="text" inputMode={config.inputMode} value={result} onChange={e=>setResult(e.target.value)} placeholder={config.placeholder}/></label>
 <div className="calc-source-note"><AlertTriangle size={16}/>Калькулятор сопоставляет результат только с существующей строкой официальной таблицы. Для упражнения № 53 отдельная числовая шкала не предусмотрена. Специальные упражнения требуют соответствующей категории или специализации; неподходящий профиль не рассчитывается.</div>
 </div><button type="button" className="mobile-result-link" onClick={()=>document.getElementById('score-result')?.scrollIntoView({behavior:'smooth',block:'start'})}>Перейти к результату расчёта ↓</button></section><section id="score-result" className="result-card"><div className="result-heading"><Calculator size={18}/><span>РЕЗУЛЬТАТ РАСЧЁТА</span></div>
 {computed&&'error' in computed?<div className="result-empty">{computed.error}</div>:computed?<><div className="result-points">{computed.points}<small>БАЛЛОВ</small></div><div className="result-grade"><CheckCircle2 size={17}/><b>{computed.gradeLabel}</b></div><div className="result-meta"><div><span>Упражнение</span><b>№ {computed.exerciseNumber} · {selected.title}</b></div><div><span>Результат</span><b>{result} {config.unit}</b></div><div><span>Порог оценки «5»</span><b>{computed.thresholds.five} баллов</b></div><div><span>Порог оценки «4»</span><b>{computed.thresholds.four} баллов</b></div><div><span>Порог оценки «3»</span><b>{computed.thresholds.three} баллов</b></div></div><button className="secondary-btn" onClick={copy}><Copy size={14}/>Скопировать результат</button></>:<div className="result-empty">{ageAmbiguous?'Для возраста ровно 60 лет автоматический расчёт заблокирован: требуется ручная проверка возрастной строки приложения № 12.':exercise===53?'Упражнение № 53 оценивается по критериям комплекса технических действий, а не по единой числовой таблице.':!verified.has(exercise)?'Для этого упражнения нет подключённой проверенной числовой таблицы.':result.trim()===''?'Введи результат в формате, указанном над полем.':'Результат не совпал с точной строкой таблицы либо выбран неподходящий профиль. Проверь формат, категорию и возраст.'}</div>}
 <div className="result-foot">Приложение № 5 · индивидуальные пороги приложения № 12 · редакция приказа № 230 от 08.12.2025 (действует с 02.02.2026)</div></section></div>
 <div className="notice-panel"><AlertTriangle size={19}/><div><b>Ограничения расчёта</b><p>Поправки приложения № 11, которые зависят от местности, не включены в индивидуальный калькулятор. Не используй результат как окончательное служебное решение без сверки с действующим приказом и условиями проведения проверки. Для возраста 60 лет у мужчин-контрактников автоматический выбор строки намеренно отключён из-за пересечения диапазонов в таблице.</p></div><span className="tag-warn">ПРОВЕРКА УСЛОВИЙ</span></div>
 </>;
}