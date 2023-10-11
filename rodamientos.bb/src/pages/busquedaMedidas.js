import { useState, useEffect } from 'react';

import { db,auth } from '../firebase';
import 'firebase/database';
import { ref, get, child,update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'
import Image from 'next/image';
import Swal from 'sweetalert2'

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';


export default function BusquedaAltura() {
  const [searchAltura, setSearchAltura] = useState(null);
  const [searchExterior, setSearchExterior] = useState(null);
  const [searchInterior, setSearchInterior] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]); 
  const [user, setUser] =useState(null)
  const [rol,setRol] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState("");



  const usuarioRef = ref(db, 'usuarios');

 
 


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
          Swal.fire({
            icon: 'error',
            title: 'Debe iniciar sesión para ver los productos',
            
            footer: '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>'
          })
        });

      //   setCatalogData(snapshot.val());
    };

    getCatalogData();
    
  }, []);

  const handleSearch = () => {
   

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(searchAltura,searchInterior,searchExterior);
    const first30 = results.slice(0,50)
    
    setSearchResults(first30);
  };

  const searchProducts = (altura, interior, exterior) => {
    if (!catalogData || (altura === null && interior === null && exterior === null)) {
      return [];
    }
  
    const results = [];
  
    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];
  
      // Busca en cada propiedad del producto
      Object.values(product).forEach((value) => {
        var filtroAltura = value.altura;
        var filtroExterior = value.exterior;
        var filtroInterior = value.interior;
  
        // Filtra los resultados
        if (altura && interior && exterior) {
          if (filtroAltura === altura && filtroExterior === exterior && filtroInterior === interior) {
            results.push(value);
          }
        } else if (altura && interior) {
          if (filtroAltura === altura && filtroInterior === interior) {
            results.push(value);
          }
        } else if (altura && exterior) {
          if (filtroAltura === altura && filtroExterior === exterior) {
            results.push(value);
          }
        } else if (interior && exterior) {
          if (filtroInterior === interior && filtroExterior === exterior) {
            results.push(value);
          }
        } else if (altura) {
          if (filtroAltura === altura) {
            results.push(value);
          }
        } else if (interior) {
          if (filtroInterior === interior) {
            results.push(value);
          }
        } else if (exterior) {
          if (filtroExterior === exterior) {
            results.push(value);
          }
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
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
      
        <div className="barra-busqueda">
          {/* <span>Buscar producto por código:</span> */}
          <Image
            className="icono-busqueda"
            width={30}
            height={30}
            alt=""
            src="/iconoBusqueda.png"
          />

               <input
            className="input-busqueda"
            type="text"
            value={searchInterior}
            onChange={(e) => setSearchInterior(e.target.value)}
            placeholder="INTERIOR"
          />
            <input
            className="input-busqueda"
            type="text"
            value={searchExterior}
            onChange={(e) => setSearchExterior(e.target.value)}
            placeholder="EXTERIOR"
          />
          <input
            className="input-busqueda"
            type="text"
            value={searchAltura}
            onChange={(e) => setSearchAltura(e.target.value)}
            placeholder="ALTURA"
          />
       
        </div>
        <button onClick={()=>{handleSearch()}}> BUSCAR TODO </button>

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
                  <span>
                    Interior: {groupedResults[codigo1][0].interior} mm
                  </span>
                  <span>
                    Exterior: {groupedResults[codigo1][0].exterior} mm
                  </span>
                  <span>Altura: {groupedResults[codigo1][0].altura} mm</span>
                </div>
              </div>
              <div className="contenedor-propiedades">
                <div className="propiedades-principales">
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/tag.png"
                      width={40}
                      height={40}
                    />
                    MARCA
                  </span>
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/iconoPlata.png"
                      width={40}
                      height={40}
                    />{' '}
                    PRECIO
                  </span>
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/stock.png"
                      width={30}
                      height={30}
                    />
                    STOCK
                  </span>
                </div>

                {groupedResults[codigo1].map((producto, marcaIndex) => (
                  <div className="propiedades" key={marcaIndex}>
                    <Image
                      style={{ marginRight: '100px' }}
                      alt=""
                      src={
                        producto.imagen === ''
                          ? '/TEST.jpg'
                          : `/${producto.imagen}.png`
                      }
                      width={100}
                      height={25}
                    />

                    <span className="span-1">${producto.precio}</span>
                    <span
                      className="span-2"
                      style={{
                        fontWeight:'bold',
                        color:
                          producto.stock === 'Disponible'
                            ? 'green'
                            : producto.stock === 'No disponible'
                            ? 'red'
                            : 'rgb(215, 215, 58)',
                      }}>
                       { producto.stock ? (producto.stock).toUpperCase() : ''}
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


}
