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
  const [searchTerm, setSearchTerm] = useState('');
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
        var filtro = value.altura;
        
        
        if (filtro == term) {
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

  
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <div>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
        <div className='botones-busqueda'>

<button className='button-30'  > <Link href='/busquedaCodigo'> BUSCAR POR CODIGO </Link></button>
<button className='button-30'><Link href='/busquedaInterior'> BUSCAR POR INTERIOR </Link></button>
<button className='button-30'> <Link href='/busquedaExterior'> BUSCAR POR EXTERIOR </Link></button>
</div>
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
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ALTURA"
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
