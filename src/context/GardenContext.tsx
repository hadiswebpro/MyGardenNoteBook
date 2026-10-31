import{createContext,useContext}from "react";import type{ReactNode}from "react";import useGardenState from "../hooks/useGardenState";
type GardenContextValue=ReturnType<typeof useGardenState>;
const Context=createContext<GardenContextValue|null>(null);
export function GardenProvider({children}:{children:ReactNode}){const value=useGardenState();return <Context.Provider value={value}>{children}</Context.Provider>}
export function useGarden(){const value=useContext(Context);if(!value)throw new Error("GardenProvider is missing");return value;}
