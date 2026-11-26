import {useMemo,useState} from 'react';
import {AlertTriangle,ClipboardCheck} from 'lucide-react';
import {exercises} from '../data/exercises';
import {getExerciseRequirements,type RequirementProfile} from '../data/exercise-requirements';

export default function ExerciseRequirements(){
 const [kind,setKind]=useState<RequirementProfile['kind']>('contract');
 const [sex,setSex]=useState<RequirementProfile['sex']>('male');
 const [age,setAge]=useState('24');
 const [category,setCategory]=useState<'1'|'2'|'3'>('1');
 const [course,setCourse]=useState<'1'|'2'|'3'>('1');
 const [conscriptCount,setConscriptCount]=useState<'3'|'4'|'unknown'>('unknown');
 const profile:RequirementProfile={kind,sex,age:Number(age),category:Number(category) as 1|2|3,course:Number(course) as 1|2|3,conscriptCount:conscriptCount==='unknown'?undefined:Number(conscriptCount) as 3|4};
 const requirements=useMemo(()=>getExerciseRequirements(profile),[kind,sex,age,category,course,conscriptCount]);
 return <><div className="page-heading"><div><div className="eyebrow">МОДУЛЬ / ПУНКТ 88 · РАЗДЕЛ II</div><h1>Анализ требований</h1><p>Определение количества и структуры упражнений для проверки по категории военнослужащего.</p></div></div>
 <div className="calculator-layout"><section className="form-card"><h3>Исходные данные</h3><div className="calculator-fields">
 <label>Категория службы<select value={kind} onChange={e=>setKind(e.target.value as RequirementProfile['kind'])}><option value="contract">По контракту</option><option value="conscript">По призыву</option><option value="cadet">Курсант</option></select></label>
 <label>Пол<select value={sex} onChange={e=>setSex(e.target.value as RequirementProfile['sex'])}><option value="male">Мужской</option><option value="female">Женский</option></select></label>
 {kind==='contract'&&<label>Возраст на дату проверки<input type="number" min="18" max="100" value={age} onChange={e=>setAge(e.target.value)}/></label>}
 {kind==='contract'&&sex==='male'&&Number(age)<50&&<label>Категория по приложению № 6<select value={category} onChange={e=>setCategory(e.target.value as '1'|'2'|'3')}><option value="1">Категория № 1</option><option value="2">Категория № 2</option><option value="3">Категория № 3</option></select></label>}
 {kind==='cadet'&&<label>Курс обучения<select value={course} onChange={e=>setCourse(e.target.value as '1'|'2'|'3')}><option value="1">1 курс</option><option value="2">2 курс</option><option value="3">3 и последующие курсы</option></select></label>}
 {kind==='conscript'&&<label>Количество по решению для подразделения<select value={conscriptCount} onChange={e=>setConscriptCount(e.target.value as '3'|'4'|'unknown')}><option value="unknown">Не определено — уточнить в подразделении</option><option value="3">3 упражнения</option><option value="4">4 упражнения</option></select></label>}
 </div><div className="calc-source-note"><AlertTriangle size={16}/>Основание: пункт 88 раздела II приказа МО РФ № 230 в редакции от 08.12.2025. Модуль определяет структуру проверки, но не назначает конкретные СФУ вместо программы подготовки подразделения.</div></section>
 <section className="result-card"><div className="result-heading"><ClipboardCheck size={18}/><span>ТРЕБОВАНИЯ К ПРОВЕРКЕ</span></div>
 {requirements.supported?<><div className="result-points">{requirements.total}<small>УПРАЖНЕНИЯ ВСЕГО</small></div><p className="requirements-note">{requirements.note}</p><div className="requirements-blocks">{requirements.blocks.map((b,i)=>{const available=exercises.filter(e=>b.special?e.section==='Специальные физические упражнения':b.groups.includes(e.group));return <div className="requirements-block" key={i}><div><b>{b.title}</b><span>{b.count} {b.count===1?'упражнение':'упражнения'}</span></div><p>{b.description}</p>{b.alternatives&&<ul>{b.alternatives.map(x=><li key={x}>{x}</li>)}</ul>}<details><summary>Посмотреть группы и упражнения из приложения № 5</summary><div className="requirements-exercises">{available.map(e=><div key={e.number}><b>№ {e.number}</b><span>{e.title}</span></div>)}</div></details></div>})}</div></>:<div className="result-empty">{requirements.note}</div>}
 <div className="result-foot">Не подменяет приказ командира и программу подготовки подразделения. При спорной категории требуется проверка по нормативному документу.</div></section></div>
 <div className="notice-panel"><AlertTriangle size={18}/><div><b>Граница автоматизации</b><p>Для военнослужащих по призыву приказ предусматривает 3 или 4 упражнения в зависимости от подразделения. Для IIIа/IIIб группы здоровья и военнослужащих с инвалидностью предусмотрены отдельные варианты; их применение требует медицинской категории и проверки соответствующих положений приказа.</p></div><span className="tag-warn">УЧЁТ УСЛОВИЙ</span></div></>;
}
