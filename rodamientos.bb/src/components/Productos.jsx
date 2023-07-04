import Image from 'next/image'
import React from 'react'

const Productos = () => {
  return (
    <div className='fondo-productos'>
    <div className='contenedor-general-productos'>
        <div className='titulo-servicios'  >Productos Destacados</div>
        <div className='contenedor-productos'>
            <div className='producto'>
                <Image style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/fotoProducto.png' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>

            <div className='producto'>
                <Image style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/fotoProducto2.avif' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>

            <div className='producto'>
                <Image style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/fotoProducto4.png' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>

            <div className='producto'>
                <Image style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/fotoProducto6.png' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>

            <div className='producto'>
                <Image style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/fotoProducto7.png' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>
        </div>
    </div>
    </div>
  )
}

export default Productos