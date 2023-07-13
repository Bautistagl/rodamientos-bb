import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const InicioProduc = () => {
  return (
    <div className='fondo-inicioProducto'>
        <>.</>
        {/* <Image className='logo-inicio' width={600} height={300} alt='' src='/logo2.jpg'/> */}
    <div className='botonera'>

    <button><Link href='/busquedaCodigo'> BUSCAR POR CODIGO </Link> </button>
    <button> <Link href='/busquedaAltura'> BUSCAR POR ALTURA </Link></button>
    <button><Link href='/busquedaInterior'> BUSCAR POR INTERIOR </Link></button>
    <button> <Link href='/busquedaExterior'> BUSCAR POR EXTERIOR </Link></button>
    </div>
       
    

    </div>
  )
}

export default InicioProduc