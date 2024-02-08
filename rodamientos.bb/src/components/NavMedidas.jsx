import Link from "next/link"

const NavMedida = () => {
    return (
      <div className='navCarrito'>
         
         <span> <Link href='busquedaCodigo2'> Buscar por Codigo </Link></span>
              <span> <Link href='busquedaAplicacion'> Buscar por Aplicacion </Link></span>
             
         
  
      </div>
    )
  }
  
  export default NavMedida