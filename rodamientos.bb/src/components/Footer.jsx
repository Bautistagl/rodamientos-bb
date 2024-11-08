import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="contenedor-footer">
      <div className="segundo-container">
        <Image alt="" src="/whatsapp.png" width={30} height={30} />
        <span>
          {" "}
          <Link href="https://wa.me/1137660939"> + 54 9 1137660939 </Link>
        </span>
      </div>

      <div className="segundo-container">
        <Image alt="" src="/facebook.png" width={30} height={30} />
        <span> Rodamientos bb</span>
      </div>
      <div className="primer-container-footer">
        <div>RODAMIENTOS BB 2024 </div>
        <span> © Copyright</span>
      </div>
    </div>
  );
}

export default Footer