const PREFIX='fispod.v1.';
export function readStore<T>(key:string, fallback:T):T { try { const raw=localStorage.getItem(PREFIX+key); return raw?JSON.parse(raw) as T:fallback; } catch { return fallback; } }
export function writeStore<T>(key:string,value:T):void { localStorage.setItem(PREFIX+key,JSON.stringify(value)); }
export function exportBackup():void { const data={version:1,createdAt:new Date().toISOString(),favorites:readStore<number[]>('favorites',[]),people:readStore<any[]>('people',[]),records:readStore<any[]>('records',[])}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='fispod-backup.json'; a.click(); URL.revokeObjectURL(url); }
