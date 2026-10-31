import{useEffect,useState}from "react";
export default function useLocalStorage<T>(key:string,initial:()=>T){const [value,setValue]=useState<T>(initial);useEffect(()=>{localStorage.setItem(key,JSON.stringify(value));},[key,value]);return [value,setValue] as const;}
