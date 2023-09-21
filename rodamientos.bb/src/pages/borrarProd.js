import React, { useEffect, useState } from 'react'
import {db} from '../firebase'
import {ref,get,child, remove} from 'firebase/database'

export default function Borrar() {
    const productosRef = ref(db,'rulemanes/ VKMA 02152'); 

    const borrarProducto = () =>{
        remove(productosRef)
        .then(
            console.log('producto borrado')
        )
        .catch((error) => {
            console.log('Error al leer los productos:', error);
          });


    }


    return(
        <>
        <button onClick={()=>{borrarProducto()}}> BORRAR PRODUCTO</button>
        </>


    )
}