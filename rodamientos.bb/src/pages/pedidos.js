


import { useEffect, useState } from "react";

import Navbar from "@/components/Navbarbautista";
import PantallaPedidos from "@/components/PantallaPedidosbautista";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/", // Puedes redirigir a una página de "Próximamente" o similar
      permanent: false,
    },
  };
}

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
        <PantallaPedidos usuario={usuario}/>
        </div>
     

            
       
    )
}