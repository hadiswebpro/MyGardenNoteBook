import {useState} from "react";
import {Plus,Trash2} from "lucide-react";
import {useGarden} from "../../context/GardenContext";
import type{Task}from "../../types/garden";
import TaskItem from "../tasks/TaskItem";
import ColorPicker from "../common/ColorPicker";
import FormActions from "../common/FormActions";
import styles from "./ProjectForm.module.css";
export default function ProjectForm(){
 const {form,setForm,save,editing,data,projectTaskDrafts,setProjectTaskDrafts}=useGarden();
 const [taskTitle,setTaskTitle]=useState("");
 const existingTasks=editing?data.tasks.filter(t=>t.projectId===editing):[];
 const addTask=()=>{const title=taskTitle.trim();if(!title)return;setProjectTaskDrafts(previous=>[...previous,title]);setTaskTitle("");};
 return <form className={styles.form} onSubmit={save}>
  <label>Project name<input autoFocus required maxLength={100} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
  <label>Description<textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><ColorPicker/>
  <div className={styles.taskSection}><h3>Project tasks</h3><p>Edit, delete, or add any task belonging to this project.</p>
   {existingTasks.length>0&&<div className={styles.existingTasks}>{existingTasks.map((task:Task)=><TaskItem key={task.id} task={task}/>)}</div>}
   {projectTaskDrafts.length>0&&<ul className={styles.taskList}>{projectTaskDrafts.map((title,index)=><li key={index}><span>{title}</span><button type="button" aria-label={`Remove ${title}`} onClick={()=>setProjectTaskDrafts(tasks=>tasks.filter((_,i)=>i!==index))}><Trash2 size={15}/></button></li>)}</ul>}
   <div className={styles.addTask}><input aria-label="New task title" placeholder="Write a task..." maxLength={100} value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTask();}}}/><button type="button" className="outline" onClick={addTask} disabled={!taskTitle.trim()}><Plus size={16}/> Add</button></div><small>New tasks will be saved with the project.</small>
  </div><FormActions/>
 </form>;
}
