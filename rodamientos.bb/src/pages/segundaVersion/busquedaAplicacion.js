import { useState, useEffect } from 'react';

import { db } from '../../firebase';
import 'firebase/database';
import { ref, get, update } from 'firebase/database';

import Image from 'next/image';
import Swal from 'sweetalert2';

import Navbar from '@/components/Navbarbautista';
import PopUp from '@/components/PopUpbautista';
import NavAplicacion from '@/components/NavAplicacionbautista';

export default function BusquedaAplicacion() {
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [cantidad, setCantidad] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [admin, setAdmin] = useState('');

  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [modelosDisponibles, setModelosDisponibles] = useState([]);

  const carritoRef = ref(db, 'usuarios/' + `${usuario}` + '/carrito');

  const handleClickAgregar = (producto, marca) => {
    setSelectedMarca(marca);
    setSelectedProduct(producto);
    setAbierto(true);
  };
  const relacionesModelos = {
    Chery: ['TIGGO'],
    Chevrolet: [
      'AGILE',
      'ASTRA',
      'AVEO',
      'BLAZER',
      'CAPTIVA',
      'CELTA',
      'CORSA',
      'COBALT',
      'CRUZE',
      'MERIVA',
      'ONIX',
      'PRISMA',
      'SONIC',
      'SPARK',
      'SPIN',
      'TRACKER',
      'BLAZER',
      'VECTRA',
      'ZAFIRA',
      'S 10',
      'C 10',
    ],
    Chrysler: ['NEON', 'PT CTRUISER'],
    Citroen: ['BERLINGO', 'C3', 'C4', 'C4 CACTUS', 'C4 PICASSO'],
    Fiat: [
      '128',
      '147',
      'ARGO',
      'DUNA',
      'FIORINO',
      'FIORUNO',
      'GRAND SIENA',
      'IDEA',
      'LINEA',
      'MOBY',
      'PALIO',
      'REGATTA',
      'SIENA',
      'SPAZIO',
      'STILO',
      'STRADA',
      'TEMPRA',
      'TIPO',
      'TORO',
      'UNO',
    ],
    Ford: [
      'COURIER',
      'ECOSPORT',
      'ECOSPORT 2',
      'ESCORT',
      'FALCON',
      'FIESTA',
      'FOCUS',
      'GALAXY',
      'KA',
      'KUGA',
      'MONDEO',
      'ORION',
      'SIERRA',
      'TAUNUS',
      'TRANSIT',
      'RANGER',
    ],
    MercedezBenz: ['SPRINTER', 'MB 180'],
    Peugot: [
      '106',
      '2008',
      '205',
      '206',
      '207',
      '208',
      '3008',
      '306',
      '307',
      '308',
      '404',
      '405',
      '5008',
      '505',
      'EXPERT',
      'PARTNER',
    ],
    Renault: [
      'CAPTUR',
      'CLIO',
      'DUSTER',
      'EXPRESS',
      'FLUENCE',
      'FUEGO',
      'KANGOO',
      'KOLEOS',
      'KWID',
      'LAGUNA',
      'LOGAN',
      'MASTER',
      'MEGANE',
      'R11',
      'R 12',
      'R 18',
      'R 19',
      'R 21',
      'R 9',
      'SANDERO',
      'SCENIC',
      'SYMBOL',
      'TWINGO',
    ],
    Suzuki: ['FUN'],
    Toyota: ['COROLA', 'CORONA', 'ETIOS', 'HILUX'],
    Volskwagen: [
      '1500',
      'BORA',
      'CADDY',
      'CARAT',
      'FOX',
      'GACEL',
      'GOL',
      'GOLD TREND',
      'GOLF',
      'NEW BEATLE',
      'NIVUS',
      'PASSAT',
      'POINTER',
      'POLO',
      'POLO CLASSIC',
      'QUANTUM',
      'SANTANA',
      'SAVEIRO',
      'SCIROCCO',
      'SENDA',
      'SHARAN',
      'SURAN',
      'TIGUAN',
      'TOUAREG',
      'TRANSPORTER',
      'UP',
      'VENTO',
      'VIRTUS',
      'VOYAGE',
    ],
  };

  const updateTotalCarrito = async () => {
    try {
      const snapshot = await get(carritoRef);

      if (snapshot.exists()) {
        const carritoData = snapshot.val();
        const productosEnCarrito = Object.values(carritoData);
        let totaCarrito = 0;

        productosEnCarrito.forEach((producto) => {
          totaCarrito += producto.precio * producto.cantidad;
        });

        setTotalCarrito(totaCarrito);
      } else {
        setTotalCarrito(0);
      }
    } catch (error) {
      console.log('Error al leer los productos del carrito:', error);
    }
  };

  // AGREGAR PRODUCTO, RECIBE OBJETO PRODUCTO Y CANTIDAD
  const agregarProducto = async (
    producto,
    cantidades,
    usuario,
    selectedMarca,
    descripcion
  ) => {
    const { codigo1 } = producto;
    const { precio, marca, stock } = selectedMarca;

    try {
      const snapshot = await get(
        ref(
          db,
          'usuarios/' + `${usuario}` + '/carrito2/' + codigo1 + '' + marca
        )
      );

      if (snapshot.exists()) {
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,
          descripcion,
        };

        update(
          ref(
            db,
            'usuarios/' + `${usuario}` + '/carrito2/' + codigo1 + '' + marca
          ),
          productoEnCarrito
        );
      } else {
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,
          descripcion,
        };

        update(
          ref(
            db,
            'usuarios/' + `${usuario}` + '/carrito2/' + codigo1 + '' + marca
          ),
          productoEnCarrito
        );
      }

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto agregado',
        showConfirmButton: false,
        timer: 1000,
      });
      setCantidad(0);
      setAbierto(false);
    } catch (error) {
      console.log('Error al agregar el producto al carrito:', error);
    }
  };
  function isURL(value) {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value);
  }

  useEffect(() => {
    const productosRef = ref(db, 'productos');
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
    };
    const id = localStorage.getItem('idRodamientos');
    if (id) {
      setUsuario(id);
    } else {
      alert('nadie logeado');
    }
    if (window.localStorage.getItem('email')) {
      const adminData = JSON.parse(window.localStorage.getItem('email'));
      if (adminData) {
        setAdmin(adminData.email);
      }
    }

    getCatalogData();
  }, []);

  const handleMarcaChange = (event) => {
    const selectedMarca = event.target.value;
    setSelectedMarca(selectedMarca);
    // Resetear el modelo seleccionado cuando cambie lamarca
    setSelectedModelo('');

    // Filtrar los modelos disponibles basados en la marca seleccionada
    const modeloDisponibles = relacionesModelos[selectedMarca] || [];
    setModelosDisponibles(modeloDisponibles);
  };

  const handleModeloChange = (event) => {
    setSelectedModelo(event.target.value);
  };

  const handleUbicacionChange = (event) => {
    setSelectedUbicacion(event.target.value);
  };

  const handleSearch = () => {
    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(
      selectedUbicacion,
      selectedModelo,
      selectedMarca
    );

    setSearchResults(results);
  };

  const searchProducts = (selectedUbicacion, selectedModelo, selectedMarca) => {
    if (!catalogData) {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      // Verifica si product.aplicaciones es un array antes de intentar iterar sobre él
      if (Array.isArray(product.aplicaciones)) {
        product.aplicaciones.forEach((app) => {
          var marcas = app.marcasAuto || [];
          var modelos = app.modelosAuto || [];
          var ubis = app.ubicaciones || [];

          // Variables para determinar si cada filtro es cumplido
          const marcaCumple =
            selectedMarca === '' || marcas.includes(selectedMarca);
          const modeloCumple =
            selectedModelo === '' || modelos.includes(selectedModelo);
          const ubicacionCumple =
            selectedUbicacion === '' || ubis.includes(selectedUbicacion);

          // Agregar el producto a los resultados si todos los filtros son cumplidos
          if (marcaCumple && modeloCumple && ubicacionCumple) {
            results.push(product);
          }
        });
      }
    });

    return results;
  };
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <>
      <div className={abierto ? 'blureado' : ''}>
        <Navbar />
        <NavAplicacion />

        <div className="fondo-busqueda">
          <>.</>

          <div className="barra-busqueda">
            <select value={selectedMarca} onChange={handleMarcaChange}>
              <option value="" disabled>
                {' '}
                MARCA AUTO{' '}
              </option>
              <option value="Chery"> CHERY </option>
              <option value="Chevrolet"> CHEVROLET </option>
              <option value="Chrysler"> CHRYSLER </option>
              <option value="Citroen"> CITROEN </option>
              <option value="Fiat"> FIAT </option>
              <option value="Ford"> FORD </option>
              <option value="MercedesBenz"> MERCEDEZ BENZ </option>
              <option value="Peugeot"> PEUGEOT </option>
              <option value="Renault"> RENAULT </option>
              <option value="Suzuki"> SUZUKI </option>
              <option value="Toyota"> TOYOTA </option>
              <option value="Volskwagen"> VOLSKWAGEN </option>
            </select>
            <select value={selectedModelo} onChange={handleModeloChange}>
              <option value="" disabled>
                {' '}
                MODELO AUTO{' '}
              </option>
              {modelosDisponibles.map((modelo, index) => (
                <option key={index} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>
            <select value={selectedUbicacion} onChange={handleUbicacionChange}>
              <option value="" disabled>
                UBICACIONES{' '}
              </option>
              <option value="Rueda Delantera">RUEDA DELANTERA </option>
              <option value="Rueda Trasera">RUEDA TRASERA </option>
              <option value="Tensores Poly V">TENSORES POLY V </option>
              <option value="Embrague">EMBRAGUE </option>
              <option value="Kit de Distribucion">KIT DE DISTRIBUCION </option>
              <option value="Tensores Distribucion">
                TENSORES DISTRIBUCION{' '}
              </option>
              <option value="Kit De Poly V">KIT DE POLY V </option>
              <option value="Homocinetica">HOMOCINETICA </option>
              <option value="Retenes">RETENES </option>
              <option value="Correa Poly V">CORREA POLY V </option>
              <option value="Correa Distribucion">CORREA DISTRIBUCION </option>
            </select>
            <button
              className="buscar"
              onClick={() => {
                handleSearch();
              }}>
              {' '}
              Buscar
            </button>
          </div>

          {Object.keys(searchResults).map((codigo1, index) => (
            <div className="contenedor-cards" key={index}>
              <>
                <Image
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    marginLeft: '20px',
                  }}
                  alt=""
                  src="/rodamiento.webp"
                  width={80}
                  height={80}
                />
              </>

              <div className="textos-completo2">
                <div className="codigo-medidas2">
                  <div className="titulo-singular2">
                    {searchResults[codigo1].codigo1}
                  </div>
                  <div className="medidas">
                    <div className="titulo-singular2">
                      {searchResults[codigo1].codigo2}
                    </div>
                    <div className="titulo-singular2">
                      {searchResults[codigo1].codigo3}
                    </div>

                    <span>INTERIOR: {searchResults[codigo1].interior} mm</span>
                    <span>EXTERIOR: {searchResults[codigo1].exterior} mm</span>
                    <span>ALTURA: {searchResults[codigo1].altura} mm</span>
                  </div>
                </div>
                <div className="contenedor-propiedades3">
                  <div>
                    <div className="propiedades-principales2">
                      <span> MARCA</span>
                      <span>PRECIO</span>
                      <span>STOCK </span>
                    </div>

                    {searchResults[codigo1].marcas &&
                      Object.values(searchResults[codigo1].marcas).map(
                        (producto, marcaIndex) => (
                          <>
                            <div className="propiedades2" key={marcaIndex}>
                              <Image
                                style={{ marginRight: '100px' }}
                                alt=""
                                src={`/${producto.marca.toLowerCase()}Logo.png`}
                                width={100}
                                height={25}
                              />

                              <span style={{ fontWeight: 'bold' }}>
                                ${producto.precio}
                              </span>
                              <span
                                className="span-2"
                                style={{
                                  fontWeight: 'bold',
                                  color:
                                    producto.stock.toLowerCase() == 'disponible'
                                      ? 'green'
                                      : producto.stock == 'No disponible'
                                      ? 'red'
                                      : 'rgb(215, 215, 58)',
                                }}>
                                {producto.stock
                                  ? producto.stock.toUpperCase()
                                  : ''}
                              </span>

                              {admin === 'rodamientosbb@admin.com' ? (
                                <button
                                  onClick={() =>
                                    handleClickAgregar(
                                      producto,
                                      searchResults[codigo1]
                                    )
                                  }>
                                  AGREGAR
                                </button>
                              ) : (
                                ''
                              )}
                            </div>
                          </>
                        )
                      )}
                  </div>

                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {abierto ? (
        <PopUp
          usuario={usuario}
          agregarProducto={agregarProducto}
          producto={selectedProduct}
          marca={marca}
          precio={marca.precio}
          setAbierto={setAbierto}
          abierto={abierto}
          cantidad={cantidad}
          setCantidad={setCantidad}
        />
      ) : null}
    </>
  );
}
