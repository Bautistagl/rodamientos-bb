import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {auth, db } from '../firebase'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const Navbar = () => {

  const [modal,setModal] = useState(false)
 
  const auth = getAuth();





  const activarModal = () => {
    setModal(!modal)
  }
  const cambiarContrasena = ()=> {
    
    sendPasswordResetEmail(auth, admin)
      .then(() => {
        setModal(false)
        Swal.fire({
          title: 'Email enviado',
          icon: 'success',
          timer: 1000, // 3 segundos
          timerProgressBar: true,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

const [admin, setAdmin] = useState('');
const router = useRouter();
function deleteLocalStorageAfterTime() {

  const item = localStorage.getItem('email');
  if (item) {
    const data = JSON.parse(item);
    if (data && data.timestamp) {
    
      const currentTime = new Date().getTime();
      const itemTime = new Date(data.timestamp).getTime();
      const maxAgeInMillis = 240 * 60 * 1000;

      if (currentTime - itemTime > maxAgeInMillis) {
        localStorage.removeItem('email');
        signOut(auth);
        router.push('/')

      }
    }
  }
}


const terminarSesion = () => {
  window.localStorage.setItem('email', '');
  return signOut(auth);
};



useEffect(() => {
  
  if ( window.localStorage.getItem('email')) {
    const adminData = JSON.parse(window.localStorage.getItem('email'))
    if(adminData) {
  
      setAdmin(adminData.email);
    }
  }
  
  deleteLocalStorageAfterTime()
 
}, []);

const handleSignOut = () => {
  terminarSesion();
  localStorage.removeItem('email');
  router.push('/')
  
};



  return (
    <nav className='navbar'>
      <Link href='/'>
        <Image style={{marginLeft:'10px'}} alt='' width={250}  height={80} src='/logoSuplente.jpg'/>
      </Link>
      {modal ? 
         <div className='modal-overlay'> 
         <div className='modal-verdadero'>
           <span> Se le va a enviar un email para cambiar la contraseña a {admin} </span>
           <div className='flex'> 
   
           <button onClick={() => cambiarContrasena()}> Aceptar </button>
           <button onClick={() => setModal(false)}> Cancelar</button>
           </div>
   
         </div>
   
         </div>
    : ''}

       
          
          <div className='botones' >
          
          <span className='boton'> <Link href='/segundaVersion/busquedaCodigo2'> PRODUCTOS </Link>  </span> 
          {admin !== '' && admin !== 'rodamientosbb@admin.com'  ? <span onClick={activarModal} className='boton'> CAMBIAR CONTRASEÑA </span> : ''  }
          
          
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/segundaVersion/edicionProducto2'> EDITAR </Link> </span> :''}
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/segundaVersion/creacionProducto2'> CREAR </Link> </span> :''}
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/usuarios'> USUARIOS </Link> </span> :''}
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/register'> ALTA USUARIOS </Link> </span> :''}
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/segundaVersion/actualizarCsv2'> CSV </Link> </span> :''}
         
          {/* {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/edicionMasiva'> EDITAR MASIVO </Link> </span> :''} */}
          {/* {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/bajarPlanilla'> PLANILLA </Link> </span> :''} */}
          
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/segundaVersion/carrito2'> CARRITO </Link> </span> :''}
          {admin === 'rodamientosbb@admin.com' ? <span style={{textDecoration:'none'}} className='boton'>  <Link href='/segundaVersion/pedidos2'> PEDIDOS </Link> </span> :''}
      </div> 
       
        
        <div className='inicio-sesion'>
        <img className='icono-sesion' alt='' src='/login1.png' />
        {admin !== '' ? (
          <span onClick={handleSignOut}>
            <Link href='/'>CERRAR SESION</Link>
          </span>
        ) : (
          <Link href='/iniciarSesion'>
            <span className='inicioSesion' > INICIAR SESION </span>
          </Link>
        )}
      </div>
        


    </nav>
  )
}

export default Navbar