import { useState, useEffect, useRef } from 'react';

import { db, auth } from '../../firebase';
import 'firebase/database';
import { ref, get, child, update, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Navbar from '@/components/Navbarbautista';
import NuevaMarca from '@/components/NuevaMarcabautista';
import ModificarProd from '@/components/ModificarProdbautista';

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
  const [codigoToDelete, setCodigoToDelete] = useState(null);
  const [nuevaMarca,setNuevaMarca] = useState(null)
  const [modificar,setModificar] = useState(null)
  const [modelo,setModelo] = useState('')
  const [ubicacion,setUbicacion] = useState('')
  const [marcaAuto,setMarcaAuto] = useState('')

  const nuevoPrecioRef = useRef('');
  
  

  const handleArticulo = (producto,codigo) => {
        setProductToDelete(producto);
        setCodigoToDelete(codigo);
  }

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
        if (snapshot.exists()) {
          
          remove(dbRef2)
            .then((data) => {
            
              Swal.fire({
                title: 'Borrado',
                icon:'success',
                timer: 1000, // 3 segundos
                timerProgressBar: true,
                showConfirmButton: false
              })
             setProductToDelete(null)
            })
            .catch((error) => {
              alert('Error al actualizar los valores:', error);
            });
        }
        else{
          console.log('no entra en nada')
        }
      })
      .catch((error) => {
        alert('Error al obtener el producto:', error);
      });
  };

  const actualizarItems = async (codigo, marca) => {
    const dbRef2 = ref(db, `/productos/ ${codigo}/marcas/${marca}`);
    
    const nuevosValores = {
      precio:nuevoPrecioRef.current,
      stock: stock,

    };

    const valoresActualizados = {};
  

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
                nuevoPrecioRef.current = '';
                setInterior('');
                setExterior('')
                setAltura('')
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
    const first30 = results.slice(0,50)
    
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
              {Object.keys(searchResults).map((codigo1, index) => (
                <div className="edicion-cards" key={index}>
                  <div className="textos-edicion">
                    <div className="titulo-edicion">{searchResults[codigo1].codigo1}</div>
                    <div  className='botones-tipoEdicion'>

                    <button onClick={()=>{setNuevaMarca(searchResults[codigo1])}}> Agregar nueva marca</button>
                    <button onClick={()=>{setModificar(searchResults[codigo1])}}> Modificar producto principal </button>
                    </div>

                    <div className="contenedor-propiedades2">
                     

                      {searchResults[codigo1].marcas && Object.values(searchResults[codigo1].marcas).map((producto, marcaIndex) => (
                        <div className="propiedades-edicion" key={marcaIndex}>
                          <h2 className="falso-span-edicion3"> {producto.marca}</h2>
                          <div
                           className="falso-span-edicion7">
                           {`${producto.precio} (precio)`}
                          </div>
                         
                         
                          <div
                           className="falso-span-edicion7">
                           {`${producto.stock} (stock)`}
                          </div>


                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].codigo1} (codigo1)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].codigo2} (codigo2)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].codigo3} (codigo3)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].familia} (familia)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].interior} (interior)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].exterior} (exterior)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].altura} (altura)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].descripcion} (descripcion)`}
                          </div>

                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].ubicacion  ? searchResults[codigo1].ubicacion : 'Ubicaciones'} (ubicacion)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].modelo  ? searchResults[codigo1].modelo : 'Modelos Auto'} (modelos autos)`}
                          </div>
                          <div
                           className="falso-span-edicion7">
                           {`${searchResults[codigo1].marcaAuto  ? searchResults[codigo1].marcaAuto : 'Marcas Auto'} (marcas auto)`}
                          </div>
                         
                         
{/*                         
                            <div className='iconos-edicion-container'>

                          <img
                            alt=''
                            src='/refresh.png'
                            className="icono-edicion"
                            style={{ marginRight: '5px' }}
                            onClick={() => {
                              actualizarItems(
                                searchResults[codigo1].codigo1,
                                producto.marca,
                                nuevoPrecio
                              );
                            }}/>
                        
                         
                          <img
                            alt=''
                            src='/borrar.png'
                            className="icono-edicion"
                            style={{ marginRight: '5px' }}
                            onClick={() => handleArticulo(producto,searchResults[codigo1].codigo1)} // Step 3: Set the productToDelete state
                            />
                            </div>
                             */}
                         
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {productToDelete ? (
                            <div className="modal">
                              <div className="textos-modal">
                                Desea borrar el {codigoToDelete} de {productToDelete.marca} ?
                              </div>

                              <div className="contenedor-flex2">
                              <button className="boton-modal" onClick={()=> handleConfirmacion(codigoToDelete, productToDelete.marca)}>
                                  {' '}
                                  Aceptar{' '}
                                </button>
                                <button className="boton-modal2" onClick={() =>{ setProductToDelete(null),setCodigoToDelete(null)}}>
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
        {nuevaMarca ? (<NuevaMarca  producto={nuevaMarca} setNuevaMarca={setNuevaMarca}/> ) : ''}
        {modificar ? (<ModificarProd  producto={modificar} setModificar={setModificar}/> ) : ''}
      </div>
    </div>
  );
}








