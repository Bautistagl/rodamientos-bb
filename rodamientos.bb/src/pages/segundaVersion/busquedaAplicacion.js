import { useState, useEffect } from 'react';

import {
  addUbicacion,
  db,
  getAllCarRelations,
  getAllCars,
  getEngineTypes,
  getModelsByBrand,
  getUbicaciones,
  removeUbicacion,
} from "../../firebase";
import "firebase/database";
import { ref, get, update } from "firebase/database";

import Image from "next/image";
import Swal from "sweetalert2";

import Navbar from "@/components/Navbarbautista";
import PopUp from "@/components/PopUpbautista";
import NavAplicacion from "@/components/NavAplicacionbautista";

export default function BusquedaAplicacion() {
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [admin, setAdmin] = useState("");

  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedUbicacion, setSelectedUbicacion] = useState("");
  const [selectedMotor, setSelectedMotor] = useState("");
  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [autosDisponibles, setAutosDisponibles] = useState([]);
  const [motoresDisponibles, setMotoresDisponibles] = useState([]);
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);

  const carritoRef = ref(db, "usuarios/" + `${usuario}` + "/carrito");

  const handleClickAgregar = (producto, marca) => {
    setSelectedMarca(marca);
    setSelectedProduct(producto);
    setAbierto(true);
  };

  useEffect(() => {
    const loadRelations = async () => {
      const tipos = await getAllCarRelations();
      setAutosDisponibles(tipos);
    };

    const loadMotores = async () => {
      const tipos = await getEngineTypes();
      setMotoresDisponibles(tipos);
    };
    const loadUbicaciones = async () => {
      const tipos = await getUbicaciones();
      setUbicacionesDisponibles(tipos);
    };

    loadUbicaciones();
    loadMotores();
    loadRelations();
  }, []);

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

  const handleMarcaChange = async (event) => {
    const selectedMarca = event.target.value;
    setSelectedMarca(selectedMarca);

    setSelectedModelo("");
    // Filtrar los modelos disponibles basados en la marca seleccionada
    const modeloDisponibles = (await getModelsByBrand(selectedMarca)) || [];

    setModelosDisponibles(modeloDisponibles);
  };

  const handleModeloChange = (event) => {
    setSelectedModelo(event.target.value);
  };

  const handleUbicacionChange = (event) => {
    setSelectedUbicacion(event.target.value);
  };
  const handleMotorChange = (event) => {
    setSelectedMotor(event.target.value);
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
          var motores = app.motores || [];

          // Variables para determinar si cada filtro es cumplido
          const marcaCumple =
            selectedMarca === "" || marcas.includes(selectedMarca);
          const modeloCumple =
            selectedModelo === "" || modelos.includes(selectedModelo);
          const ubicacionCumple =
            selectedUbicacion === "" || ubis.includes(selectedUbicacion);
          const motoresCumple =
            selectedMotor === "" || motores.includes(selectedMotor);

          // Agregar el producto a los resultados si todos los filtros son cumplidos
          if (marcaCumple && modeloCumple && ubicacionCumple && motoresCumple) {
            results.push(product);
          }
        });
      }
    });

    return results;
  };

  return (
    <div className="fondo-busqueda">
      <div className={abierto ? "blureado" : ""}>
        <Navbar />
        <NavAplicacion />

        <div>
          <>.</>

          <div className="filter-container">
            <div className="filter-group">
              <select
                className="filter-select"
                value={selectedMarca}
                onChange={handleMarcaChange}
                aria-label="Seleccionar marca de auto"
              >
                <option value="" disabled>
                  MARCA AUTO
                </option>
                {Object.keys(autosDisponibles).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedModelo}
                onChange={handleModeloChange}
                aria-label="Seleccionar modelo de auto"
              >
                <option value="" disabled>
                  MODELO AUTO
                </option>
                {modelosDisponibles.map((modelo, index) => (
                  <option key={index} value={modelo}>
                    {modelo}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedUbicacion}
                onChange={handleUbicacionChange}
                aria-label="Seleccionar ubicación"
              >
                <option value="" disabled>
                  UBICACIONES
                </option>
                {ubicacionesDisponibles.map((ubicacion, index) => (
                  <option key={index} value={ubicacion}>
                    {ubicacion}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedMotor}
                onChange={handleMotorChange}
                aria-label="Seleccionar motor"
              >
                <option value="" disabled>
                  MOTORES
                </option>
                {motoresDisponibles.map((motor, index) => (
                  <option key={index} value={motor}>
                    {motor}
                  </option>
                ))}
              </select>

              <button
                className="filter-button"
                onClick={handleSearch}
                aria-label="Buscar"
              >
                Buscar
              </button>
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
