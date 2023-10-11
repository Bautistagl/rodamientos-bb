import { db } from "@/firebasebautista"
import { ref } from "firebase/database";
import firebase from "firebase/app";




export default function Historial () {
   
    
    const chequearHistorial = () =>{
        // const myRef = ref(db, 'rulemanes');
        // myRef.onValue("value", (snapshot) => {
        //     // Obtener el historial de modificaciones
        //     const myHistory = snapshot.val()
        //     console.log(myHistory)
           
        // });
        const version = db.version;

console.log(version);

    }
    return(
        <>

        <button onClick={()=>{chequearHistorial()}}>VER HISTORIAL </button>
        </>
    )

}