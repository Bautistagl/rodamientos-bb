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
const usuarioRef = ref(db, 'usuarios');

const getRolUsuario = async () => {
  // Esperar a que se resuelva la promesa del cambio de estado de autenticación
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Una vez que se resuelve la promesa, se ejecuta el código restante
      resolve();
      // Desuscribirse del evento para evitar llamadas innecesarias
      unsubscribe();
    });
  });

  const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (userId) {
    const userRef = child(usuarioRef, userId);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
         setRol(snapshot.val().rol);
        } else {
          console.log('No hay nada');
        }
      })
      .catch((error) => {
        console.log('Error al leer los productos:', error);
      });
  } else {
    console.log('No se ha iniciado sesión');
  }
};

useEffect(()=>{

getRolUsuario()
}, [])



  return (
    <nav className='navbar'>
      <Link href='/'>
        <Image style={{marginLeft:'10px'}} alt='' width={200}  height={60} src='/logo2.jpg'/>
      </Link>
        <div className='botones' >
          
            <span className='boton'> <Link href='/barraBusqueda'> PRODUCTOS </Link>  </span>
            <span className='boton'> SERVICIOS </span>
            <span className='boton'> INDUSTRIAS </span>
            <span className='boton'> SOPORTE </span>
            {rol === 'admin' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/edicionProductos'> EDITAR </Link> </span> :''}
            {rol === 'admin' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/register'> ALTA USUARIOS </Link> </span> :''}
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