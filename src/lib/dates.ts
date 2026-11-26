export function ageOn(dob:string,date:string):number {
 const birth=new Date(dob+'T00:00:00'),at=new Date(date+'T00:00:00');
 if(!Number.isFinite(birth.getTime())||!Number.isFinite(at.getTime()))throw new Error('Некорректная дата.');
 let age=at.getFullYear()-birth.getFullYear();
 if(at.getMonth()<birth.getMonth()||(at.getMonth()===birth.getMonth()&&at.getDate()<birth.getDate()))age--;
 return age;
}