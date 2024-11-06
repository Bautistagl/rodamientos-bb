import Navbar from "@/components/Navbarbautista";
import {
  addModelToBrand,
  addMotor,
  addUbicacion,
  getAllCarRelations,
  getEngineTypes,
  getModelsByBrand,
  getUbicaciones,
  removeModelFromBrand,
  removeMotor,
  removeUbicacion,
} from "@/firebasebautista";
import { useState, useEffect } from "react";

export default function CarManagement() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandModels, setBrandModels] = useState([]);
  const [newModel, setNewModel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [listaUbicaciones, setListaUbicaciones] = useState([]);
  const [listaMotores, setListaMotores] = useState([]);
  const [newMotor, setNewMotor] = useState("");
  const [newUbicacion, setNewUbicacion] = useState("");

  useEffect(() => {
    const loadEngineTypes = async () => {
      const tipos = await getEngineTypes();
      setListaMotores(tipos);
    };
    const loadUbicaciones = async () => {
      const tipos = await getUbicaciones();
      setListaUbicaciones(tipos);
    };

    loadUbicaciones();
    loadEngineTypes();
    loadBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      loadBrandModels();
    } else {
      setBrandModels([]);
    }
  }, [selectedBrand]);

  const loadBrands = async () => {
    const relations = await getAllCarRelations();
    setBrands(Object.keys(relations));
  };

  const loadBrandModels = async () => {
    const models = await getModelsByBrand(selectedBrand);
    setBrandModels(models || []);
  };

  const loadMotores = async () => {
    const models = await getEngineTypes();
    setListaMotores(models || []);
  };
  const loadUbicaciones = async () => {
    const models = await getUbicaciones();
    setListaUbicaciones(models || []);
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedBrand) {
      setError("Por favor selecciona una marca");
      return;
    }

    if (!newModel.trim()) {
      setError("Por favor ingresa un modelo");
      return;
    }

    try {
      const result = await addModelToBrand(
        selectedBrand,
        newModel.toUpperCase()
      );
      if (result) {
        setSuccess(
          `Modelo ${newModel} agregado exitosamente a ${selectedBrand}`
        );
        setNewModel("");
        loadBrandModels();
      } else {
        setError("El modelo ya existe para esta marca");
      }
    } catch (error) {
      setError("Error al agregar el modelo");
    }
  };

  const handleRemoveModel = async (model) => {
    if (
      window.confirm(`¿Estás seguro de querer eliminar el modelo ${model}?`)
    ) {
      try {
        await removeModelFromBrand(selectedBrand, model);
        setSuccess(`Modelo ${model} eliminado exitosamente`);
        loadBrandModels();
      } catch (error) {
        setError("Error al eliminar el modelo");
      }
    }
  };
  const handleRemoveUbicacion = async (model) => {
    if (
      window.confirm(`¿Estás seguro de querer eliminar la ubicacion ${model}?`)
    ) {
      try {
        await removeUbicacion(model);
        setSuccess(`Ubicacion ${model} eliminada exitosamente`);
        loadUbicaciones();
      } catch (error) {
        setError("Error al eliminar el modelo");
      }
    }
  };
  const handleRemoveMotores = async (model) => {
    if (window.confirm(`¿Estás seguro de querer eliminar el motor ${model}?`)) {
      try {
        await removeMotor(model);
        setSuccess(`Motor ${model} eliminado exitosamente`);
        loadMotores();
      } catch (error) {
        setError("Error al eliminar el modelo");
      }
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setNewModel("");
    setError("");
    setSuccess("");
  };
  const handleAddMotor = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newMotor.trim()) {
      setError("Por favor ingresa un motoro");
      return;
    }

    try {
      const result = await addMotor(newMotor.toUpperCase());
      if (result) {
        setSuccess(`Motor ${newMotor} agregado exitosamente`);
        setNewMotor("");
        loadMotores();
      } else {
        setError("El motor ya existe");
      }
    } catch (error) {
      setError("Error al agregar el motor");
    }
  };
  const handleAddUbicacion = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newUbicacion.trim()) {
      setError("Por favor ingresa una ubicacione");
      return;
    }

    try {
      const result = await addUbicacion(newUbicacion);
      if (result) {
        setSuccess(`Ubicacion ${newUbicacion} agregada exitosamente`);
        setNewUbicacion("");
        loadUbicaciones();
      } else {
        setError("El motor ya existe");
      }
    } catch (error) {
      setError("Error al agregar el motor");
    }
  };

  return (
    <>
      <Navbar />
      <div className="aplicaciones-screen">
        <h1>Gestión de Aplicaciones</h1>

        {/* Selector de marca */}
        <div className="seccion-aplicaciones">
          <div className="selector-aplicaciones">
            <h2>Modelos</h2>
            <label htmlFor="brandSelector">Selecciona una marca:</label>
            <select
              id="brandSelector"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedBrand && (
          <div className="seccion-aplicaciones">
            <div>
              <h2>Agregar Nuevo Modelo para {selectedBrand}</h2>
              <form onSubmit={handleAddModel}>
                <div className="selector-aplicaciones">
                  <label htmlFor="model">Nuevo Modelo:</label>
                  <input
                    className="input-aplicaciones"
                    id="model"
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="Ingresa nuevo modelo"
                  />
                </div>
                <button className="boton-aplicaciones" type="submit">
                  Agregar Modelo
                </button>
              </form>
            </div>

            <div>
              <h2>Modelos de {selectedBrand}</h2>
              {brandModels.length === 0 ? (
                <p>No hay modelos registrados para esta marca</p>
              ) : (
                <div className="tab-aplicaciones">
                  {brandModels.map((model) => (
                    <div className="item-aplicaciones" key={model}>
                      <p>{model}</p>
                      <button
                        onClick={() => handleRemoveModel(model)}
                        title="Eliminar modelo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="seccion-aplicaciones">
          <div>
            <h2>Agregar nueva ubicacion</h2>
            <form onSubmit={handleAddUbicacion}>
              <div className="selector-aplicaciones">
                <label htmlFor="model">Nueva Ubicacion:</label>
                <input
                  className="input-aplicaciones"
                  id="model"
                  type="text"
                  value={newUbicacion}
                  onChange={(e) => setNewUbicacion(e.target.value)}
                  placeholder="Ingresar nueva ubicacion"
                />
              </div>
              <button className="boton-aplicaciones" type="submit">
                Agregar Ubicacion
              </button>
            </form>
          </div>
          {listaUbicaciones.length === 0 ? (
            <p>No hay ubicaciones</p>
          ) : (
            <div className="tab-aplicaciones">
              {listaUbicaciones.map((model) => (
                <div className="item-aplicaciones" key={model}>
                  <span>{model}</span>
                  <button
                    onClick={() => handleRemoveUbicacion(model)}
                    title="Eliminar modelo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="seccion-aplicaciones">
          <div className="selector-aplicaciones">
            <h2>Agregar nuevo motor</h2>
            <form onSubmit={handleAddMotor}>
              <div>
                <label htmlFor="model">Nuevo Motor:</label>
                <input
                  className="input-aplicaciones"
                  id="model"
                  type="text"
                  value={newMotor}
                  onChange={(e) => setNewMotor(e.target.value)}
                  placeholder="Ingresar nuevo motor"
                />
              </div>
              <button className="boton-aplicaciones" type="submit">
                Agregar Motor
              </button>
            </form>
          </div>
          {listaMotores.length === 0 ? (
            <p>No hay motores</p>
          ) : (
            <div className="tab-aplicaciones">
              {listaMotores.map((model) => (
                <div className="item-aplicaciones" key={model}>
                  <p>{model}</p>
                  <button
                    onClick={() => handleRemoveMotores(model)}
                    title="Eliminar modelo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
