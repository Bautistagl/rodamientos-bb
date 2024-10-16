
import Footer from "@/components/Footerbautista"
import InicioProduc from "@/components/InicioProductobautista"
import Navbar from "@/components/Navbarbautista"
import React from "react"

export async function getServerSideProps() {
    return {
      redirect: {
        destination: "/", 
        permanent: false,
      },
    };
  }
export default function InicioProducto() {



    return (

        <div>
        <Navbar/>
        <InicioProduc/>
        <Footer/>
        </div>

    )


}