import {useEffect} from "react";
import {Flower2,Leaf,X,LayoutDashboard,FolderKanban,ListTodo,NotebookPen,CalendarDays,Settings} from "lucide-react";
import {useGarden} from "../../context/GardenContext";
import type {Page} from "../../types/garden";
import styles from "./Sidebar.module.css";

const items = [
  {name:"Dashboard",icon:LayoutDashboard},
  {name:"Projects",icon:FolderKanban},
  {name:"Tasks",icon:ListTodo},
  {name:"Notes & Journal",icon:NotebookPen},
  {name:"Calendar",icon:CalendarDays},
  {name:"Settings",icon:Settings},
] as const satisfies ReadonlyArray<{name:Page;icon:typeof LayoutDashboard}>;

export default function Sidebar(){
  const {page,mobile,setMobile,sidebarCollapsed,setSidebarCollapsed,go}=useGarden();

  useEffect(()=>{
    if(!mobile)return;
    const onEscape=(event:KeyboardEvent)=>{
      if(event.key==="Escape")setMobile(false);
    };
    document.addEventListener("keydown",onEscape);
    return ()=>document.removeEventListener("keydown",onEscape);
  },[mobile,setMobile]);

  return <>
    {mobile&&<button type="button" className={styles["mobile-shade"]} aria-label="Close navigation menu" onClick={()=>setMobile(false)}/>}
    <aside id="garden-sidebar" className={`${styles.sidebar} ${mobile?styles.open:""} ${sidebarCollapsed?styles.collapsed:""}`} aria-label="Main navigation">
      <div className={styles.brand}>
        <span className={styles["brand-icon"]}><Flower2 size={26}/></span>
        <div className={styles["brand-text"]}><strong>my garden</strong><small>NOTEBOOK ♡</small></div>
        <button type="button" className={`icon-btn ${styles["mobile-close"]}`} aria-label="Close sidebar" onClick={()=>{if(window.matchMedia("(max-width: 900px)").matches)setMobile(false);else setSidebarCollapsed(true)}}><X/></button>
      </div>
      <p className={styles["side-label"]}>YOUR SPACE</p>
      <nav>{items.map(({name,icon:Icon})=>
        <button type="button" key={name} className={`${styles["nav-item"]} ${page===name?styles.active:""}`} title={sidebarCollapsed?name:undefined} aria-label={name} onClick={()=>go(name)}>
          <Icon size={19}/><span className={styles["nav-text"]}>{name}</span>
        </button>
      )}</nav>
      <div className={styles["sidebar-bottom"]}>
        <div className={styles["side-quote"]}><span>❀</span><p>“Bloom at your own pace, darling.”</p><small>one little step at a time</small></div>
        <small className={styles.made}><Leaf size={14}/> Made with love & little dreams</small>
      </div>
    </aside>
  </>;
}
