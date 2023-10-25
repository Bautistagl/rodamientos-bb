import React, { useState } from 'react'

const PopUp = ({usuario,agregarProducto,producto,setAbierto,abierto,cantidad,setCantidad}) => {
    
  return (
    <div className='popUp'>
        <div className='textos-popUp'>
    
        <h1> Que cantidad de {producto.codigo1} {producto.marca} desea agregar? </h1>
        <input value={cantidad} onChange={(e)=> setCantidad(e.target.value)}  placeholder='Cantidad'/>

        <div style={{display:'flex'}}>
        <button onClick={()=>{agregarProducto(producto,cantidad,usuario,producto.marca,producto.descripcion)}}> Agregar</button>
        <button onClick={()=>{setAbierto(false)}}>Cerrar</button>
        </div>

        </div>

    </div>
  )
}

export default PopUp