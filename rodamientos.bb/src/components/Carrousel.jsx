import Image from 'next/image'
import React from 'react'

const Carrousel = () => {
  return (
    <div className='logos'>
        <div className='logos-slide'>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/nskLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/skfLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/ntnLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/hchLogo.png'/>          
            <Image  className='img-carrousel' alt='' width={300} height={200} src='/corteco2Logo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/dbhLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/timken2Logo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/inaLogo.png'/>

        </div>
        <div className='logos-slide'>
        <Image className='img-carrousel' alt='' width={300} height={10} src='/nskLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/skfLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/ntnLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/hchLogo.png'/>
            <Image  className='img-carrousel' alt='' width={300} height={200} src='/corteco2Logo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={70} src='/dbhLogo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={200} src='/timken2Logo.png'/>
            <Image className='img-carrousel' alt='' width={300} height={10} src='/inaLogo.png'/>

        </div>

    </div>
  )
}

export default Carrousel