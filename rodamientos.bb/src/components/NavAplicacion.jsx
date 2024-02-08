import Link from "next/link"

const NavAplicacion = () => {
    return (
      <div className='navCarrito'>
         
              <span> <Link href='busquedaCodigo2'> Buscar por Codigo </Link></span>
              <span> <Link href='busquedaMedidas2'> Buscar por Medida </Link></span>
             
         
  
      </div>
    )
  }
  
  export default NavAplicacion