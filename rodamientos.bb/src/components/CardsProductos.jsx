import React from 'react'

const CardsProductos = ({uuid,
    modelo,
    codigo1,
    codigo2,
    codigo3,
    interior,
    exterior,
    altura,
    descripcion,
    precio,
    marca,
    stock,
    imagen,}) => {
  return (
    <div className='card-productos'>
        <div className='titulo'> MARCA: <span> {marca}</span>  </div>
        <div className='extras'> Interior: <span> {interior}</span>  </div>
        <div className='extras'> Exterior: <span> {exterior}</span>  </div>
        <div className='extras'> Altura: <span> {altura}</span>  </div>
        <div className='extras'> Descripcion: <span> {descripcion}</span>  </div>
        <div className='extras'> Precio: <span> {precio}</span>  </div>
        <div className='extras'> Stock: <span> {stock}</span>  </div>

    </div>
  )
}

export default CardsProductos