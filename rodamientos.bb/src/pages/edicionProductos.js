import { useState, useEffect, useRef } from 'react';

import { db, auth } from '../firebase';
import 'firebase/database';
import { ref, get, child, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2'
import Navbar from '@/components/Navbarbautista';

export default function EdicionProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');


  const nuevoPrecioRef = useRef('');

  const actualizarItems = (codigo, marca) => {
    const dbRef2 = ref(db, `/rulemanes/ ${codigo}/${marca}`);
    const nuevosValores = {
      precio: `${nuevoPrecioRef.current}`,
    };
  
    // Verificar si el producto existe antes de realizar la actualización

    get(dbRef2)
      .then((snapshot) => {
        if (snapshot.exists()) {
          if(nuevoPrecioRef.current !== '') {
            
            update(dbRef2, nuevosValores)
              .then(() => {
                Swal.fire({
                  title: 'Actualizado',
                  icon:'success',
                  timer: 1000, // 3 segundos
                  timerProgressBar: true,
                  showConfirmButton: false
                })
                nuevoPrecioRef.current = ''
              })
              .catch((error) => {
                console.error('Error al actualizar los valores:', error);
              });
          } else {
            Swal.fire({
              icon: 'error',
              title:'Ingrese un numero',
            })
          }
          }
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error);
      });
  };

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
            console.log(snapshot.val().rol);
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
    nuevoPrecioRef.current = event.target.value;
  };

  return (
    <div>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
        {rol === 'admin' ? 
        
        <div> 
            <div className="barra-busqueda-edicion">
          <span>Buscar producto por código:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="CÓDIGO"
          />
        </div>
        <div className="tabla-edicion">
          {Object.keys(groupedResults).map((codigo1, index) => (
            <div className="edicion-cards" key={index}>
              <div className="textos-edicion">
                <div className="titulo-edicion">{codigo1}</div>

                <div className="contenedor-propiedades">
                  <div className="propiedades-principales-edicion">
                    <span style={{ marginRight: '30px' }}>MARCA</span>
                    <span style={{ marginRight: '70px', marginBottom: '20px' }}>
                      PRECIO
                    </span>
                    <span>STOCK</span>
                  </div>

                  {groupedResults[codigo1].map((producto, marcaIndex) => (
                    <div className="propiedades-edicion" key={marcaIndex}>
                     
                      <div className="marca-edicion"> {producto.marca}</div>
                      <input 
                      
                      onChange={handleChange}
                      placeholder={producto.precio} />

                      <select >
                        <option value="disponible"> Disponible </option>
                        <option value="no-disponible">No Disponible </option>
                      </select>
                    
                  <button style={{marginRight:'5px'}} onClick={()=>{actualizarItems(producto.codigo1,producto.marca,nuevoPrecio)}}> OK </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        
        : ''}
        
      </div>
    </div>
  );
}
