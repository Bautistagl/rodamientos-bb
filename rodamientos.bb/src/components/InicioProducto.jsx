import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const InicioProduc = () => {
  return (
    <div className='fondo-inicioProducto'>
        <>.</>
        {/* <Image className='logo-inicio' width={600} height={300} alt='' src='/logo2.jpg'/> */}
    <div className='botonera'>

    <button className='button-30' ><Link href='/busquedaCodigo'> BUSCAR POR CODIGO </Link> </button>
    <button className='button-30'  > <Link href='/busquedaAltura'> BUSCAR POR ALTURA </Link></button>
    <button className='button-30'><Link href='/busquedaInterior'> BUSCAR POR INTERIOR </Link></button>
    <button className='button-30'> <Link href='/busquedaExterior'> BUSCAR POR EXTERIOR </Link></button>
    </div>
       
    

    </div>
  )
}

export default InicioProduc