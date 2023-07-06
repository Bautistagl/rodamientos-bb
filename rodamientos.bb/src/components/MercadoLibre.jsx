import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MercadoLibre = () => {
  return (
    <div className='contenedor-mercado'>
       <div className='titulo-servicios'> Somos MercadoLíder Platinum! </div> 
       <div className='fotos-mercado'>
       <Link href='https://listado.mercadolibre.com.ar/_CustId_229567585?item_id=MLA639557211&category_id=MLA85961&seller_id=229567585&client=recoview-selleritems&recos_listing=true'>
        <Image alt='' src='/mercadoLibre2.webp' width={350} height={250} /> </Link>
        <Link href='https://listado.mercadolibre.com.ar/_CustId_229567585?item_id=MLA639557211&category_id=MLA85961&seller_id=229567585&client=recoview-selleritems&recos_listing=true'>
        <Image className='logo-mercado' alt='' src='/mercadoLogo.png' width={400} height={130} /> 
        </Link>
        <Link href='https://listado.mercadolibre.com.ar/_CustId_229567585?item_id=MLA639557211&category_id=MLA85961&seller_id=229567585&client=recoview-selleritems&recos_listing=true'>
        <Image alt='' src='/mercadoLider.png' width={350} height={250} /> </Link>


       </div>


    </div>
  )
}

export default MercadoLibre