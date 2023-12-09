


import { useEffect, useState } from "react";

import Navbar from "@/components/Navbarbautista";

import PantallaPedidos2 from "@/components/PantallaPedidos2bautista";



export default function Pedidos() {

    const [usuario,setUsuario] =useState('')

    useEffect(() => {

    const id = localStorage.getItem('idRodamientos')

    if(id){
      setUsuario(id)
      
    }
    else{
      alert('nadie logeado')
    }
  }, []);



    return(
       
       
        
        <div className="dashboard-content">
            <Navbar/>
        <PantallaPedidos2 usuario={usuario}/>
        </div>
     

            
       
    )
}