import CardsProductos from '@/components/CardsProductosbautista'
import React, { useEffect, useState } from 'react'
import {db} from '../firebase'
import {ref,get,child, remove} from 'firebase/database'

export default function Busqueda()  {
  const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
     
      
      const productosRef = ref(db,'rulemanes'); 
  
      get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
        
            const productos = snapshot.val();
            const resultados = [];
            for (const codigo1 in productos) {
               
              const producto = productos[codigo1];
              const eco = producto.Economica
              const skf = producto.SKF
              const debe = producto.DBH
            

              if(skf){

                if(skf.codigo1 === 'BAF-0013 AD VK210'){
                 console.log(codigo1)
                }
              }
              if(debe){

                if(debe.codigo1 === 'BAF-0013 AD VK210'){
                 console.log(debe)
                }
              }
            }
            // console.log(resultados)
           
            setSearchResults(resultados);
           
          } else {
            console.log('No se encontraron productos en la rama especificada');
          }
        })
        .catch((error) => {
          console.log('Error al leer los productos:', error);
        });
    }, []);
  
    return (
        <>
        
      <div className='contenedor-cards'>
       
      </div>
        </>
    );
}
