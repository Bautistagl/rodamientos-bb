import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Image style={{marginLeft:'30px'}} alt='' width={100}  height={60} src='/rodamientosbb.png'/>
        <div className='botones' >
            <span className='boton'> PRODUCTOS </span>
            <span className='boton'> SERVICIOS </span>
            <span className='boton'> INDUSTRIAS </span>
            <span className='boton'> SOPORTE </span>
        </div>
        <div className='inicio-sesion'>
        <img className='icono-sesion' alt='' src='/login1.png'/>
            <span>  INICIAR SESION </span>

        </div>


    </nav>
  )
}

export default Navbar