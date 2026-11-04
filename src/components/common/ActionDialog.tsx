import{AlertTriangle,CheckCircle2,Info,X}from "lucide-react";
import{useGarden}from "../../context/GardenContext";
import styles from "./ActionDialog.module.css";
export default function ActionDialog(){
 const{dialog,closeDialog,confirmDialog}=useGarden();
 if(!dialog)return null;
 const confirm=!!dialog.onConfirm;
 return <div className={styles.backdrop} onMouseDown={e=>{if(e.target===e.currentTarget)closeDialog();}}>
  <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="action-dialog-title" aria-describedby="action-dialog-message">
   <button className={styles.close} onClick={closeDialog} aria-label="Close"><X size={18}/></button>
   <div className={styles.icon}>{confirm?<AlertTriangle size={23}/>:<Info size={23}/>}</div>
   <h2 id="action-dialog-title">{dialog.title}</h2>
   <p id="action-dialog-message">{dialog.message}</p>
   <div className={styles.actions}>
    <button className={styles.cancel} onClick={closeDialog}>{confirm?"Cancel":"Close"}</button>
    {confirm&&<button className={styles.confirm} onClick={confirmDialog}>{dialog.confirmLabel||"Confirm"}</button>}
   </div>
  </section>
 </div>;
}
