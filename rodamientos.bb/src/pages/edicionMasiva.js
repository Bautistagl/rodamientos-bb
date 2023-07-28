import { useState, useEffect, useRef } from 'react';

import { db, auth } from '../firebase';
import 'firebase/database';
import { ref, get, child, update, set } from 'firebase/database';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Modal from '@/components/Modalbautista';
import Navbar from '@/components/Navbarbautista';

export default function EdicionMasiva() {
  const [searchTerm, setSearchTerm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [porcentaje, setPorcentaje] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false)
  const nuevoPrecioRef = useRef('');
  const [searchFamily, setSearchFamily] = useState(false);


  const usuarioRef = ref(db, 'usuarios');

  const handleConfirmacion = async () => {
    
    const updatedResults = searchResults.map((product) => {
      // Calculate the new price (you can modify this logic as per your requirement)

      const newPrice = parseFloat(product.precio) * porcentaje;

      const nuevosValores = {
        precio: newPrice.toFixed(0),
      };
      const productosRef = ref(
        db,
        `/rulemanes/ ${product.codigo1}/${product.marca}`
      );

      get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (product.codigo1 !== '' &&  porcentaje > 0) {
              update(productosRef, nuevosValores)
                .then(() => {
                  Swal.fire({
                    title: 'Actualizado',
                    icon: 'success',
                    timer: 1000, // 3 segundos
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                  window.location.reload()
                })
                .catch((error) => {
                  console.error('Error al actualizar los valores:', error);
                });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ingrese un numero valido',
              });
            }
          }
        })
        .catch((error) => {
          console.error('Error al obtener el producto:', error);
        });
    });
  };
  const handleCancelacion = () =>{
    setMostrarModal(false)
  };
  const handleModal = () => {
    setMostrarModal(true)
  }

  const handlePorcentaje = (event) => {
    const porciento = event.target.value;
    setPorcentaje(porciento / 100 + 1);
  };

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

            footer:
              '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>',
          });
        });

      //   setCatalogData(snapshot.val());
    };

    getCatalogData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setPorcentaje(0)

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term,searchFamily);
    setSearchResults(results);
  };
  const handleFamilySearch = (event) => {
    const family = event.target.value;
    setSearchFamily(family);
    setPorcentaje(0);
  
    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(searchTerm, family); // Update: pass the searchTerm as well
    setSearchResults(results);
  };

  const searchProducts = (term,family) => {
    if (!catalogData) {
      return [];
    }

    const results = [];
    // const productsArray = Object.values(catalogData);
    // const results = productsArray.filter((product) => {
    //   // Check if both filters are selected
    //   if (term !== '' && family !== '') {
    //     console.log(product)
    //     return product.marca === term && product.familia === family;
    //   }
  
    //   // Check if only the 'marca' filter is selected
    //   if (term !== '' && family==='') {
    //     console.log(product)
    //     return product.marca === term;
    //   }
  
    //   // Check if only the 'familia' filter is selected
    //   if (family !=='' && term === '') {
    //     console.log(product)
    //     return product.familia === family;
    //   }
  
    //   // If no filters are selected, return all products
    //   return false;
    // });
  
    // return results;
  

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      // Busca en cada propiedad del producto
      
      Object.values(product).forEach((value) => {
        var filtro = value.marca;
        var filtro2 = value.familia
        if(term !== '' && family !== '') {
            if (term === filtro && family === filtro2 ) {
              // Agrega el producto a los resultados si encuentra coincidencia
              results.push(value);
            }}
         if (term !== '' && family === '') {
          if (filtro === term ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            results.push(value);
          }
        } 
        if(term === '' && family !== '') {
          if( filtro2 === family){
            results.push(value)
          }
        }   
        if(term === '' && family === '') {
          results.push()
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
    <>
    <Navbar/>
    {mostrarModal ? <div className='modal'>
        <div className='textos-modal'>  
          Desea aumentar el precio de los productos ?
        </div>

        <div className='contenedor-flex2'>
        <button className='boton-modal' onClick={  handleConfirmacion}> Aceptar </button>
        <button className='boton-modal2'onClick={  handleCancelacion}> Cancelar </button>
        </div>
    </div> : '' }
     
      <div className='contenedor-flex'> 
      <div className='select-masivo'>
        <select className='letras-masivo' value={searchTerm} onChange={handleSearch}>
          <option value=""  defaultValue>
            MARCA
          </option>
          <option value="Economica">Economica</option>
          <option value="HCH">HCH</option>
          <option value="NSK-NTN">NSK-NTN</option>
          <option value="SKF">SKF</option>
          <option value="INA">INA</option>
          <option value="DOLZ">DOLZ</option>
          <option value="DAYCO">DAYCO</option>
          <option value="DBH">DBH</option>
          <option value="CORTECO">CORTECO</option>
          <option value="TIMKEN">TIMKEN</option>
        </select>
      </div>
      <div className='select-masivo'>
        <select className='letras-masivo' value={searchFamily} onChange={handleFamilySearch}>
          <option value=""  defaultValue>
            FAMILIA
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
      </div>

      <input className='input-masivo' type="text" onChange={handlePorcentaje} placeholder="Porcentaje" />
      <button className='boton-masivo' onClick={handleModal}> Actualizar productos</button>
      </div>
      <div className="fondo-busqueda2">
        <>.</>
            <div className='propiedades-masivo'> 
                <h2> CODIGO</h2>
                <h2> PRECIO</h2>
                <h2> MARCA </h2>
            </div>
        {Object.keys(groupedResults).map((codigo1, index) => (
          <div className="contenedor-cards-edicion" key={index}>
            <div className="textos-completo">

                <div style={{ fontWeight: 'bold' }} className="titulo-singular-masivo">{codigo1}</div>
              
                {groupedResults[codigo1].map((producto, marcaIndex) => (
                  <div className='contenedor-flex'  key={marcaIndex}>
                    <input  className="precio-masiva"
                            onChange={handleChange}
                            placeholder={producto.precio}
                          />
                    <Image
                      style={{marginRight:'100px'}}
                      alt=""
                      src={
                        producto.imagen === ''
                          ? '/importado5.png'
                          : `/${producto.imagen}.png`
                      }
                      width={150}
                      height={30}
                    />
                      <button
                            style={{ marginRight: '5px', height:'45px' }}
                            onClick={() => {
                              actualizarItems(
                                producto.codigo1,
                                producto.marca,
                                nuevoPrecio
                              );
                            }}>
                            {' '}
                            ACTUALIZAR PRECIO{' '}
                          </button>

                  </div>
                ))}
              </div>
            </div>
         
        ))}
      </div>
    </>
  );
}
