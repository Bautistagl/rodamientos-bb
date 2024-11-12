import { useState, useEffect, useRef } from 'react';

import { db } from '../../firebase';
import 'firebase/database';
import { ref, get, update, remove } from 'firebase/database';

import Swal from 'sweetalert2';
import Navbar from '@/components/Navbarbautista';
import NuevaMarca from '@/components/NuevaMarcabautista';
import ModificarProd from '@/components/ModificarProdbautista';
import NuevaAplicacion from '@/components/NuevaAplicacionbautista';

export default function EdicionProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');
  const [admin, setAdmin] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [codigoToDelete, setCodigoToDelete] = useState(null);
  const [nuevaMarca, setNuevaMarca] = useState(null);
  const [modificar, setModificar] = useState(null);
  const [aplicacion, setAplicacion] = useState(null);
  

  const nuevoPrecioRef = useRef('');

  const handleArticulo = (producto, codigo) => {
    setProductToDelete(producto);
    setCodigoToDelete(codigo);
  };

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
  const handleDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  const handleUbicacion = (e) => {
    setUbicacion(e.target.value);
  };
  const handleModelo = (e) => {
    setModelo(e.target.value);
  };
  const handleMarcaAuto = (e) => {
    setMarcaAuto(e.target.value);
  };

  const handleExterior = (e) => {
    setExterior(e.target.value);
  };

  const handleInterior = (e) => {
    setInterior(e.target.value);
  };

  const handleConfirmacion = (codigo, marca) => {
    const dbRef2 = ref(db, `/productos/ ${codigo}/marcas/${marca}`);

    get(dbRef2)
      .then((snapshot) => {
        console.log(snapshot)
        if (snapshot.exists()) {
          remove(dbRef2)
            .then((data) => {
              Swal.fire({
                title: 'Borrado',
                icon: 'success',
                timer: 1000, // 3 segundos
                timerProgressBar: true,
                showConfirmButton: false,
              });
              setProductToDelete(null);
            })
            .catch((error) => {
              alert('Error al actualizar los valores:', error);
            });
        } else {
          console.log('no entra en nada');
        }
      })
      .catch((error) => {
        alert('Error al obtener el producto:', error);
      });
  };

  const actualizarItems = async (codigo, marca) => {

    const marcaActualizada = marca === 'economica' ? 'Economica' : marca;

    const dbRef2 = ref(db, `/productos/ ${codigo}/marcas/${marcaActualizada}`);

    const nuevosValores = {};
    if (nuevoPrecio !== '') {
      nuevosValores.precio = nuevoPrecio;
    }
    if (nuevoStock !== '') {
      nuevosValores.stock = nuevoStock;
    }
   
   

    // Verificar si el producto existe antes de realizar la actualización

    await get(dbRef2)
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(dbRef2, nuevosValores)
            .then(() => {
              Swal.fire({
                title: 'Actualizado',
                icon: 'success',
                timer: 1000, // 3 segundos
                timerProgressBar: true,
                showConfirmButton: false,
              });
              setNuevoPrecio('');
              setNuevoStock('');
             
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
    const productosRef = ref(db, 'productos'); // Ruta de los productos en la base de datos
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
    const first30 = results.slice(0, 50);

    setSearchResults(first30);
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

      var filtro = product.codigo1;
      if (filtro) {
        if (filtro.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia

          results.push(product);
        }
      }
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
  const handleDeleteApplication = (codigo1, aplicacionKey) => {
    let codigo = codigo1;
    if (codigo.includes("POL")) {
      codigo = codigo.replace("POL", "Pol");
    } else if (codigo.includes("VIT")) {
      codigo = codigo.replace("VIT", "Vit");
    }
    const dbRef = ref(db, `/productos/ ${codigo}/aplicaciones/${aplicacionKey}`);
    remove(dbRef)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Aplicacion eliminada',
          showConfirmButton: false,
          timer: 1000,
        })
       
        console.log("Aplicación eliminada con éxito");
      })
      .catch((error) => {
        console.error("Error al eliminar la aplicación:", error);
      });
  };

  return (
    <div>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
        {admin === "rodamientosbb@admin.com" ? (
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
              {Object.keys(searchResults).map((codigo1, index) => (
                <div className="edicion-cards" key={index}>
                  <div className="textos-edicion">
                    <div className="titulo-edicion">
                      {searchResults[codigo1].codigo1}
                    </div>
                    <div className="subtitulo-edicion">
                      {searchResults[codigo1].codigo2}
                    </div>
                    <div className="subtitulo-edicion">
                      {searchResults[codigo1].codigo3}
                    </div>
                    <div className="subtitulo-edicion">
                      Interior:{searchResults[codigo1].interior}
                    </div>
                    <div className="subtitulo-edicion">
                      Exterior:{searchResults[codigo1].exterior}
                    </div>
                    <div className="subtitulo-edicion">
                      Altura:{searchResults[codigo1].altura}
                    </div>
                    <div className="aplicaciones-grid">
                      {searchResults[codigo1].aplicaciones &&
                        Object.keys(searchResults[codigo1].aplicaciones).map(
                          (appKey, appIndex) => (
                            <div key={appIndex}>
                              <ul>
                                {/* Asegúrate de que las propiedades de la aplicación estén presentes */}
                                {searchResults[codigo1].aplicaciones[appKey]
                                  .marcasAuto && (
                                  <li
                                    style={{
                                      display: "flex",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Marca Autos:{" "}
                                    <p>
                                      {" "}
                                      {
                                        searchResults[codigo1].aplicaciones[
                                          appKey
                                        ].marcasAuto
                                      }{" "}
                                    </p>
                                  </li>
                                )}
                                {searchResults[codigo1].aplicaciones[appKey]
                                  .ubicaciones && (
                                  <li
                                    style={{
                                      display: "flex",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Ubicaciones:{" "}
                                    <p>
                                      {searchResults[codigo1].aplicaciones[
                                        appKey
                                      ].ubicaciones.join(", ")}{" "}
                                    </p>{" "}
                                  </li>
                                )}
                                {searchResults[codigo1].aplicaciones[appKey]
                                  .modelosAuto && (
                                  <li
                                    style={{
                                      display: "flex",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Modelos Autos:{" "}
                                    <p>
                                      {" "}
                                      {searchResults[codigo1].aplicaciones[
                                        appKey
                                      ].modelosAuto.join(", ")}{" "}
                                    </p>
                                  </li>
                                )}
                                {searchResults[codigo1].aplicaciones[appKey]
                                  .motores && (
                                  <li
                                    style={{
                                      display: "flex",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Motores:{" "}
                                    <p>
                                      {" "}
                                      {searchResults[codigo1].aplicaciones[
                                        appKey
                                      ].motores.join(", ")}{" "}
                                    </p>
                                  </li>
                                )}
                              </ul>
                              <button
                                className="buscar2"
                                onClick={() =>
                                  handleDeleteApplication(
                                    searchResults[codigo1].codigo1,
                                    appKey
                                  )
                                }
                              >
                                Eliminar Aplicación
                              </button>
                            </div>
                          )
                        )}
                    </div>

                    <div className="botones-tipoEdicion">
                      <button
                        onClick={() => {
                          setNuevaMarca(searchResults[codigo1]);
                        }}
                      >
                        {" "}
                        Agregar nueva marca
                      </button>
                      <button
                        onClick={() => {
                          setModificar(searchResults[codigo1]);
                        }}
                      >
                        {" "}
                        Modificar producto principal{" "}
                      </button>
                      <button
                        onClick={() => {
                          setAplicacion(searchResults[codigo1]);
                        }}
                      >
                        {" "}
                        Agregar Aplicacion{" "}
                      </button>
                    </div>

                    <div className="contenedor-propiedades2">
                      {searchResults[codigo1].marcas &&
                        Object.values(searchResults[codigo1].marcas).map(
                          (producto, marcaIndex) => (
                            <div
                              className="propiedades-edicion"
                              key={marcaIndex}
                            >
                              <h2 className="falso-span-edicion3">
                                {" "}
                                {producto.marca}
                              </h2>
                              <input
                                className="falso-span-edicion7"
                                placeholder={`${producto.precio}`}
                                onChange={(e) => setNuevoPrecio(e.target.value)}
                              />

                              <select
                                onChange={(e) => setNuevoStock(e.target.value)}
                              >
                                <option value="" disabled selected>
                                  Seleccionar ({producto.stock})
                                </option>
                                <option value="disponible">Disponible</option>
                                <option value="no disponible">
                                  No disponible
                                </option>
                                <option value="consultar">Consultar</option>
                              </select>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <img
                                  alt=""
                                  src="/refresh.png"
                                  className="icono-edicion"
                                  style={{ marginRight: "5px" }}
                                  onClick={() => {
                                    actualizarItems(
                                      searchResults[codigo1].codigo1,
                                      producto.marca,
                                      nuevoPrecio,
                                      nuevoStock
                                    );
                                  }}
                                />
                                <img
                                  alt=""
                                  src="/borrar.png"
                                  className="icono-edicion"
                                  style={{ marginRight: "5px" }}
                                  onClick={() => {
                                    handleArticulo(
                                      producto,
                                      searchResults[codigo1].codigo1
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              ))}
              {productToDelete ? (
                <div className="modal">
                  <div className="textos-modal">
                    Desea borrar {productToDelete.marca} de {codigoToDelete}?
                  </div>

                  <div className="contenedor-flex2">
                    <button
                      className="boton-modal"
                      onClick={() =>
                        handleConfirmacion(
                          codigoToDelete,
                          productToDelete.marca
                        )
                      }
                    >
                      {" "}
                      Aceptar{" "}
                    </button>
                    <button
                      className="boton-modal2"
                      onClick={() => {
                        setProductToDelete(null), setCodigoToDelete(null);
                      }}
                    >
                      {" "}
                      Cancelar{" "}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {nuevaMarca ? (
          <NuevaMarca producto={nuevaMarca} setNuevaMarca={setNuevaMarca} />
        ) : (
          ""
        )}
        {modificar ? (
          <ModificarProd producto={modificar} setModificar={setModificar} />
        ) : (
          ""
        )}
        {aplicacion ? (
          <NuevaAplicacion
            producto={aplicacion}
            setAplicacion={setAplicacion}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}


