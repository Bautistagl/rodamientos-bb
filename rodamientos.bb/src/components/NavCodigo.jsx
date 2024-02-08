import Link from 'next/link'
import React from 'react'

const NavCodigo = () => {
  return (
    <div className='navCarrito'>
       
       <span> <Link href='busquedaMedidas2'> Buscar por Medida </Link></span>
              <span> <Link href='busquedaAplicacion'> Buscar por Aplicacion </Link></span>
           
       

    </div>
  )
}

export default NavCodigo