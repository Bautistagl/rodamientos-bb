import React, { useState } from 'react'
import {uid} from 'uid'
import { createUserWithEmailAndPassword,getAuth } from "firebase/auth";
import { auth} from '../firebase';
import {db} from '../firebase'
import "firebase/database";
import { set,ref, onValue,update } from 'firebase/database'

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('')
    const [cuit, setCuit] = useState('')
    const [error, setError] = useState('')
    
    
    async function createUser ( email , password,rol)  {
       const infoUsuario = await createUserWithEmailAndPassword(auth,email,password,cuit).then((usuarioFirebase)=> {
            const uuid = usuarioFirebase.user.uid
            
            
            set(ref(db,`usuarios/` + `${uuid}`),{
             cuit,
             email,
             rol
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
            await createUser(email , password,rol,cuit)
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }

    }
    return (
    <div>
        <form onSubmit={handleSubmit}> 
            <input onChange={(e)=> setEmail(e.target.value)}  placeholder='Escriba su email'/>
            <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Escriba su contraseña'/>
            <input onChange={(e)=> setRol(e.target.value)}  placeholder='Rol del usuario'/>
            <input onChange={(e)=> setCuit(e.target.value)}  placeholder='Cuit del usuario'/>
            <button > Sign up </button>
        </form>
    </div>
  )
}

export default SignUp