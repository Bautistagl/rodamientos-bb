import { useState, useEffect } from 'react';

import { db, auth, storage } from '../../firebase';
import 'firebase/database';
import { ref, get, child, update, set, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { ref as sRef, uploadString, getDownloadURL } from 'firebase/storage';
import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';
import NavCodigo from '@/components/NavCodigobautista';
import { listAll } from 'firebase/storage';

export default function BusquedaCodigo2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [fotosData, setFotosData] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [admin, setAdmin] = useState("");
  const [selectedMarca, setSelectedMarca] = useState(null);

  const usuarioRef = ref(db, "usuarios");
  const productosRef = ref(db, "productos");
  const carritoRef = ref(db, "usuarios/" + `${usuario}` + "/carrito");

  const handleClickAgregar = (producto, marca) => {
    setSelectedMarca(marca);
    setSelectedProduct(producto);
    setAbierto(true);
  };

  // const createApplicationsData = async () => {
  //   const dbRef = ref(db, `/ /aplicaciones`);
  //   try {
  //     await set(ref(db, "cars/relations"), tiposMotores);
  //     console.log("Relaciones guardadas exitosamente");
  //     return true;
  //   } catch (error) {
  //     console.error("Error al guardar los tipos de motores:", error);
  //     return false;
  //   }
  // };

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
      console.log("Error al leer los productos del carrito:", error);
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
          "usuarios/" + `${usuario}` + "/carrito2/" + codigo1 + "" + marca
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
            "usuarios/" + `${usuario}` + "/carrito2/" + codigo1 + "" + marca
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
            "usuarios/" + `${usuario}` + "/carrito2/" + codigo1 + "" + marca
          ),
          productoEnCarrito
        );
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1000,
      });
      setCantidad(0);
      setAbierto(false);
    } catch (error) {
      console.log("Error al agregar el producto al carrito:", error);
    }
  };

  useEffect(() => {
    const productosRef = ref(db, "productos");
    const getCatalogData = async () => {
      await get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const productos = snapshot.val();

            setCatalogData(productos);
          } else {
            console.log("No se encontraron productos en la rama especificada");
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Debe iniciar sesión para ver los productos",

            footer:
              '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>',
          });
        });
    };
    const id = localStorage.getItem("idRodamientos");
    if (id) {
      setUsuario(id);
    } else {
      alert("nadie logeado");
    }
    if (window.localStorage.getItem("email")) {
      const adminData = JSON.parse(window.localStorage.getItem("email"));
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
    if (!catalogData || term === "") {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      var filtro = product.codigo1;
      var filtro2 = product.codigo2;
      var filtro3 = product.codigo3;

      if (filtro) {
        if (filtro.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia

          results.push(product);
        }
      }

      if (filtro2) {
        if (filtro2.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia
          if (results.includes(product)) {
          } else {
            results.push(product);
          }
        }
      }

      if (filtro3) {
        if (filtro3.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia
          if (results.includes(product)) {
          } else {
            results.push(product);
          }
        }
      }
    });

    return results;
  };

  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <div className="fondo-busqueda">
      <div className={abierto ? "blureado" : ""}>
        <Navbar />
        <NavCodigo />
        <div>
          <>.</>

          <div className="search-bar">
            <div className="search-input-wrapper">
              <input
                className="search-input"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="CÓDIGO"
              />
              <Image
                className="search-icon"
                width={20}
                height={20}
                alt="Search Icon"
                src="/iconoBusqueda.png"
              />
            </div>
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
                        <h1 className="product-code">
                          {searchResults[codigo1].codigo1}
                        </h1>
                        <h1 className="product-code">
                          {searchResults[codigo1].codigo2}
                        </h1>
                        <h1 className="product-code">
                          {searchResults[codigo1].codigo3}
                        </h1>
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
          marca={marca}
          precio={marca.precio}
          setAbierto={setAbierto}
          abierto={abierto}
          cantidad={cantidad}
          setCantidad={setCantidad}
        />
      ) : null}
    </div>
  );
}

// const obtenerCodigosDisponibles = async () => {
//   try {
//     const codigosDisponibles = [];

//     // Iterar sobre cada producto en catalogData
//     for (const productoKey in catalogData) {
//       const producto = catalogData[productoKey];
//       if (!producto.marcas) {
//         try {
//           // Elimina el producto de la base de datos
//           await remove(ref(db, `productos/${productoKey}`));
//           console.log(`Producto ${productoKey} eliminado correctamente.`);
//         } catch (error) {
//           console.error(`Error al eliminar el producto ${codigo}:`, error);
//         }
//         console.log('terminmo');
//       }
//     }

//     // Imprimir los códigos de productos disponibles en la consola
//     console.log('termino');
//   } catch (error) {
//     console.error(
//       'Error al obtener los códigos de productos disponibles:',
//       error
//     );
//   }
// };
// const removeProduct = async (codigo) => {
//   try {
//     // Elimina el producto de la base de datos
//     await remove(ref(db, `productos/ ${codigo}`));
//     console.log(`Producto ${codigo} eliminado correctamente.`);
//   } catch (error) {
//     console.error(`Error al eliminar el producto ${codigo}:`, error);
//   }
// };
