import Image from 'next/image'
import React from 'react'

const Servicios = () => {
  return (
    <div className='contenedor-servicios'>
        <div className='titulo-servicios'> Marcas mas populares </div>
        <div className='imagenes-servicios'>
            <Image className='foto-servicios' src='/skfLogo.png' alt='' width={250} height={80}/>
            <Image className='foto-servicios' src='/nskLogo.png' alt='' width={250} height={80}/>
            <Image className='foto-servicios' src='/ntnLogo.png' alt='' width={250} height={80}/>
            <Image className='foto-servicios' src='/hchLogo.png' alt='' width={250} height={80}/>

        </div>


    </div>
  )
}

export default Servicios