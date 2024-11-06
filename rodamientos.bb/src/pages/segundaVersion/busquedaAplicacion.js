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
    <>
      <div className={abierto ? "blureado" : ""}>
        <Navbar />
        <NavAplicacion />

        <div className="fondo-busqueda">
          <>.</>

          <div className="barra-busqueda">
            <select
              id="brandSelector"
              value={selectedMarca}
              onChange={handleMarcaChange}
            >
              <option value="" disabled>
                {" "}
                MARCA AUTO
              </option>
              {Object.keys(autosDisponibles).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select value={selectedModelo} onChange={handleModeloChange}>
              <option value="" disabled>
                {" "}
                MODELO AUTO{" "}
              </option>
              {modelosDisponibles.map((modelo, index) => (
                <option key={index} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>

            <select value={selectedUbicacion} onChange={handleUbicacionChange}>
              <option value="" disabled>
                {" "}
                UBICACIONES{" "}
              </option>
              {ubicacionesDisponibles.map((modelo, index) => (
                <option key={index} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>

            <select value={selectedMotor} onChange={handleMotorChange}>
              <option value="" disabled>
                MOTORES{" "}
              </option>
              {motoresDisponibles.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              className="buscar"
              onClick={() => {
                handleSearch();
              }}
            >
              {" "}
              Buscar
            </button>
          </div>

          {Object.keys(searchResults).map((codigo1, index) => (
            <div className="contenedor-cards" key={index}>
              <>
                <Image
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "20px",
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
                                style={{ marginRight: "100px" }}
                                alt=""
                                src={`/${producto.marca.toLowerCase()}Logo.png`}
                                width={100}
                                height={25}
                              />

                              <span style={{ fontWeight: "bold" }}>
                                ${producto.precio}
                              </span>
                              <span
                                className="span-2"
                                style={{
                                  fontWeight: "bold",
                                  color:
                                    producto.stock.toLowerCase() == "disponible"
                                      ? "green"
                                      : producto.stock == "No disponible"
                                      ? "red"
                                      : "rgb(215, 215, 58)",
                                }}
                              >
                                {producto.stock
                                  ? producto.stock.toUpperCase()
                                  : ""}
                              </span>

                              {admin === "rodamientosbb@admin.com" ? (
                                <button
                                  onClick={() =>
                                    handleClickAgregar(
                                      producto,
                                      searchResults[codigo1]
                                    )
                                  }
                                >
                                  AGREGAR
                                </button>
                              ) : (
                                ""
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
