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
          console.log('Error al leer los productos:', error);
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
        var filtro = value.codigo1;
        
        if(filtro) {

          if (filtro.includes(term)) {
            // Agrega el producto a los resultados si encuentra coincidencia
  
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

  
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <div>
      <Navbar/>

    <div className="fondo-busqueda">
      <>.</>
      
      

      <div className="barra-busqueda">
        {/* <span>Buscar producto por código:</span> */}
        <Image className='icono-busqueda' width={30} height={30} alt='' src='/iconoBusqueda.png'/>
        <input
          className='input-busqueda'
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
                    src={ producto.imagen === '' ? '/TEST.jpg' :`/${producto.imagen}.png`}
                    width={200}
                    height={20}
                  />
                  
                  <span style={{ marginRight: '110px' }}>${producto.precio}</span>
                  <span style={{ color: producto.stock === 'Disponible' ? 'green' : 'red' }}>
                    {producto.stock}
                  </span> 
                  {/* <input
                  className='input-precio'
                   type="text"
                   placeholder="Nuevo Precio"
                   value={nuevoPrecio}
                   onChange={handleChange}
                  />
                  <button onClick={()=>{actualizarItems(producto.codigo1,producto.marca,nuevoPrecio)}}> Actualizar Precio </button> */}

               
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
