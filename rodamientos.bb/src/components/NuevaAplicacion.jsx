import {
  db,
  getAllCarRelations,
  getEngineTypes,
  getModelsByBrand,
  getUbicaciones,
} from "@/firebasebautista";
import { child, get, ref, set, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const NuevaAplicacion = ({ producto, setAplicacion }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [marcaAutos, setMarcaAutos] = useState("");
  const [modelosAutos, setModelosAutos] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedMarcasModels, setSelectedMarcasModels] = useState([]);
  const [motores, setMotores] = useState([]);
  const [listaMotores, setListaMotores] = useState([]);
  const [listaUbicaciones, setListaUbicaciones] = useState([]);
  const [listaMarcas, setListaMarcas] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [listaModelos, setListaModelos] = useState("");

  const handleUbicacionChange = (value) => {
    const sanitizedValue = String(value).replace(/[.#$/[\]]/g, "_"); // Convert to string and replace invalid characters
    const isSelected = ubicaciones.includes(sanitizedValue);
    if (isSelected) {
      setUbicaciones(ubicaciones.filter((item) => item !== sanitizedValue));
    } else {
      setUbicaciones([...ubicaciones, sanitizedValue]);
    }
  };

  const sanitizeValue2 = (value) => String(value).replace(/[#$/[\]]/g, "_");

  const handleMotorChange = (value) => {
    const sanitizedValue = sanitizeValue2(value);
    const isSelected = motores.includes(sanitizedValue);
    if (isSelected) {
      setMotores(motores.filter((item) => item !== sanitizedValue));
    } else {
      setMotores([...motores, sanitizedValue]);
    }
  };

  const handleModelosAutosChange = (value) => {
    const sanitizedValue = String(value).replace(/[.#$/[\]]/g, "_"); // Convert to string and replace invalid characters
    const isSelected = modelosAutos.includes(sanitizedValue);
    if (isSelected) {
      setModelosAutos(modelosAutos.filter((item) => item !== sanitizedValue));
    } else {
      setModelosAutos([...modelosAutos, sanitizedValue]);
    }
  };

  const handleMarcaAutoChange = (value) => {
    const sanitizedValue = String(value).replace(/[.#$/[\]]/g, "_");
    const isSelected = marcaAutos.includes(sanitizedValue);

    if (isSelected) {
      setMarcaAutos(marcaAutos.filter((item) => item !== sanitizedValue));

      // Remove the selected car brand from the state
      setSelectedMarcasModels((prevSelected) =>
        prevSelected.filter((item) => item.marca !== sanitizedValue)
      );
    } else {
      setMarcaAutos([...marcaAutos, sanitizedValue]);

      // Add the selected car brand and its models to the state
      setSelectedMarcasModels((prevSelected) => [
        ...prevSelected,
        {
          marca: sanitizedValue,
          models: relacionesModelos[sanitizedValue] || [],
        },
      ]);
    }
  };

  const dbRef2 = ref(db);
  const writeData = async () => {
    // Modifica `producto.codigo1` si incluye "POL" o "VIT"
    let codigo = producto.codigo1;
    if (codigo.includes("POL")) {
      codigo = codigo.replace("POL", "Pol");
    } else if (codigo.includes("VIT")) {
      codigo = codigo.replace("VIT", "Vit");
    }
  
    const aplicacionesRef = ref(db, `productos/ ${codigo}/aplicaciones`);
    const aplicacionesSnapshot = await get(aplicacionesRef);
    const aplicacionesData = aplicacionesSnapshot.val();
    const aplicacionesRef1 = ref(db, `productos/ ${codigo}/aplicaciones/1`);
  
    get(child(dbRef2, `productos/ ${codigo}/aplicaciones/`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const currentData = (await get(aplicacionesRef1)).val();
  
        const updatedData = {
          marcasAuto: [...(currentData?.marcasAuto || []), ...marcaAutos],
          modelosAuto: [...(currentData?.modelosAuto || []), ...modelosAutos],
          ubicaciones: [...(currentData?.ubicaciones || []), ...ubicaciones],
          motores: [...(currentData?.motores || []), ...motores],
        };
  
        update(aplicacionesRef1, updatedData);
  
        Swal.fire({
          title: "Aplicacion Creada",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
  
        setMarcaAutos("");
        setModelosAutos("");
        setUbicaciones("");
        setMotores("");
      } else {
        const aplicacionesCount = Object.keys(aplicacionesData || {}).length;
  
        const newAplicacionRef = ref(db, `productos/ ${codigo}/aplicaciones/${aplicacionesCount + 1}`);
        set(newAplicacionRef, {
          marcasAuto: marcaAutos,
          modelosAuto: modelosAutos,
          ubicaciones: ubicaciones,
          motores: motores,
        });
  
        Swal.fire({
          title: "Aplicacion Creada",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
  
        setMarcaAutos("");
        setModelosAutos("");
        setUbicaciones("");
        setMotores("");
      }
    });
  };

  const handleBrandChange = async (brand) => {
    setMarcaAutos([brand]);
    setSelectedBrand(brand);
    const brandModels = await getModelsByBrand(brand);
    setListaModelos(brandModels);
  };

  useEffect(() => {
    const loadEngineTypes = async () => {
      const tipos = await getEngineTypes();
      setListaMotores(tipos);
    };
    const loadUbicaciones = async () => {
      const tipos = await getUbicaciones();
      setListaUbicaciones(tipos);
    };
    const loadRelations = async () => {
      const tipos = await getAllCarRelations();
      setListaMarcas(tipos);
    };

    loadRelations();
    loadUbicaciones();
    loadEngineTypes();
  }, []);

  return (
    <>
      <div className="popUp3">
        <div className="textos-popUp3">
          <h1> Agregar nueva aplicacion de {producto.codigo1} </h1>
          
          <div className="contenedor-input2">
            <span>Ubicación:</span>
            <ul className="checkbox-list">
              {listaUbicaciones.map((motor, index) => (
                <li key={index} className="checkbox">
                  <input
                    type="checkbox"
                    value={motor}
                    checked={ubicaciones.includes(motor)}
                    onChange={() => handleUbicacionChange(motor)}
                  />
                  <label>{motor}</label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
            >
              <option value="">Selecciona una marca</option>
              {Object.keys(listaMarcas).map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>

            {listaModelos.length > 0 && (
              <div>
                <ul className="checkbox-list">
                  {listaModelos.map((model, modelIndex) => (
                    <li key={modelIndex} className="checkbox">
                      <input
                        type="checkbox"
                        value={model}
                        checked={modelosAutos.includes(model)}
                        onChange={() => handleModelosAutosChange(model)}
                      />
                      <label>{model}</label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="contenedor-input2">
            <span>Motor:</span>
            <ul className="checkbox-list">
              {listaMotores.map((motor, index) => (
                <li key={index} className="checkbox">
                  <input
                    type="checkbox"
                    value={motor}
                    checked={motores.includes(sanitizeValue2(motor))}
                    onChange={() => handleMotorChange(motor)}
                  />
                  <label>{motor}</label>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: "flex" }}>
            <button
              className="buscar4"
              onClick={() => {
                writeData();
              }}
            >
              {" "}
              Agregar
            </button>

            <button
              className="buscar4"
              onClick={() => {
                setAplicacion(null);
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NuevaAplicacion;
