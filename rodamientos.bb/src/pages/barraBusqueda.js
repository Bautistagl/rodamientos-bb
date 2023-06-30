import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import {db} from '../firebase'
import 'firebase/database';
import {ref,get,child} from 'firebase/database'


export default function CatalogPage  ()  {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);

 

 

 

  useEffect(() => {
    const productosRef = ref(db, 'rulemanes'); // Ruta de los productos en la base de datos
    // Obtiene los datos del catálogo desde la base de datos
    const getCatalogData = async () => {

       await get(productosRef)
       .then((snapshot) =>{
        if (snapshot.exists()) {
            const productos = snapshot.val();
            setCatalogData(productos)
        
            
        }
        else {
            console.log('No se encontraron productos en la rama especificada');
          }
       })
       .catch((error) => {
        console.log('Error al leer los productos:', error);
      });

    //   setCatalogData(snapshot.val());
      
    };

    getCatalogData();
  }, []);

 
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    
    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term);
    setSearchResults(results);
  };

  const searchProducts = (term) => {
    if (!catalogData) {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
        const product = catalogData[productId];
        
       
      // Busca en cada propiedad del producto
      Object.values(product).forEach((value) => {
        var filtro = value.codigo1
        
        if (filtro.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia
          
          results.push(value);
        }
      });
    });

    return results;
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar productos" />
     <div className='contenedor-cards'> 

      {searchResults.map((product) => (
            <>
            <div className='card-productos' key={product.uuid}>
            <div className='titulo'> MARCA: {product.marca}</div>
            <div className='titulo'> PRECIO: ${product.precio}</div>
            <div className='extras'> Codigo 1: {product.codigo1}</div>
            <div className='extras'> Medidas: {product.medidas}</div>
            <div className='extras'> Stock: {product.stock}</div>
            </div>
            </>
))}
     </div>
      {/* Muestra los resultados de búsqueda */}
    </div>
  );
};

