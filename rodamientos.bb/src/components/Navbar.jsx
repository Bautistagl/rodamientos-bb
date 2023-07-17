import { onAuthStateChanged, signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {auth, db} from '../firebase'
import { child, get, ref } from 'firebase/database'

const Navbar = () => {
 const [logeado,setLogeado] = useState(false)
 const [user, setUser] =useState({})
 const [rol,setRol] = useState('')
 const [admin,setAdmin] = useState('')


 const terminarSesion = () => {
  window.localStorage.setItem('email','')
  return signOut(auth)
}


useEffect(()=>{
setAdmin(window.localStorage.getItem('email'))

}, [])



  return (
    <nav className='navbar'>
      <Link href='/'>
        <Image style={{marginLeft:'10px'}} alt='' width={200}  height={60} src='/logo2.jpg'/>
      </Link>
        <div className='botones' >
          
            <span className='boton'> <Link href='/inicioProductos'> PRODUCTOS </Link>  </span>
            <span className='boton'> SERVICIOS </span>
            {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/edicionProductos'> EDITAR </Link> </span> :''}
            {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/creacionProducto'> NUEVOS PRODUCTOS </Link> </span> :''}
            {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/register'> ALTA USUARIOS </Link> </span> :''}
        </div>
        { admin !== '' ? <div className='inicio-sesion'>
        <img className='icono-sesion' alt='' src='/login1.png'/>
            <Link href='/'>
            <span onClick={terminarSesion}> <Link href='/'> Cerrar Sesion </Link>  </span>
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