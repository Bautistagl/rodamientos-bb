
import Banner from "@/components/Bannerbautista"
import Carrousel from "@/components/Carrouselbautista"
import Footer from "@/components/Footerbautista"
import MercadoLibre from "@/components/MercadoLibrebautista"
import Navbar from "@/components/Navbarbautista"
import Productos from "@/components/Productosbautista"
import Servicios from "@/components/Serviciosbautista"
import React from "react"

export default function Home() {


    return (
        <div className="contenedor-landing">
            <Navbar/>
            <Banner/>
            <div className="fondo-index"> 
            <Servicios/>
            <Carrousel/>
            <Productos/>
            <MercadoLibre/>
            </div>
            <Footer/>
        </div>

    )

}