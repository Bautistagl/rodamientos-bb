import CarritosScreen from "@/components/CarritoScreenbautista";
import Navbar from "@/components/Navbarbautista";
export async function getServerSideProps() {
    return {
      redirect: {
        destination: "/", // Puedes redirigir a una página de "Próximamente" o similar
        permanent: false,
      },
    };
  }
export default function Carrito() {


    return (
        <div className="contenedor-landing">
            <Navbar/>
         <CarritosScreen/>


        </div>

    )

}