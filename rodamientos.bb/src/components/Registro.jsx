import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    
    const createUser = ( email , password ) => {
        return createUserWithEmailAndPassword(auth,email,password)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try{
            await createUser(email , password)
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
            <button > Sign up </button>
        </form>
    </div>
  )
}

export default SignUp