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


 const terminarSesion = () => {
  return signOut(auth)
  
}


  // useEffect(()=>{
  //     const usuarioRef = ref(db,'usuarios' + auth.currentUser.uid);
  //     const getRolUsuario = async () => {
  //       await get(usuarioRef)
  //       .then((snapshot) =>{
  //         if(snapshot.exists()) {
  //           console.log(snapshot.val())
  //         } else {
  //           console.log('no hay nada')
  //         }
  //       })
  //       .catch((error)=> {
  //         console.log('Error al leer los productos:', error);
  //       })
  //     }
  // })
  return (
    <nav className='navbar'>
      <Link href='/'>
        <Image style={{marginLeft:'30px'}} alt='' width={200}  height={80} src='/logo2.jpg'/>
      </Link>
        <div className='botones' >
          {user.rol === 'admin' ?<span className='boton'> EDITAR </span> :''}
            <span className='boton'> <Link href='/barraBusqueda'> PRODUCTOS </Link>  </span>
            <span className='boton'> SERVICIOS </span>
            <span className='boton'> INDUSTRIAS </span>
            <span className='boton'> SOPORTE </span>
        </div>
        { auth.currentUser !== null ? <div className='inicio-sesion'>
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