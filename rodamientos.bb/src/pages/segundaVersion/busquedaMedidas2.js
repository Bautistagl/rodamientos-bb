import { useState, useEffect } from 'react';

import { db, auth } from '../../firebase';
import 'firebase/database';
import { ref, get, child, update } from 'firebase/database';
import Image from 'next/image';
import Swal from 'sweetalert2';

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';
import NavMedida from '@/components/NavMedidasbautista';

export default function BusquedaAltura() {
  const [searchAltura, setSearchAltura] = useState(null);
  const [searchExterior, setSearchExterior] = useState(null);
  const [searchInterior, setSearchInterior] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [usuario, setUsuario] = useState('');
  const [admin, setAdmin] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [cantidad, setCantidad] = useState(null);

  const usuarioRef = ref(db, 'usuarios');

  const handleClickAgregar = (producto) => {
    setSelectedProduct(producto);
    setSelectedMarca(marca);
    setAbierto(true);
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

  const handleSearch = () => {
    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(
      searchAltura,
      searchInterior,
      searchExterior
    );
    const first30 = results.slice(0, 50);

    setSearchResults(first30);
  };

  const searchProducts = (altura, interior, exterior) => {
    if (
      !catalogData ||
      (altura === null && interior === null && exterior === null)
    ) {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      // Busca en cada propiedad del producto

      var filtroAltura = product.altura;
      var filtroExterior = product.exterior;
      var filtroInterior = product.interior;

      // Filtra los resultados
      if (altura && interior && exterior) {
        if (
          filtroAltura === altura &&
          filtroExterior === exterior &&
          filtroInterior === interior
        ) {
          results.push(product);
        }
      } else if (altura && interior) {
        if (filtroAltura === altura && filtroInterior === interior) {
          results.push(product);
        }
      } else if (altura && exterior) {
        if (filtroAltura === altura && filtroExterior === exterior) {
          results.push(product);
        }
      } else if (interior && exterior) {
        if (filtroInterior === interior && filtroExterior === exterior) {
          results.push(product);
        }
      } else if (altura) {
        if (filtroAltura === altura) {
          results.push(product);
        }
      } else if (interior) {
        if (filtroInterior === interior) {
          results.push(product);
        }
      } else if (exterior) {
        if (filtroExterior === exterior) {
          results.push(product);
        }
      }
    });

    return results;
  };

  return (
    <div className="fondo-busqueda">
      <div>
        <Navbar />
        <NavMedida />

        <div>
          <>.</>

          <div className="measurement-search">
            <div className="measurement-inputs">
              <div className="input-group">
                <label htmlFor="interior" className="input-label">
                  Interior
                </label>
                <input
                  id="interior"
                  className="measurement-input"
                  type="text"
                  value={searchInterior}
                  onChange={(e) => setSearchInterior(e.target.value)}
                  placeholder="mm"
                />
              </div>

              <div className="input-group">
                <label htmlFor="exterior" className="input-label">
                  Exterior
                </label>
                <input
                  id="exterior"
                  className="measurement-input"
                  type="text"
                  value={searchExterior}
                  onChange={(e) => setSearchExterior(e.target.value)}
                  placeholder="mm"
                />
              </div>

              <div className="input-group">
                <label htmlFor="altura" className="input-label">
                  Altura
                </label>
                <input
                  id="altura"
                  className="measurement-input"
                  type="text"
                  value={searchAltura}
                  onChange={(e) => setSearchAltura(e.target.value)}
                  placeholder="mm"
                />
              </div>
            </div>

            <button
              className="search-button"
              onClick={handleSearch}
              aria-label="Buscar por medidas"
            >
              BUSCAR
            </button>
          </div>

          <div className="product-list">
            {Object.keys(searchResults).map((codigo1, index) => (
              <div key={index} className="product-card">
                <div className="product-content">
                  <div className="product-image">
                    <Image
                      alt="Product"
                      height={128}
                      width={128}
                      src={
                        searchResults[codigo1].imageUrl || "/rodamiento.webp"
                      }
                    />
                  </div>

                  <div className="product-details">
                    <div>
                      <div className="product-header">
                        <h3 className="product-code">
                          {searchResults[codigo1].codigo1}
                        </h3>
                        <h3 className="product-code">
                          {searchResults[codigo1].codigo2}
                        </h3>
                        <h3 className="product-code">
                          {searchResults[codigo1].codigo3}
                        </h3>
                      </div>

                      <div className="product-specs">
                        <div className="spec-item">
                          <span className="spec-label">Interior:</span>
                          <span className="spec-value">
                            {searchResults[codigo1].interior} mm
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Exterior:</span>
                          <span className="spec-value">
                            {searchResults[codigo1].exterior} mm
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Altura:</span>
                          <span className="spec-value">
                            {searchResults[codigo1].altura} mm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="product-variants">
                      <div className="variant-header">
                        <span>MARCA</span>
                        <span>PRECIO</span>
                        <span>STOCK</span>
                      </div>

                      {searchResults[codigo1].marcas &&
                        Object.values(searchResults[codigo1].marcas).map(
                          (producto, marcaIndex) => (
                            <div key={marcaIndex} className="variant-item">
                              <div className="variant-brand">
                                <Image
                                  alt={producto.marca}
                                  height={24}
                                  width={96}
                                  src={`/${producto.marca.toLowerCase()}Logo.png`}
                                />
                              </div>
                              <span className="variant-price">
                                ${producto.precio}
                              </span>
                              <div className="variant-stock">
                                <span
                                  className={`stock-status ${
                                    producto.stock.toLowerCase() ===
                                    "disponible"
                                      ? "stock-available"
                                      : producto.stock.toLowerCase() ===
                                        "no disponible"
                                      ? "stock-unavailable"
                                      : "stock-limited"
                                  }`}
                                >
                                  {producto.stock.toUpperCase()}
                                </span>

                                {/* {admin === "rodamientosbb@admin.com" && (
                                  <button
                                    className="add-button"
                                    onClick={() =>
                                      console.log("Add clicked", producto)
                                    }
                                  >
                                    AGREGAR
                                  </button>
                                )} */}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          setCantidad={setCantidad}
        />
      ) : null}
    </div>
  );
}
