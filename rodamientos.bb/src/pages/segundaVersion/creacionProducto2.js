import { db } from '../../firebase';
import { uid } from 'uid';
import { set, ref, onValue, update, get, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import 'firebase/database';

import Navbar from '@/components/Navbarbautista';


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // const [modelo, setModelo] = useState("")
  const [codigo1, setCodigo1] = useState('');
  const [codigo2, setCodigo2] = useState("")
  const [codigo3, setCodigo3] = useState("")
  const [descripcion, setDescripcion] = useState('');
  const [familia,setFamilia] = useState('')
  const [altura, setAltura] = useState('');
  const [exterior, setExterior] = useState('');
  const [interior, setInterior] = useState('');
  const [marcaAuto,setMarcaAuto] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const [modelo,setModelo] = useState([])
  const [rulemanes, setRulemanes] = useState([]);
  const [admin, setAdmin] =useState('')
  const [ubicaciones, setUbicaciones] = useState([]);
  const [marcaAutos, setMarcaAutos] = useState([]);

  //   const handleModelo =(e) =>{
  //     setModelo(e.target.value)
  // }
 const handleUbicacionChange = (value) => {
  const sanitizedValue = String(value).replace(/[.#$/[\]]/g, '_'); // Convert to string and replace invalid characters
  const isSelected = ubicaciones.includes(sanitizedValue);
  if (isSelected) {
    setUbicaciones(ubicaciones.filter(item => item !== sanitizedValue));
  } else {
    setUbicaciones([...ubicaciones, sanitizedValue]);
  }
};

const handleMarcaAutoChange = (value) => {
  const sanitizedValue = String(value).replace(/[.#$/[\]]/g, '_'); // Convert to string and replace invalid characters
  const isSelected = marcaAutos.includes(sanitizedValue);
  if (isSelected) {
    setMarcaAutos(marcaAutos.filter(item => item !== sanitizedValue));
  } else {
    setMarcaAutos([...marcaAutos, sanitizedValue]);
  }
};

  const handleCodigo2 =(e) =>{
    const valor = e.target.value
    setCodigo2(valor.toUpperCase())
  }
  const handleCodigo3 =(e) =>{
    const valor = e.target.value
    setCodigo3(valor.toUpperCase())
  }
  const handleCodigo1 = (e) => {
    const valor = e.target.value
    setCodigo1(valor.toUpperCase());
  };
  const handleMarcaAuto = (e) => {
    const valores = e.target.value.toUpperCase().split(',').map((valor) => valor.trim());
    setMarcaAuto(valores);
  };
  const handleModelo = (e) => {
    const valores = e.target.value.toUpperCase().split(',').map((valor) => valor.trim());
    setModelo(valores);
  };
  // const handleUbicacion = (e) => {
    
  //   setUbicacion(valores);
  // };



  const handleDescripcion = (e) => {
    setDescripcion(e.target.value);
  };


  const handleAltura = (e) => {
     setAltura(e.target.value);
 }

  const handleExterior = (e) => {
  setExterior(e.target.value);
}

  const handleInterior = (e) => {
  setInterior(e.target.value);
}
function escapeFirebasePath(path) {
  return path.replace(/[.#$/\[\]]/g, '_');
}



  //write
  const writeData = () => {
    const uuid = uid();

const dbRef = ref(db)
    get(child(dbRef,'productos/' + ` ${codigo1}/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        Swal.fire({
          title: 'Error',
          text: 'El producto ya existe.',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
          setCodigo1('')
          setCodigo2('')
          setCodigo3('')
          setAltura('')
          setExterior('')
          setInterior('')
          setFamilia('')
          setDescripcion('')
        
      } else {
        set(ref(db, 'productos/' + ` ${codigo1}/`), {
          uuid,
          // modelo,
          codigo1,
          codigo2,
          codigo3,
          altura,
          familia,
          exterior,
          interior,
          descripcion,
          marcaAutos,
          ubicaciones,
          modelo,
        
         
        })
        .then(() => {
          Swal.fire({
            title: 'Producto Creado',
            icon:'success',
            timer: 1000, // 3 segundos
            timerProgressBar: true,
            showConfirmButton: false
          })
          setCodigo1('')
          setCodigo2('')
          setCodigo3('')
          setAltura('')
          setExterior('')
          setFamilia('')
          setInterior('')
          setDescripcion('')
      
        })
        
        .catch(function () {
          console.log('no se puede');
        });
      }
    })
  };



 

  //read
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const filteredRulemanes = Object.values(data).filter((ruleman) =>
          selectedCategory ? ruleman.category === selectedCategory : true
        );
        setRulemanes(...filteredRulemanes);
      }
    });

    setAdmin(window.localStorage.getItem('email'))
  }, [selectedCategory]);

  //update

  //delete

  return (
    <div className='creacion-fondo'>

       <Navbar/>
      <div className='contenedor-principal-inputs'>
        <h1> Nuevo producto</h1>
      
      <div className="inputs">

        <div className='contenedor-input'> 
          <span> Codigo Principal:</span>
        <input
          type="text"
          placeholder="Codigo1"
          value={codigo1}
          onChange={handleCodigo1}
        />
        </div>

        <div className='contenedor-input'> 
          <span> Codigo 2:</span>
        <input
          type="text"
          placeholder="Codigo2"
          value={codigo2}
          onChange={handleCodigo2}
        />
        </div>

        <div className='contenedor-input'> 
          <span> Codigo 3:</span>
        <input
          type="text"
          placeholder="Codigo3"
          value={codigo3}
          onChange={handleCodigo3}
        />
        </div>
   
      
        <div className='contenedor-input'> 
          <span> Descripcion:</span>
        <input
          type="text"
          placeholder="Descripcion"
          value={descripcion}
          onChange={handleDescripcion}
        />
          </div>
       
        
          <div className='contenedor-input'> 
          <span> Familia:</span>
          <select
                            value={familia}
                            onChange={(e) => setFamilia(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="Reten">Reten</option>
                            <option value="Rodamientos">Rodamientos</option>
                            <option value="CORREAS">Correas</option>
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
  


          <div className='contenedor-input'> 
        <span> Interior:</span> 
        <input
          type="text"
          placeholder="Interior"
          value={interior}
          onChange={handleInterior}
        />
        </div>

        <div className='contenedor-input'> 
          <span>  Exterior:</span>
        <input
          type="text"
          placeholder="Exterior"
          value={exterior}
          onChange={handleExterior}
        />
        </div>
        <div className='contenedor-input'> 
        <span>
          Altura:
        </span>
        <input
          type="text"
          placeholder="Altura"
          value={altura}
          onChange={handleAltura}
        />
        </div>
        <div className='contenedor-input'> 
        <span>
          Ubicación:
        </span>
        <ul>
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

         
        </ul>
       
        </div>
        <div className='contenedor-input'> 
        <span>
          Marca Auto:
        </span>
        <ul>
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
              value="Mercedez Benz"
              checked={marcaAutos.includes("Mercedez Benz")}
              onChange={() => handleMarcaAutoChange("Mercedez Benz")}
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
        <div className='contenedor-input'> 
        <span>
          Modelos:
        </span>
        <input
          type="text"
          placeholder="Modelo"
          value={modelo}
          onChange={handleModelo}
        />
        </div>
        
        
     
      
      <button className='button-31' onClick={writeData}> Crear Producto </button>
      </div>
      </div>

      {/* {rulemanes.map( ruleman=>(
        <h1 key={ruleman.uuid}> {ruleman.altura}</h1>
      ))} */} 
    </div>
  );
}
