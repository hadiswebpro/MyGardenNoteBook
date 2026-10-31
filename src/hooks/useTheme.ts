import{useEffect,useState}from "react";
export default function useTheme(){const[dark,setDark]=useState(()=>localStorage.getItem("garden-theme")==="dark");useEffect(()=>{localStorage.setItem("garden-theme",dark?"dark":"light");document.documentElement.dataset.theme=dark?"dark":"light";},[dark]);return{dark,setDark};}
