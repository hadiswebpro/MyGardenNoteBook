import {createContext,useContext,useEffect,useState} from "react";
import type {FormEvent} from "react";
import TaskItem from "../components/tasks/TaskItem";
import ProjectCard from "../components/projects/ProjectCard";
import NoteCard from "../components/notes/NoteCard";
type Page="Dashboard"|"Projects"|"Tasks"|"Notes & Journal"|"Calendar"|"Settings";
type Project={id:string;name:string;description:string;color:string};
type Task={id:string;title:string;projectId:string;due:string;done:boolean};
type Note={id:string;title:string;content:string;color:string;date:string;kind:"note"|"journal";pinned:boolean};
type Data={projects:Project[];tasks:Task[];notes:Note[]};
const today=()=>new Date().toLocaleDateString("en-CA");
const seed:Data={projects:[{id:"p1",name:"My little garden",description:"A place for all the things I want to grow.",color:"#b8797e"},{id:"p2",name:"Creative corner",description:"Ideas, stories and little inspirations.",color:"#8da28a"}],tasks:[{id:"t1",title:"Plant the first seed",projectId:"p1",due:today(),done:true},{id:"t2",title:"Write down a new idea",projectId:"p2",due:today(),done:false},{id:"t3",title:"Take a moment for myself",projectId:"",due:today(),done:false}],notes:[{id:"n1",title:"A little reminder",content:"Every beautiful thing begins with a little bit of care. Take your time, you are growing. ♡",color:"#f4e3e0",date:today(),kind:"journal",pinned:true}]};
const nav=[{name:"Dashboard",icon:LayoutDashboard},{name:"Projects",icon:FolderKanban},{name:"Tasks",icon:ListTodo},{name:"Notes & Journal",icon:NotebookPen},{name:"Calendar",icon:CalendarDays},{name:"Settings",icon:Settings}] as const;
const colors=["#b8797e","#8da28a","#d8b16f","#a89abc","#83a9b6","#c79583"];
const read=():Data=>{try{const x=JSON.parse(localStorage.getItem("garden-data")||"null");if(x&&Array.isArray(x.projects)&&Array.isArray(x.tasks)&&Array.isArray(x.notes))return x;}catch{}return seed;};
function useGardenController(){
const [data,setData]=useState<Data>(read),[page,setPage]=useState<Page>("Dashboard"),[dark,setDark]=useState(localStorage.getItem("garden-theme")==="dark"),[mobile,setMobile]=useState(false),[modal,setModal]=useState<"project"|"task"|"note"|null>(null),[editing,setEditing]=useState<string|null>(null),[search,setSearch]=useState(""),[filter,setFilter]=useState(""),[noteKind,setNoteKind]=useState<"note"|"journal">("note"),[month,setMonth]=useState(new Date());
const [form,setForm]=useState({title:"",description:"",content:"",color:colors[0],projectId:"",due:today(),date:today(),kind:"note" as "note"|"journal"});
useEffect(()=>{localStorage.setItem("garden-data",JSON.stringify(data));},[data]);
useEffect(()=>{localStorage.setItem("garden-theme",dark?"dark":"light");document.documentElement.dataset.theme=dark?"dark":"light";},[dark]);
const progress=(id:string)=>{const ts=data.tasks.filter(t=>t.projectId===id);return ts.length?Math.round(ts.filter(t=>t.done).length/ts.length*100):0;};
const upcoming=data.tasks.filter(t=>!t.done).sort((a,b)=>a.due.localeCompare(b.due));
const go=(p:Page)=>{setPage(p);setSearch("");setFilter("");setMobile(false);};
const open=(type:"project"|"task"|"note",id?:string)=>{setEditing(id||null);const item:any=type==="project"?data.projects.find(p=>p.id===id):type==="task"?data.tasks.find(t=>t.id===id):data.notes.find(n=>n.id===id);setForm({title:item?.title||item?.name||"",description:item?.description||"",content:item?.content||"",color:item?.color||colors[0],projectId:item?.projectId||"",due:item?.due||today(),date:item?.date||today(),kind:item?.kind||noteKind});setModal(type);};
const save=(e:FormEvent)=>{e.preventDefault();if(!modal||!form.title.trim())return;const id=editing||crypto.randomUUID();if(modal==="project"){const p:Project={id,name:form.title.trim(),description:form.description,color:form.color};setData(d=>({...d,projects:editing?d.projects.map(x=>x.id===id?p:x):[...d.projects,p]}));}else if(modal==="task"){const t:Task={id,title:form.title.trim(),projectId:form.projectId,due:form.due,done:editing?!!data.tasks.find(t=>t.id===id)?.done:false};setData(d=>({...d,tasks:editing?d.tasks.map(x=>x.id===id?t:x):[...d.tasks,t]}));}else{const n:Note={id,title:form.title.trim(),content:form.content,color:form.color,date:form.date,kind:form.kind,pinned:editing?!!data.notes.find(n=>n.id===id)?.pinned:false};setData(d=>({...d,notes:editing?d.notes.map(x=>x.id===id?n:x):[n,...d.notes]}));}setModal(null);};
const remove=(type:"project"|"task"|"note",id:string)=>{if(!confirm("Remove this from your garden?"))return;setData(d=>type==="project"?{...d,projects:d.projects.filter(p=>p.id!==id),tasks:d.tasks.map(t=>t.projectId===id?{...t,projectId:""}:t)}:type==="task"?{...d,tasks:d.tasks.filter(t=>t.id!==id)}:{...d,notes:d.notes.filter(n=>n.id!==id)});};
const taskRow=(item:{id:string;title:string;projectId:string;due:string;done:boolean})=><TaskItem task={item}/>;
const projectCard=(item:{id:string;name:string;description:string;color:string})=><ProjectCard project={item}/>;
const noteCard=(item:{id:string;title:string;content:string;color:string;date:string;kind:'note'|'journal';pinned:boolean})=><NoteCard note={item}/>;
const exportData=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="my-garden-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const importData=async(f?:File)=>{if(!f)return;try{const x=JSON.parse(await f.text());if(!Array.isArray(x.projects)||!Array.isArray(x.tasks)||!Array.isArray(x.notes))throw Error();if(confirm("Replace current data with this backup?"))setData(x);}catch{alert("Invalid backup file.");}};
const monthLabel=month.toLocaleDateString("en-US",{month:"long",year:"numeric"}),offset=new Date(month.getFullYear(),month.getMonth(),1).getDay(),days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
return {data,setData,page,setPage,dark,setDark,mobile,setMobile,modal,setModal,editing,setEditing,search,setSearch,filter,setFilter,noteKind,setNoteKind,month,setMonth,form,setForm,progress,upcoming,go,open,save,remove,taskRow,projectCard,noteCard,exportData,importData,monthLabel,offset,days,today,nav,colors};
}
export type GardenController=ReturnType<typeof useGardenController>;
const Context=createContext<GardenController|null>(null);
export function GardenProvider({children}:{children:React.ReactNode}){const value=useGardenController();return <Context.Provider value={value}>{children}</Context.Provider>}
export function useGarden(){const value=useContext(Context);if(!value)throw new Error('GardenProvider is missing');return value;}
