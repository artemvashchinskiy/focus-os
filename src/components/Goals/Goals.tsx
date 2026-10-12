import { useMemo, useState } from "react";
import type { Goal, GoalCategory, GoalPeriod } from "../../types/goal";
import "./Goals.scss";

interface GoalsProps { goals: Goal[]; date: Date; onAdd:(text:string,period:GoalPeriod,periodKey:string,category:GoalCategory)=>void; onDelete:(id:number)=>void; }
const CATEGORIES:GoalCategory[]=["None","Career","Health","Finance","Relationships","Personal","Other"];
const PERIODS:GoalPeriod[]=["year","quarter","month","week"];
const pad=(v:number)=>String(v).padStart(2,"0");
function isoWeek(date:Date){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());const day=d.getDay()||7;d.setDate(d.getDate()+4-day);const year=d.getFullYear();const start=new Date(year,0,1);const week=Math.ceil((((d.getTime()-start.getTime())/86400000)+1)/7);return {year,week};}
function periodKey(date:Date,p:GoalPeriod){if(p==="year")return String(date.getFullYear());if(p==="quarter")return `${date.getFullYear()}-Q${Math.floor(date.getMonth()/3)+1}`;if(p==="month")return `${date.getFullYear()}-${pad(date.getMonth()+1)}`;const w=isoWeek(date);return `${w.year}-W${pad(w.week)}`;}
function weekRange(date:Date){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());const day=d.getDay()||7;const mon=new Date(d);mon.setDate(d.getDate()-day+1);const sun=new Date(mon);sun.setDate(mon.getDate()+6);const fmt=(x:Date)=>`${pad(x.getDate())} ${x.toLocaleString(undefined,{month:"short"})}`;return `${fmt(mon)} – ${fmt(sun)}`;}
function label(date:Date,p:GoalPeriod){if(p==="year")return String(date.getFullYear());if(p==="quarter")return `${date.getFullYear()} Q${Math.floor(date.getMonth()/3)+1}`;if(p==="month")return date.toLocaleString(undefined,{month:"long",year:"numeric"});const w=isoWeek(date);return `${weekRange(date)} (${w.year}-W${pad(w.week)})`;}
function shift(date:Date,p:GoalPeriod,dir:-1|1){const d=new Date(date);if(p==="year")d.setFullYear(d.getFullYear()+dir);if(p==="quarter")d.setMonth(d.getMonth()+dir*3);if(p==="month")d.setMonth(d.getMonth()+dir);if(p==="week")d.setDate(d.getDate()+dir*7);return d;}

function Goals({goals,date,onAdd,onDelete}:GoalsProps){
 const [cursors,setCursors]=useState<Record<GoalPeriod,Date>>({year:new Date(date),quarter:new Date(date),month:new Date(date),week:new Date(date)});
 const [adding,setAdding]=useState<GoalPeriod|null>(null); const [draft,setDraft]=useState(""); const [category,setCategory]=useState<GoalCategory>("None");
 const groups=useMemo(()=>PERIODS.map(period=>{const cursor=cursors[period];const key=periodKey(cursor,period);return {period,cursor,key,goals:goals.filter(g=>g.period===period&&g.periodKey===key)};}),[goals,cursors]);
 const startAdd=(p:GoalPeriod)=>{setAdding(p);setDraft("");setCategory("None");};
 const save=(p:GoalPeriod,key:string)=>{if(!draft.trim())return;onAdd(draft.trim(),p,key,category);setDraft("");setAdding(null);};
 return <div className="goals-panel">
  <div className="goals-intro">Plan goals by year, quarter, month and week.</div>
  {groups.map(g=><section className="goal-period" key={g.period}>
   <div className="goal-period-header"><strong>{label(g.cursor,g.period)}</strong><div className="goal-period-nav"><button type="button" onClick={()=>setCursors(v=>({...v,[g.period]:shift(v[g.period],g.period,-1)}))}>← prev</button><button type="button" onClick={()=>setCursors(v=>({...v,[g.period]:new Date(date)}))}>this {g.period}</button><button type="button" onClick={()=>setCursors(v=>({...v,[g.period]:shift(v[g.period],g.period,1)}))}>next →</button></div></div>
   {adding===g.period?<div className="goal-add-form"><input autoFocus value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save(g.period,g.key);if(e.key==="Escape")setAdding(null)}} placeholder="Goal..."/><select value={category} onChange={e=>setCategory(e.target.value as GoalCategory)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select><button type="button" className="primary" onClick={()=>save(g.period,g.key)} disabled={!draft.trim()}>Add</button><button type="button" onClick={()=>setAdding(null)}>Cancel</button></div>:<button type="button" className="goal-add-button" onClick={()=>startAdd(g.period)}>＋ Add a goal</button>}
   <div className="goal-list">{g.goals.length===0?<div className="goals-empty">No goals yet for this {g.period}.</div>:g.goals.map(goal=><div className="goal-item" key={goal.id}><div><div className="goal-text">{goal.text}</div>{goal.category!=="None"&&<span className="goal-category">{goal.category}</span>}</div><button type="button" onClick={()=>onDelete(goal.id)} aria-label="Delete goal" title="Delete goal">×</button></div>)}</div>
   {g.period==="week"&&<div className="goal-link-hint">Link a day's task to one of these from its edit panel.</div>}
  </section>)}
 </div>;
}
export default Goals;
