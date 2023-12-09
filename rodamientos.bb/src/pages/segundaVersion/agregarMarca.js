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
  const [marcaAuto,setMarcaAuto] = useState('')
  const [ubicacion,setUbicacion] = useState('')
  const [modelo,setModelo] = useState('')
  const [descripcion, setDescripcion] = useState('');
  const [familia,setFamilia] = useState('')
  const [altura, setAltura] = useState('');
  const [exterior, setExterior] = useState('');
  const [interior, setInterior] = useState('');
  const [rulemanes, setRulemanes] = useState([]);
  const [admin, setAdmin] =useState('')

  //   const handleModelo =(e) =>{
  //     setModelo(e.target.value)
  // }
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
    const valor = e.target.value
    setMarcaAuto(valor.toUpperCase());
  };
  const handleModelo = (e) => {
    const valor = e.target.value
    setModelo(valor.toUpperCase());
  };
  const handleUbicacion = (e) => {
    const valor = e.target.value
    setUbicacion(valor.toUpperCase());
  };


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
        <input
          type="text"
          placeholder="Ubicacion"
          value={ubicacion}
          onChange={handleUbicacion}
        />
        </div>
        <div className='contenedor-input'> 
        <span>
          Marca Auto:
        </span>
        <input
          type="text"
          placeholder="Marca Auto"
          value={marcaAuto}
          onChange={handleMarcaAuto}
        />
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
