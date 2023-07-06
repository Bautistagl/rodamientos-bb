import { onAuthStateChanged, signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {auth} from '../firebase'

const Navbar = () => {
 const [logeado,setLogeado] = useState(false)


 const terminarSesion = () => {

  return signOut(auth)
}
  useEffect(()=>{


    return onAuthStateChanged(auth,(user) =>{
      if(user) {
          setLogeado(true)
      } 
      else{
          setLogeado(false)
      }
})

  })
  return (
    <nav className='navbar'>
      <Link href='/'>
        <Image style={{marginLeft:'30px'}} alt='' width={200}  height={80} src='/logo2.jpg'/>
      </Link>
        <div className='botones' >
            <span className='boton'> PRODUCTOS </span>
            <span className='boton'> SERVICIOS </span>
            <span className='boton'> INDUSTRIAS </span>
            <span className='boton'> SOPORTE </span>
        </div>
        { logeado ? <div className='inicio-sesion'>
        <img className='icono-sesion' alt='' src='/login1.png'/>
            <Link href='/'>
            <span onClick={terminarSesion}>  Cerrar Sesion </span>
            </Link>

        </div> : <div className='inicio-sesion'>
        <img className='icono-sesion' alt='' src='/login1.png'/>
            <Link href='/iniciarSesion'>
            <span> Iniciar Sesion </span>
            </Link>

        </div>}
        


    </nav>
  )
}

export default Navbar