import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='contenedor-footer'>
        <div className='segundo-container'>
            <Image alt='' src='/whatsapp.png' width={30} height={30}/>    
            <span> + 54 9 1145678987</span>
        
        
         </div>

         <div className='segundo-container'>
            <Image alt='' src='/facebook.png' width={30} height={30}/>    
            <span> Rodamientos bb</span>
        
        
         </div>
       <div className='primer-container-footer'> 

       <div>RODAMIENTOS BB 2023 </div> 
       <span> © Copyright</span>
       </div>



    </div>
    
  )
}

export default Footer