import {LayoutDashboard,FolderKanban,ListTodo,NotebookPen,CalendarDays,Settings,Moon,Sun,Menu,X,Flower2,Leaf} from "lucide-react";
import {useGarden} from "./context/GardenContext";
import {GardenProvider} from "./context/GardenContext";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import PageHeading from "./components/layout/PageHeading";
import GardenModal from "./components/common/GardenModal";
import styles from "./App.module.css";
function GardenApp(){const {page,mobile,setMobile,go,nav,dark,setDark}=useGarden();return (<div className="shell">{mobile&&<button className="mobile-shade" aria-label="Close menu" onClick={()=>setMobile(false)}/>}<aside className={"sidebar "+(mobile?"open":"")}><div className="brand"><span className="brand-icon"><Flower2 size={26}/></span><div><strong>my garden</strong><small>NOTEBOOK ♡</small></div><button className="icon-btn mobile-close" onClick={()=>setMobile(false)}><X/></button></div><p className="side-label">YOUR SPACE</p><nav>{nav.map(({name,icon:Icon})=><button key={name} className={"nav-item "+(page===name?"active":"")} onClick={()=>go(name)}><Icon size={19}/>{name}</button>)}</nav><div className="sidebar-bottom"><div className="side-quote"><span>❀</span><p>“Bloom at your own pace, darling.”</p><small>one little step at a time</small></div><small className="made"><Leaf size={14}/> Made with love & little dreams</small></div></aside><div className="main-area"><header className="topbar"><div className="top-left"><button className="icon-btn menu-btn" aria-label="Open menu" onClick={()=>setMobile(true)}><Menu/></button><span>My Garden <b>/</b> <strong>{page}</strong></span></div><div className="top-right"><button className="icon-btn" aria-label="Toggle dark mode" onClick={()=>setDark(!dark)}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button><span className="avatar">H</span></div></header><main className="content">
{page==="Dashboard"?<DashboardPage/>:<><PageHeading/>{page==="Projects"?<ProjectsPage/>:page==="Tasks"?<TasksPage/>:page==="Notes & Journal"?<NotesPage/>:page==="Calendar"?<CalendarPage/>:<SettingsPage/>}</>}</main><footer>Made with ♡ · My Garden Notebook <span>Grow gently, every day ✿</span></footer></div>
<GardenModal/></div>);}
export default function App(){return <GardenProvider><GardenApp/></GardenProvider>}
