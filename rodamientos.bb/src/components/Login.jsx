import React, { useState } from 'react'
import { signInWithEmailAndPassword,onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from '../firebase'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const loginUser = ( email , password ) => {
       
       return signInWithEmailAndPassword(auth, email, password)
       
        
    }
    
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
    <div>
    <form onSubmit={handleSubmit}> 
        <input onChange={(e)=> setEmail(e.target.value)} type='email' placeholder='Escriba su email'/>
        <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Escriba su contraseña'/>
        <button > Iniciar Sesion </button>
    </form>

    <button onClick={chequearUsuario}> Chequear usuario </button>
    <button onClick={terminarSesion}> Cerrar sesion </button>
</div>
  )
}

export default Login