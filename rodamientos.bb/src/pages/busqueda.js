import CardsProductos from '@/components/CardsProductosbautista'
import React, { useEffect, useState } from 'react'
import {db} from '../firebase'
import {ref,get,child} from 'firebase/database'

export default function Busqueda()  {
    const [productos, setProductos] = useState([]);
    const [listo, setListo] = useState(false)

    useEffect(() => {
      // Obtener los productos de la base de datos
      
      const productosRef = ref(db, 'rulemanes/ Segundo'); // Ruta de los productos en la base de datos
  
      get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const productosData = snapshot.val();
            // Convertir los datos en un array de productos
            const productosArray = Object.keys(productosData).map((key) => ({
              uuid: key,
              ...productosData[key],
            }));
            setProductos(productosArray);
            setListo(true)
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
        {listo ? `${productos[0].modelo}` : ''}
      <div className='contenedor-cards'>
        {productos.map((producto) => (
          <CardsProductos key={producto.uuid} {...producto} />
        ))}
      </div>
        </>
    );
}
