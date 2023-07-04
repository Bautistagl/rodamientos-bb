import Image from "next/image"
import React from "react"

export default function ProductoSingular()  {


    return (
        <div className="contenedor-singular">
            <Image className="foto-singular" width={220} height={220} src="/rodamiento.webp" alt=""/>
            <div className="textos-singular">
            <div className="titulo-singular"> CODIGO: 6001 2RS</div>
            <div className="medidas">
                <span>Interior: 12mm </span> 
                <span>Exterior: 28mm</span> 
                <span>Altura: 8mm</span> 

            </div>
            <div className="marcas"> 

            <div className="info-marca"> 
            <Image src='/skfLogo.png' alt='' width={250} height={50} />
            <div> PRECIO: <span> $1800 </span></div>
            <div> STOCK: <span style={{color:'green'}}> DISPONIBLE</span></div>
            </div>
            

            <div className="info-marca"> 
            <Image src='/nskLogo.jpg' alt='' width={250} height={50} />
            {/* <Image src='/ntnLogo.png' alt='' width={250} height={50} /> */}
            <div> PRECIO:<span> $1320 </span></div>
            <div> STOCK: <span style={{color:'red'}}> NO DISPONIBLE</span></div>
            </div>

            <div className="info-marca"> 
            <Image  src='/hchLogo.png' alt='' width={250} height={50} />
            <div> PRECIO: <span> $720 </span></div>
            <div> STOCK: <span style={{color:'green'}}> DISPONIBLE</span></div>
            </div>

            <div className="info-marca"> 
            <div> MARCA: <span> Economica</span></div>
            <div style={{}}> PRECIO: <span> $300</span></div>
            <div> STOCK: <span style={{color:'green'}}> DISPONIBLE</span></div>
            </div>
            </div>
            
            </div>

        </div>
    )
}