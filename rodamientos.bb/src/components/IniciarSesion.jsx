import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { signInWithEmailAndPassword,onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from '../firebase'
import { useRouter } from 'next/router';

const IniciarSesion = () => {

  const router = useRouter();

  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/barraBusqueda');
    } catch (error) {
      setError(error.message);
      alert('Email o contraseña incorrectas')
    }
  };
  
  const chequearUsuario = () =>{

      return onAuthStateChanged(auth,(user) =>{
              if(user) {
                  console.log(user.email)
              } 
              else{
                  console.log('NO ESTA LOGEADO')
              }
      })

  }

  const terminarSesion = () => {

      return signOut(auth)
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      try{
          await loginUser(email , password)
      } catch (e) {
          setError(e.message)
          console.log(e.message)
      }

  }



  return (
    <div className='contenedor-inicio-completo'>
      <span>.</span>

      <div className="contenedor-inicio">
        <div className="contenedor-flex">
          <Image
            style={{ border: '2px solid black', borderRadius: '5px' }}
            alt=""
            src="/logo2.jpg"
            width={500}
            height={300}
          />
          <form onSubmit={handleSubmit} className="formulario-inicio">
            <h1> Iniciar sesion </h1>
            <input
              onChange={(e)=> setEmail(e.target.value)}
              type="email"
              placeholder="Escriba su email"
              className="input-inicio"
            />
            <input
              onChange={(e)=> setPassword(e.target.value)}
              type="password"
              placeholder="Escriba su contraseña"
              className="input-inicio"
            />
           
            <button type='submit'> Iniciar sesión </button>
       
          </form>
        </div>
        <div className='contenedor-flex'>

      <span className='sinCuenta'> No tiene una cuenta? Solicitela por nuestro Whatsapp!</span>
      <div className='contenedor-flex'>
            <Image style={{marginLeft:'10px',marginTop:'30px',marginRight:'10px'}} alt='' src='/whatsapp.png' width={30} height={30}/>    
            <span style={{cursor:'pointer',textDecoration:'underline'}}> + 54 9 1137660938</span>
         </div>
        </div>
      </div>
      <button onClick={terminarSesion}> Cerrar sesion</button>
    </div>
  );
};

export default IniciarSesion;
