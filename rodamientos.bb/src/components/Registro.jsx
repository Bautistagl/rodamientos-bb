import React, { useEffect, useState } from 'react'
import {uid} from 'uid'
import { createUserWithEmailAndPassword,getAuth, onAuthStateChanged } from "firebase/auth";
import { auth} from '../firebase';
import {db} from '../firebase'
import "firebase/database";
import { set,ref, onValue,update, child, get } from 'firebase/database'

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('')
    const [cuit, setCuit] = useState('')
    const [error, setError] = useState('')
    
    
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
  
    
    async function createUser ( email , password)  {
       const infoUsuario = await createUserWithEmailAndPassword(auth,email,password,cuit).then((usuarioFirebase)=> {
            const uuid = usuarioFirebase.user.uid
            
            
            set(ref(db,`usuarios/` + `${uuid}`),{
             cuit,
             email,
             rol:'usuario'
            })
            .catch( function(){
         
             console.log('no se puede')
           }) 
        });
       
       
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
       
        try{
            await createUser(email , password,cuit)
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }

    useEffect(()=>{
        getRolUsuario()
        

    },[])

    return (
    <div className='fondo-registro'>
     <>.</>
     {rol === 'admin' ? 
     <> 
        <div className='titulo-registro'> Alta de Usuario </div>
        <form className='form-registro' onSubmit={handleSubmit}> 
            <input onChange={(e)=> setEmail(e.target.value)}  placeholder='Nuevo Email'/>
            <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Contraseña'/>
            <input onChange={(e)=> setCuit(e.target.value)}  placeholder='Cuit del usuario'/>
            <button > Crear Cuenta </button>
        </form>
     </>
     : "" }
    </div>
  )
}

export default SignUp