import{useMemo,useState}from "react";
import type{FormEvent}from "react";
import type{EditorKind,GardenForm,Note,Page,Project,Task}from "../types/garden";
import{gardenColors}from "../constants/colors";
import{today}from "../utils/date";
import{projectProgress}from "../utils/projectProgress";
import{downloadGarden,isGardenData,readGarden,storageKey}from "../utils/storage";
import useLocalStorage from "./useLocalStorage";
import useTheme from "./useTheme";
const blankForm=():GardenForm=>({title:"",description:"",content:"",color:gardenColors[0],projectId:"",due:"",date:today(),kind:"note"});
export default function useGardenState(){
 const[data,setData]=useLocalStorage(storageKey,readGarden);
 const[page,setPage]=useState<Page>("Dashboard"),[mobile,setMobile]=useState(false),[search,setSearch]=useState(""),[filter,setFilter]=useState(""),[noteKind,setNoteKind]=useState<"note"|"journal">("note"),[month,setMonth]=useState(new Date());
 const[sidebarCollapsed,setSidebarCollapsed]=useState(true);
 const[modal,setModal]=useState<EditorKind|null>(null),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState<GardenForm>(blankForm);
 const[projectTaskDrafts,setProjectTaskDrafts]=useState<string[]>([]);
 const[profileName,setProfileName]=useLocalStorage("garden-profile-name","H");
 const[profileImage,setProfileImage]=useLocalStorage<string|null>("garden-profile-image",null);
 const{dark,setDark}=useTheme();
 const upcoming=useMemo(()=>data.tasks.filter(t=>!t.done&&!!t.due).sort((a,b)=>(a.due??"").localeCompare(b.due??"")),[data.tasks]);
 const progress=(id:string)=>projectProgress(data.tasks,id);
 const go=(next:Page)=>{setPage(next);setSearch("");setFilter("");setMobile(false);};
 const open=(type:EditorKind,id?:string)=>{setEditing(id??null);setProjectTaskDrafts([]);let next=blankForm();
 if(type==="project"){const p=data.projects.find(x=>x.id===id);if(p)next={...next,title:p.name,description:p.description,color:p.color};}
 if(type==="task"){const t=data.tasks.find(x=>x.id===id);if(t)next={...next,title:t.title,projectId:t.projectId,due:t.due??""};}
 if(type==="note"){const n=data.notes.find(x=>x.id===id);if(n)next={...next,title:n.title,content:n.content,color:n.color,date:n.date,kind:n.kind};else next.kind=noteKind;}
 setForm(next);setModal(type);};
 const save=(e:FormEvent)=>{e.preventDefault();if(!modal||!form.title.trim())return;const id=editing??crypto.randomUUID();
 if(modal==="project"){const p:Project={id,name:form.title.trim(),description:form.description,color:form.color};setData(d=>({...d,projects:editing?d.projects.map(x=>x.id===id?p:x):[...d.projects,p],tasks:[...d.tasks,...projectTaskDrafts.filter(title=>title.trim()).map(title=>({id:crypto.randomUUID(),title:title.trim(),projectId:id,due:today(),done:false}))]}));}
 if(modal==="task"){const t:Task={id,title:form.title.trim(),projectId:form.projectId,...(form.due?{due:form.due}:{}),done:editing?!!data.tasks.find(x=>x.id===id)?.done:false};setData(d=>({...d,tasks:editing?d.tasks.map(x=>x.id===id?t:x):[...d.tasks,t]}));}
 if(modal==="note"){const n:Note={id,title:form.title.trim(),content:form.content,color:form.color,date:form.date,kind:form.kind,pinned:editing?!!data.notes.find(x=>x.id===id)?.pinned:false};setData(d=>({...d,notes:editing?d.notes.map(x=>x.id===id?n:x):[n,...d.notes]}));}
 setModal(null);};
 const remove=(type:EditorKind,id:string)=>{if(!window.confirm("Remove this from your garden?"))return;
 setData(d=>type==="project"?{...d,projects:d.projects.filter(x=>x.id!==id),tasks:d.tasks.map(t=>t.projectId===id?{...t,projectId:""}:t)}:type==="task"?{...d,tasks:d.tasks.filter(x=>x.id!==id)}:{...d,notes:d.notes.filter(x=>x.id!==id)});};
 const toggleTask=(id:string)=>setData(d=>({...d,tasks:d.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}));
 const togglePin=(id:string)=>setData(d=>({...d,notes:d.notes.map(n=>n.id===id?{...n,pinned:!n.pinned}:n)}));
 const importData=async(file?:File)=>{if(!file)return;try{const value:unknown=JSON.parse(await file.text());if(!isGardenData(value))throw Error("Invalid backup");if(window.confirm("Replace current data with this backup?"))setData(value);}catch{window.alert("Invalid backup file.");}};
 return{data,page,setPage,mobile,setMobile,sidebarCollapsed,setSidebarCollapsed,search,setSearch,filter,setFilter,noteKind,setNoteKind,month,setMonth,modal,setModal,editing,form,setForm,projectTaskDrafts,setProjectTaskDrafts,profileName,setProfileName,profileImage,setProfileImage,dark,setDark,upcoming,progress,go,open,save,remove,toggleTask,togglePin,exportData:()=>downloadGarden(data),importData};
}
