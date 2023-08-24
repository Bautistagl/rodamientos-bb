import { useState, useEffect, useRef } from 'react';

import { db, auth } from '../firebase';
import 'firebase/database';
import { ref, get, child, update, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Navbar from '@/components/Navbarbautista';

export default function EdicionProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [codigo1, setCodigo1] = useState('');
  const [codigo2, setCodigo2] = useState('');
  const [codigo3, setCodigo3] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [familia, setFamilia] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [altura, setAltura] = useState('');
  const [exterior, setExterior] = useState('');
  const [interior, setInterior] = useState('');
  const [admin, setAdmin] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  const nuevoPrecioRef = useRef('');

  const handleCodigo2 = (e) => {
    const valor = e.target.value;
    setCodigo2(valor.toUpperCase());
  };
  const handleCodigo3 = (e) => {
    const valor = e.target.value;
    setCodigo3(valor.toUpperCase());
  };
  const handleCodigo1 = (e) => {
    const valor = e.target.value;
    setCodigo1(valor.toUpperCase());
  };

  const handlePrecio = (e) => {
    setPrecio(e.target.value);
  };

  const handleAltura = (e) => {
    setAltura(e.target.value);
  };

  const handleExterior = (e) => {
    setExterior(e.target.value);
  };

  const handleInterior = (e) => {
    setInterior(e.target.value);
  };

  const handleConfirmacion = (codigo, marca) => {
    const dbRef2 = ref(db, `/rulemanes/ ${codigo}/${marca}`);

    get(dbRef2)
      .then((snapshot) => {
        if (snapshot.exists()) {
          remove(dbRef2)
            .then((data) => {
              console.log(data);
              Swal.fire({
                title: 'Borrado',
                icon:'success',
                timer: 1000, // 3 segundos
                timerProgressBar: true,
                showConfirmButton: false
              })
              setProductToDelete(null);
            })
            .catch((error) => {
              alert('Error al actualizar los valores:', error);
            });
        }
      })
      .catch((error) => {
        alert('Error al obtener el producto:', error);
      });
  };

  const actualizarItems = (codigo, marca) => {
    const dbRef2 = ref(db, `/rulemanes/ ${codigo}/${marca}`);
    const nuevosValores = {
      precio: `${nuevoPrecioRef.current}`,
      stock: stock,
      interior: interior,
      exterior: exterior,
      altura: altura,
      familia: familia,
      imagen: imagen,
      codigo1: codigo1,
      codigo2: codigo2,
      codigo3: codigo3,
    };

    const valoresActualizados = {};
  for (const key in nuevosValores) {
    if (nuevosValores[key] !== '' && nuevosValores[key] !== "" ) {
      valoresActualizados[key] = nuevosValores[key];
    }
  }

   // Verificar si el producto existe antes de realizar la actualización

    get(dbRef2)
      .then((snapshot) => {
        if (snapshot.exists()) {
         
            update(dbRef2, valoresActualizados)
              .then(() => {
                Swal.fire({
                  title: 'Actualizado',
                  icon: 'success',
                  timer: 1000, // 3 segundos
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
                nuevoPrecioRef.current = '';
              })
              .catch((error) => {
                console.error('Error al actualizar los valores:', error);
              });
          
        }
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error);
      });
  };

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
          console.log('Error al leer los productos:', error);
        });

      //   setCatalogData(snapshot.val());
    };

    getCatalogData();
    if (window.localStorage.getItem('email')) {
      console.log('entra acaaaa');
      const adminData = JSON.parse(window.localStorage.getItem('email'));
      if (adminData) {
        setAdmin(adminData.email);
      }
    }
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toUpperCase();
    setSearchTerm(term);

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term);
    setSearchResults(results);
  };

  const searchProducts = (term) => {
    if (!catalogData || term === '') {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      // Busca en cada propiedad del producto
      Object.values(product).forEach((value) => {
        var filtro = value.codigo1;
        if (filtro) {
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
  const handleCancelacion = () => {
    setMostrarModal(false);
  };
  const handleModal = () => {
    setMostrarModal(true);
  };

  return (
    <div>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
        {admin === 'rodamientosbb@admin.com' ? (
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
                     

                      {groupedResults[codigo1].map((producto, marcaIndex) => (
                        <div className="propiedades-edicion" key={marcaIndex}>
                          <div className="falso-span-edicion"> {producto.marca}</div>
                          <input
                            className="falso-span-edicion"
                            onChange={handleChange}
                            placeholder={producto.precio}
                          />

                          <select
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}>
                            <option value="" disabled selected>
                              Stock
                            </option>
                            <option value="Disponible">Disponible</option>
                            <option value="No disponible">No disponible</option>
                            <option value="Consultar">Consultar</option>
                          </select>
                          <input
                            className="falso-span-edicion"
                            onChange={handleCodigo1}
                            placeholder={producto.codigo1}
                          />
                          <input
                            className="falso-span-edicion"
                            onChange={handleCodigo2}
                            placeholder={producto.codigo2}
                          />
                          <input
                            className="falso-span-edicion"
                            onChange={handleCodigo3}
                            placeholder={producto.codigo3}
                          />
                          <select
                            value={familia}
                            onChange={(e) => setFamilia(e.target.value)}>
                            <option value="" disabled selected>
                              Familia
                            </option>
                            <option value="Reten">Reten</option>
                            <option value="Rodamientos">Rodamientos</option>
                            <option value="Tensor">Tensor</option>
                            <option value="Conos">Conos y cubetas</option>
                            <option value="Automotor">Automotor</option>
                            <option value="Embrague">Embrague</option>
                            <option value="Grasas">Grasas</option>
                            <option value="Crucetas">Crucetas/ tricelas</option>
                            <option value="Bombas">Bombas de agua</option>
                            <option value="Homocineticas">Homocineticas</option>
                          </select>
                          <input
                            className="falso-span-edicion"
                            onChange={handleInterior}
                            placeholder={producto.interior}
                          />
                          <input
                            className="falso-span-edicion"
                            onChange={handleExterior}
                            placeholder={producto.exterior}
                          />
                          <input
                            className="falso-span-edicion"
                            onChange={handleAltura}
                            placeholder={producto.altura}
                          />

                          <button
                            className="falso-boton-edicion"
                            style={{ marginRight: '5px' }}
                            onClick={() => {
                              actualizarItems(
                                producto.codigo1,
                                producto.marca,
                                nuevoPrecio
                              );
                            }}>
                            OK
                          </button>
                          <button
                            className="falso-boton-edicion"
                            style={{ marginRight: '5px' }}
                            onClick={() => setProductToDelete(producto)} // Step 3: Set the productToDelete state
                            >
                            Borrar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {productToDelete ? (
                            <div className="modal">
                              <div className="textos-modal">
                                Desea borrar el {productToDelete.codigo1} de {productToDelete.marca} ?
                              </div>

                              <div className="contenedor-flex2">
                              <button className="boton-modal" onClick={handleConfirmacion(productToDelete.codigo1, productToDelete.marca)}>
                                  {' '}
                                  Aceptar{' '}
                                </button>
                                <button className="boton-modal2" onClick={() => setProductToDelete(null)}>
                                  {' '}
                                  Cancelar{' '}
                                </button>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}










 // const getRolUsuario = async () => {
  //   // Esperar a que se resuelva la promesa del cambio de estado de autenticación
  //   await new Promise((resolve) => {
  //     const unsubscribe = onAuthStateChanged(auth, (user) => {
  //       // Una vez que se resuelve la promesa, se ejecuta el código restante
  //       resolve();
  //       // Desuscribirse del evento para evitar llamadas innecesarias
  //       unsubscribe();
  //     });
  //   });

  //   const userId = auth.currentUser ? auth.currentUser.uid : null;
  //   if (userId) {
  //     const userRef = child(usuarioRef, userId);
  //     get(userRef)
  //       .then((snapshot) => {
  //         if (snapshot.exists()) {
  //           setRol(snapshot.val().rol);
  //           console.log(snapshot.val().rol);
  //         } else {
  //           console.log('No hay nada');
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('Error al leer los productos:', error);
  //       });
  //   } else {
  //     console.log('No se ha iniciado sesión');
  //   }
  // };