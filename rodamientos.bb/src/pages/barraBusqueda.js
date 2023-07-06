import { useState, useEffect } from 'react';

import { db } from '../firebase';
import 'firebase/database';
import { ref, get } from 'firebase/database';
import Image from 'next/image';

import Navbar from '@/components/Navbarbautista';


export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [logeado, setLogeado] = useState(false)

  useEffect(() => {

    
    
    const productosRef = ref(db, 'rulemanes'); // Ruta de los productos en la base de datos
    // Obtiene los datos del catálogo desde la base de datos
    const getCatalogData = async () => {
      await get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const productos = snapshot.val();
            setCatalogData(productos);
          } else {
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
    const term = event.target.value.toUpperCase();
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
        var filtro = value.codigo1;

        if (filtro.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia

          results.push(value);
        }
      });
    });

    return results;
  };


  function groupByCodigo1(searchResults) {
    return searchResults.reduce((result, obj) => {
      const codigo1 = obj.codigo1;
      if (!result[codigo1]) {
        result[codigo1] = [obj];
      } else {
        result[codigo1].push(obj);
      }
      return result;
    }, {});
  }

  const groupedResults = groupByCodigo1(searchResults);

  return (
    <div>
      <Navbar/>

    <div className="fondo-busqueda">
      <>.</>
      <div className="barra-busqueda">
        <span>Buscar producto por código:</span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="CÓDIGO"
        />
      </div>

      {Object.keys(groupedResults).map((codigo1, index) => (
        <div className="contenedor-cards" key={index}>
          <Image
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: '20px',
            }}
            alt=""
            src="/rodamiento.webp"
            width={200}
            height={200}
          />
          <div className="textos-completo">
            <div className="codigo-medidas">
              <div className="titulo-singular">{codigo1}</div>
              <div className="medidas">
                <span>Interior: {groupedResults[codigo1][0].medidas.interior} 10 mm</span>
                <span>Exterior: {groupedResults[codigo1][0].medidas.exterior}10 mm</span>
                <span>Altura: {groupedResults[codigo1][0].medidas.altura}10 mm</span>
              </div>
            </div>
            <div className="contenedor-propiedades">
              <div className="propiedades-principales">
                <span>MARCA</span>
                <span>PRECIO</span>
                <span>STOCK</span>
              </div>

              {groupedResults[codigo1].map((producto, marcaIndex) => (
                <div className="propiedades" key={marcaIndex}>
                  <Image
                    style={{ marginRight: '40px' }}
                    alt=""
                    src={`/${producto.imagen}.png`}
                    width={200}
                    height={30}
                  />
                  <span style={{ marginRight: '110px' }}>${producto.precio}</span>
                  <span style={{ color: producto.stock === 'Disponible' ? 'green' : 'red' }}>
                    {producto.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    
    </div>
    
    </div>
  );

  // return (
  //   <div className="fondo-busqueda">
  //     <div>.</div>
  //     <div className="barra-busqueda">
  //       <span> Buscar producto por codigo:</span>
  //       <input
  //         type="text"
  //         value={searchTerm}
  //         onChange={handleSearch}
  //         placeholder="CÓDIGO"
  //       />
  //     </div>
  //       <>
  //           {searchResults.length == 4 ? (
  //             <>
              
  //               <div className="contenedor-cards">
  //                 <Image
  //                   style={{
  //                     marginTop: 'auto',
  //                     marginBottom: 'auto',
  //                     marginLeft: '20px',
  //                   }}
  //                   alt=""
  //                   src="/rodamiento.webp"
  //                   width={200}
  //                   height={200}
  //                 />
  //                 <div className="textos-completo">
  //                   <div className="codigo-medidas">
  //                     <div className="titulo-singular"> {searchResults[0].codigo1} </div>
  //                     <div className="medidas">
  //                       <span>Interior: 12mm </span>
  //                       <span>Exterior: 28mm</span>
  //                       <span>Altura: 8mm</span>
  //                     </div>
  //                   </div>
  //                   <div className="contenedor-propiedades">
  //                     <div className="propiedades-principales">
  //                       <span> MARCA </span>
  //                       <span> PRECIO </span>
  //                       <span> STOCK </span>
  //                     </div>

  //                     <div className="propiedades">
  //                       <Image
  //                         style={{ marginRight: '40px' }}
  //                         alt=""
  //                         src="/hchLogo.png"
  //                         width={200}
  //                         height={30}
  //                       />
  //                       <span style={{ marginRight: '110px' }}> ${searchResults[1].precio} </span>
  //                       <span style={{ color: 'green' }}> {searchResults[1].stock} </span>
  //                     </div>

  //                     <div className="propiedades">
  //                       <Image
  //                         style={{ marginRight: '40px' }}
  //                         alt=""
  //                         src="/nskLogo.jpg"
  //                         width={200}
  //                         height={30}
  //                       />
  //                       <span style={{ marginRight: '110px' }}>${searchResults[2].precio}</span>
  //                       <span style={{ color: 'green' }}> {searchResults[2].stock} </span>
  //                     </div>

  //                     <div className="propiedades">
  //                       <Image
  //                         style={{ marginRight: '40px' }}
  //                         alt=""
  //                         src="/skfLogo.png"
  //                         width={200}
  //                         height={30}
  //                       />
  //                       <span style={{ marginRight: '110px' }}> ${searchResults[3].precio} </span>
  //                       <span style={{ color: 'red' }}> {searchResults[3].stock} </span>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </>
  //           ) : (
  //             ''
  //           )}
    
  //       </>
    
  //     {/* Muestra los resultados de búsqueda */}
  //   </div>
  // );
}
