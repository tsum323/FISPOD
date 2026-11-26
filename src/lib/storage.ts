const PREFIX='fispod.v1.';
export function readStore<T>(key:string, fallback:T):T { try { const raw=localStorage.getItem(PREFIX+key); return raw?JSON.parse(raw) as T:fallback; } catch { return fallback; } }
export function writeStore<T>(key:string,value:T):void { localStorage.setItem(PREFIX+key,JSON.stringify(value)); }
export function exportBackup():void {
 const data={version:2,createdAt:new Date().toISOString(),favorites:readStore<number[]>('favorites',[]),people:readStore<any[]>('people.v2',readStore<any[]>('people',[])),records:readStore<any[]>('records.v2',readStore<any[]>('records',[]))};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='fispod-backup.json'; a.click(); URL.revokeObjectURL(url);
}
export async function importBackup(file:File):Promise<{people:number;records:number}>{
 const parsed=JSON.parse(await file.text());
 if(!parsed||![1,2].includes(parsed.version)||!Array.isArray(parsed.favorites)||!Array.isArray(parsed.people)||!Array.isArray(parsed.records))throw new Error('Файл не является резервной копией FISPOD.');
 writeStore('favorites',parsed.favorites);
 writeStore('people.v2',parsed.people);
 writeStore('records.v2',parsed.records);
 return {people:parsed.people.length,records:parsed.records.length};
}
