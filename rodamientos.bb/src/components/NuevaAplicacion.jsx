import { db } from '@/firebasebautista';
import { child, get, ref, set } from 'firebase/database';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

const NuevaAplicacion = ({producto,setAplicacion}) => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [marcaAutos, setMarcaAutos] = useState([]);
    const [modelosAutos, setModelosAutos] = useState([]);
    const [selectedMarca, setSelectedMarca] = useState(null);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedMarcasModels, setSelectedMarcasModels] = useState([]);

    const handleUbicacionChange = (value) => {
        const sanitizedValue = String(value).replace(/[.#$/[\]]/g, '_'); // Convert to string and replace invalid characters
        const isSelected = ubicaciones.includes(sanitizedValue);
        if (isSelected) {
          setUbicaciones(ubicaciones.filter(item => item !== sanitizedValue));
        } else {
          setUbicaciones([...ubicaciones, sanitizedValue]);
        }
      };
      const handleModelosAutosChange = (value) => {
        const sanitizedValue = String(value).replace(/[.#$/[\]]/g, '_'); // Convert to string and replace invalid characters
        const isSelected = modelosAutos.includes(sanitizedValue);
        if (isSelected) {
          setModelosAutos(modelosAutos.filter(item => item !== sanitizedValue));
        } else {
          setModelosAutos([...modelosAutos, sanitizedValue]);
        }
      };
      
      const handleMarcaAutoChange = (value) => {
        const sanitizedValue = String(value).replace(/[.#$/[\]]/g, '_');
        const isSelected = marcaAutos.includes(sanitizedValue);
    
        if (isSelected) {
          setMarcaAutos(marcaAutos.filter(item => item !== sanitizedValue));
    
          // Remove the selected car brand from the state
          setSelectedMarcasModels((prevSelected) =>
            prevSelected.filter((item) => item.marca !== sanitizedValue)
          );
        } else {
          setMarcaAutos([...marcaAutos, sanitizedValue]);
    
          // Add the selected car brand and its models to the state
          setSelectedMarcasModels((prevSelected) => [
            ...prevSelected,
            { marca: sanitizedValue, models: relacionesModelos[sanitizedValue] || [] },
          ]);
        }
      };

   

   
        const relacionesModelos = {
            Chery:['TIGGO'],
            Chevrolet:[
                "AGILE",
                "ASTRA",
                "AVEO",
                "BLAZER",
                "CAPTIVA",
                "CELTA",
                "CORSA",
                "COBALT",
                "CRUZE",
                "MERIVA",
                "ONIX",
                "PRISMA",
                "SONIC",
                "SPARK",
                "SPIN",
                "TRACKER",
                "BLAZER",
                "VECTRA",
                "ZAFIRA",
                "S 10",
                "C 10"
              ],
            Chrysler:['NEON','PT CTRUISER'],
            Citroen:[
                "BERLINGO",
                "C3",
                "C4",
                "C4 CACTUS",
                "C4 PICASSO",
                "JUMPER"
              ],
              Fiat:[
                "128",
                "147",
                "ARGO",
                "DUNA",
                "DUCATO",
                "FIORINO",
                "FIORUNO",
                "GRAND SIENA",
                "IDEA",
                "LINEA",
                "MOBY",
                "PALIO",
                "REGATTA",
                "SIENA",
                "SPAZIO",
                "STILO",
                "STRADA",
                "TEMPRA",
                "TIPO",
                "TORO",
                "QUBO",
                "UNO"
              ],
              Ford: [
                "COURIER",
                "ECOSPORT",
                "ECOSPORT 2",
                "ESCORT",
                "F100",
                "FALCON",
                "FIESTA",
                "FOCUS",
                "GALAXY",
                "KA",
                "KUGA",
                "MONDEO",
                "ORION",
                "SIERRA",
                "TAUNUS",
                "TRANSIT",
                "RANGER"
              ],
              MercedezBenz:['SPRINTER','MB 180'],
              Peugot:[
                "106",
                "2008",
                "205",
                "206",
                "207",
                "208",
                "3008",
                "306",
                "307",
                "308",
                "404",
                "405",
                "5008",
                "505",
                "BOXER",
                "EXPERT",
                "PARTNER",
              ],
              Renault:[
                "CAPTUR",
                "CLIO",
                "DUSTER",
                "EXPRESS",
                "FLUENCE",
                "FUEGO",
                "KANGOO",
                "KOLEOS",
                "KWID",
                "LAGUNA",
                "LOGAN",
                "MASTER",
                "MEGANE",
                "R11",
                "R 12",
                "R 18",
                "R 19",
                "R 21",
                "R 9",
                "SANDERO",
                "SCENIC",
                "SYMBOL",
                "TRAFIC",
                "TWINGO"
              ],
              Suzuki:['FUN'],
              Toyota:['COROLA','CORONA','ETIOS','HILUX'],
              Volskwagen:[
                "1500",
                "AMAROK",
                "BORA",
                "CADDY",
                "CARAT",
                "FOX",
                "GACEL",
                "GOL",
                "GOLD TREND",
                "GOLF",
                "NEW BEATLE",
                "NIVUS",
                "PASSAT",
                "POINTER",
                "POLO",
                "POLO CLASSIC",
                "QUANTUM",
                "SANTANA",
                "SAVEIRO",
                "SCIROCCO",
                "SENDA",
                "SHARAN",
                "SURAN",
                "TIGUAN",
                "TOUAREG",
                "TRANSPORTER",
                "UP",
                "VENTO",
                "VIRTUS",
                "VOYAGE"
              ]
              

        }


  
    const dbRef2 = ref(db)
    const writeData = async () => {
        const aplicacionesRef = ref(db, `productos/ ${producto.codigo1}/aplicaciones`);
        const aplicacionesSnapshot = await get(aplicacionesRef);
        const aplicacionesData = aplicacionesSnapshot.val();
        const aplicacionesRef1 = ref(db, `productos/ ${producto.codigo1}/aplicaciones/1`);

        
        
           
    
            // Check if there are any applications
            get(child(dbRef2,'productos/' + ` ${producto.codigo1}/aplicaciones/`))
            .then((snapshot) =>{
                
                if (!snapshot.exists()) {
                    // If no applications, create the first one with name "1"
                     set(aplicacionesRef1, {
                        marcasAuto: marcaAutos,
                        modelosAuto: modelosAutos,
                        ubicaciones: ubicaciones,
                    });
        
                    Swal.fire({
                        title: 'Aplicacion Creada',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
        
                    setMarcaAutos('');
                    setModelosAutos('');
                    setUbicaciones('');
                } else {
                  
                   
                    const aplicacionesCount = Object.keys(aplicacionesData || {}).length;
                   
                    const newAplicacionRef = ref(db, `productos/ ${producto.codigo1}/aplicaciones/${aplicacionesCount + 1}`);
                    set(newAplicacionRef, {
                        marcasAuto: marcaAutos,
                        modelosAuto: modelosAutos,
                        ubicaciones: ubicaciones,
                    });
        
                    Swal.fire({
                        title: 'Aplicacion Creada',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
        
                    setMarcaAutos('');
                    setModelosAutos('');
                    setUbicaciones('');
                
            } 
            })
        
    };

  return (
    <>
   
    <div className="popUp3">
    <div className="textos-popUp3">
      <h1>
        {' '}
       Agregar nueva aplicacion de {producto.codigo1}{' '}
      </h1>

      {    /*             UBICACION       */ }

      <div className='contenedor-input2'> 
        <span>
          Ubicación:
        </span>
        <ul className="checkbox-list">
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Rueda Delantera"
              checked={ubicaciones.includes("Rueda Delantera")}
              onChange={() => handleUbicacionChange("Rueda Delantera")}
            />
            <label>Rueda Delantera</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Rueda Trasera"
              checked={ubicaciones.includes("Rueda Trasera")}
              onChange={() => handleUbicacionChange("Rueda Trasera")}
            />
            <label>Rueda Trasera</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Bomba de Agua"
              checked={ubicaciones.includes("Bomba de Agua")}
              onChange={() => handleUbicacionChange("Bomba de Agua")}
            />
            <label>Bomba de Agua</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Kit de Distribucion"
              checked={ubicaciones.includes("Kit de Distribucion")}
              onChange={() => handleUbicacionChange("Kit de Distribucion")}
            />
            <label>Kit de Distribucion</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Tensores Distribucion"
              checked={ubicaciones.includes("Tensores Distribucion")}
              onChange={() => handleUbicacionChange("Tensores Distribucion")}
            />
            <label>Tensores Distribucion</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Tensores Poly"
              checked={ubicaciones.includes("Tensores Poly")}
              onChange={() => handleUbicacionChange("Tensores Poly")}
            />
            <label>Tensores Poly</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Kit de Poly V"
              checked={ubicaciones.includes("Kit de Poly V")}
              onChange={() => handleUbicacionChange("Kit de Poly V")}
            />
            <label>Kit de Poly V</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Homocinetica"
              checked={ubicaciones.includes("Homocinetica")}
              onChange={() => handleUbicacionChange("Homocinetica")}
            />
            <label>Homocinetica</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Retenes"
              checked={ubicaciones.includes("Retenes")}
              onChange={() => handleUbicacionChange("Retenes")}
            />
            <label>Retenes</label>
          </li>
          <li  className='checkbox' >
            <input
 
              type="checkbox"
              value="Correa Poly V"
              checked={ubicaciones.includes("Correa Poly V")}
              onChange={() => handleUbicacionChange("Correa Poly V")}
            />
            <label>Correa Poly V</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Correa Distribucion"
              checked={ubicaciones.includes("Correa Distribucion")}
              onChange={() => handleUbicacionChange("Correa Distribucion")}
            />
            <label>Correa Distribucion</label>
          </li>

          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Embrague"
              checked={ubicaciones.includes("Embrague")}
              onChange={() => handleUbicacionChange("Embrague")}
            />
            <label>Embrague</label>
          </li>

         
        </ul>
       
        </div>



      {    /*             MARCA AUTO         */ }
      <div className='contenedor-input2'> 
        <span>
          Marca Auto:
        </span>
        <ul className="checkbox-list">
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Chery"
              checked={marcaAutos.includes("Chery")}
              onChange={() => handleMarcaAutoChange("Chery")}
            />
            <label>Chery</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Chevrolet"
              checked={marcaAutos.includes("Chevrolet")}
              onChange={() => handleMarcaAutoChange("Chevrolet")}
            />
            <label>Chevrolet</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Chrysler"
              checked={marcaAutos.includes("Chrysler")}
              onChange={() => handleMarcaAutoChange("Chrysler")}
            />
            <label>Chrysler</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Citroen"
              checked={marcaAutos.includes("Citroen")}
              onChange={() => handleMarcaAutoChange("Citroen")}
            />
            <label>Citroen</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Fiat"
              checked={marcaAutos.includes("Fiat")}
              onChange={() => handleMarcaAutoChange("Fiat")}
            />
            <label>Fiat</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Ford"
              checked={marcaAutos.includes("Ford")}
              onChange={() => handleMarcaAutoChange("Ford")}
            />
            <label>Ford</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="MercedezBenz"
              checked={marcaAutos.includes("MercedezBenz")}
              onChange={() => handleMarcaAutoChange("MercedezBenz")}
            />
            <label>Mercedez Benz</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Peugot"
              checked={marcaAutos.includes("Peugot")}
              onChange={() => handleMarcaAutoChange("Peugot")}
            />
            <label>Peugot</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Renault"
              checked={marcaAutos.includes("Renault")}
              onChange={() => handleMarcaAutoChange("Renault")}
            />
            <label>Renault</label>
          </li>
          <li  className='checkbox' >
            <input
 
              type="checkbox"
              value="Suzuki"
              checked={marcaAutos.includes("Suzuki")}
              onChange={() => handleMarcaAutoChange("Suzuki")}
            />
            <label>Suzuki</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Toyota"
              checked={marcaAutos.includes("Toyota")}
              onChange={() => handleMarcaAutoChange("Toyota")}
            />
            <label>Toyota</label>
          </li>
          <li className='checkbox'>
            <input
            
              type="checkbox"
              value="Volskwagen"
              checked={marcaAutos.includes("Volskwagen")}
              onChange={() => handleMarcaAutoChange("Volskwagen")}
            />
            <label>Volskwagen</label>
          </li>

         
        </ul>
        </div>
        
        {selectedMarcasModels.length > 0 && (
        <div>
          <h3>Modelos:</h3>
          {selectedMarcasModels.map(({ marca, models }, index) => (
            <div key={index}>
              <ul className="checkbox-list">
                {models.map((model, modelIndex) => (
                     <li key={modelIndex} className='checkbox'>
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
          ))}
        </div>
      )}
      <div style={{ display: 'flex' }}>
      <button className='buscar4' onClick={()=>{writeData()}}> Agregar</button>

      <button className='buscar4' onClick={()=>{setAplicacion(null)}}>Cerrar</button>
      </div>
    </div>
  </div>
    </>
  )
}

export default NuevaAplicacion