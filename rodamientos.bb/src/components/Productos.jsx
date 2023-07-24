import Image from 'next/image'
import React from 'react'

const Productos = () => {
  return (
    <div className='fondo-productos'>
    <div className='contenedor-general-productos'>
        <div className='titulo-servicios'  >Productos Destacados</div>
        <div className='contenedor-productos'>
            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/kitDistri.jpg' alt='' width={200} height={200} />
                <span> Kit de distribución</span>

            </div>

            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/bombaAgua.jpg' alt='' width={200} height={150} />
                <span> Bombas de agua</span>

            </div>

            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/kitEmbrague.jpg' alt='' width={200} height={200} />
                <span> Kit de embrague</span>

            </div>

            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/retenes.jpg' alt='' width={200} height={200} />
                <span> Retenes</span>

            </div>

            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/correas.jpg' alt='' width={200} height={200} />
                <span> Correas</span>

            </div>

            <div className='producto'>
                <Image className='fotos-productos' style={{backgroundColor:'#0639703a',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} src='/rodamientos2.jpg' alt='' width={200} height={200} />
                <span> Rodamientos</span>

            </div>
        </div>
    </div>
    </div>
  )
}

export default Productos