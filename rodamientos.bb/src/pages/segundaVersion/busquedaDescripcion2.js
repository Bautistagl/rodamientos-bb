import { useState, useEffect } from 'react';

import { db, auth } from '../../firebase';
import 'firebase/database';
import { ref, get, child, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';

export default function BusquedaDescripcion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [cantidad, setCantidad] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [admin, setAdmin] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [usuario, setUsuario] = useState('');

  const usuarioRef = ref(db, 'usuarios');

  const handleClickAgregar = (producto, marca) => {
    setSelectedProduct(producto);
    setSelectedMarca(marca);
    setAbierto(true);
  };
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
          Swal.fire({
            icon: 'error',
            title: 'Debe iniciar sesión para ver los productos',

            footer:
              '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>',
          });
        });

      //   setCatalogData(snapshot.val());
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
      var filtro2 = product.descripcion;
      if (filtro2) {
        if (filtro2.includes(term)) {
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

  return (
    <>
      <div>
        <Navbar />

        <div className="fondo-busqueda">
          <>.</>
          <div className="botones-busqueda">
            <button className="button-30">
              <Link href="busquedaCodigo2"> BUSCAR POR CODIGO </Link>
            </button>
            <button className="button-30">
              <Link href="busquedaMedidas2"> BUSCAR POR MEDIDAS </Link>
            </button>
          </div>
          <div className="barra-busqueda">
            <input
              className="input-busqueda"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="DESCRIPCION"
            />
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
                  src={searchResults[codigo1].imageUrl || '/rodamiento.webp'}
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
                    <span>Interior: {searchResults[codigo1].interior} mm</span>
                    <span>Exterior: {searchResults[codigo1].exterior} mm</span>
                    <span>Altura: {searchResults[codigo1].altura} mm</span>
                    <span className="span-3">
                      {' '}
                      {searchResults[codigo1].descripcion}{' '}
                    </span>
                  </div>
                </div>
                <div className="contenedor-propiedades3">
                  <div>
                    <div className="propiedades-principales2">
                      <span>MARCA</span>
                      <span>PRECIO</span>
                      <span>STOCK</span>
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
                                      searchResults[codigo1],
                                      producto
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
          setAbierto={setAbierto}
          abierto={abierto}
          cantidad={cantidad}
          marca={selectedMarca}
          setCantidad={setCantidad}
        />
      ) : null}
    </>
  );
}
