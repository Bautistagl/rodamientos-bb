
import Banner from "@/components/Bannerbautista"
import Carrousel from "@/components/Carrouselbautista"
import Footer from "@/components/Footerbautista"

import Navbar from "@/components/Navbarbautista"
import Productos from "@/components/Productosbautista"
import ProductosV2 from "@/components/ProductosV2bautista";
import Servicios from "@/components/Serviciosbautista";
import React from "react";

export default function Home() {
  return (
    <div className="contenedor-landing">
      <Navbar />
      <Banner />
      <div className="fondo-index">
        {/* <Servicios /> */}
        <ProductosV2 />
        <Carrousel />
      </div>
      <Footer />
    </div>
  );
}
