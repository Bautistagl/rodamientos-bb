import { useState, useEffect } from 'react';

import { db,auth } from '../firebase';
import 'firebase/database';
import { ref, get, child,update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'
import Image from 'next/image';
import Swal from 'sweetalert2'

import Navbar from '@/components/Navbarbautista';


export default function BusquedaCodigo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]); 
  const [user, setUser] =useState(null)
  const [rol,setRol] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState("");



  const usuarioRef = ref(db, 'usuarios');

  const getRolUsuario = async () => {
    // Esperar a que se resuelva la promesa del cambio de estado de autenticación
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // Una vez que se resuelve la promesa, se ejecuta el código restante
        resolve();
        // Desuscribirse del evento para evitar llamadas innecesarias
        unsubscribe();
      });
    });
  
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (userId) {
      const userRef = child(usuarioRef, userId);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
           setRol(snapshot.val().rol);
          } else {
            console.log('No hay nada');
          }
        })
        .catch((error) => {
          console.log('Error al leer los productos:', error);
        });
    } else {
      console.log('No se ha iniciado sesión');
    }
  };
  
 


  useEffect(() => {
    
    // { auth.currentUser === null ?  Swal.fire({
    //   icon: 'error',
    //   title:'Usted no ha iniciado sesion',
    //   text: 'Si aun no tiene cuenta, pida la suya por nuestro Whatsapp!',
    //   confirmButtonText:'<a href="/"  style="color:white"}> Volver </a>',
    //   footer: '<a href="https://wa.me/1137660939">Quiero una cuenta!</a>',
    
    // }) : ''}
    
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
    getRolUsuario();
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
        var filtro  = value.codigo1;
        var filtro2 = value.codigo2
        var filtro3 = value.codigo3
        
        if(filtro ) {

          if (filtro.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            
            results.push(value);
          }
        }
        
        if(filtro2) {

          if (filtro2.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            if(results.includes(value)){
             
            } else{

              results.push(value);
            }
          }
        }

        if(filtro3) {

          if (filtro3.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            if(results.includes(value)){
             
            } else{

              results.push(value);
            }
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

  
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

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
            value={searchTerm}
            onChange={handleSearch}
            placeholder="CÓDIGO"
          />
        </div>

        {Object.keys(groupedResults).map((codigo1,index) => (
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
                {/* <div className="titulo-singular">{codigo2 ? codigo2 :''}</div> */}
                <div className="medidas">
                  <span>
                    INTERIOR: {groupedResults[codigo1][0].interior} mm
                  </span>
                  <span>
                   EXTERIOR: {groupedResults[codigo1][0].exterior} mm
                  </span>
                  <span>ALTURA: {groupedResults[codigo1][0].altura} mm</span>
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

                    <span style={{fontWeight:'bold'}} className="span-1">${producto.precio}</span>
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
