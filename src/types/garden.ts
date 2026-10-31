export type Page="Dashboard"|"Projects"|"Tasks"|"Notes & Journal"|"Calendar"|"Settings";
export type Project={id:string;name:string;description:string;color:string};
export type Task={id:string;title:string;projectId:string;due:string;done:boolean};
export type Note={id:string;title:string;content:string;color:string;date:string;kind:"note"|"journal";pinned:boolean};
export type GardenData={projects:Project[];tasks:Task[];notes:Note[]};
export type EditorKind="project"|"task"|"note";
export type GardenForm={title:string;description:string;content:string;color:string;projectId:string;due:string;date:string;kind:"note"|"journal"};
