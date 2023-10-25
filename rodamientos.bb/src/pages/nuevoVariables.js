import { db } from '../firebase';
import { uid } from 'uid';
import { set, ref, onValue, update, get, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import 'firebase/database';
import Link from 'next/link';
import Navbar from '@/components/Navbarbautista';
import Image from 'next/image';

export default function NuevoVariables() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // const [modelo, setModelo] = useState("")
  const [codigo1, setCodigo1] = useState('');
  const [marca, setMarca] = useState('');
  const [rulemanes, setRulemanes] = useState([]);
  const [admin, setAdmin] =useState('')
  const [auto,setAuto] = useState('')
  const [modelo,setModelo] = useState('')
  const [ubicacion,setUbicacion] = useState('')

  //   const handleModelo =(e) =>{
  //     setModelo(e.target.value)
  // }

  const handleCodigo1 = (e) => {
    const valor = e.target.value
    setCodigo1(valor.toUpperCase());
  };
  const handleMarca = (e) => {
    const valor = e.target.value
    setMarca(valor.toUpperCase());
  };
  const handleAuto = (e) => {
    const valor = e.target.value
    setAuto(valor.toUpperCase());
  };
  const handleModelo = (e) => {
    const valor = e.target.value
    setModelo(valor.toUpperCase());
  };
  const handleUbicacion = (e) => {
    const valor = e.target.value
    setUbicacion(valor.toUpperCase());
  };

function escapeFirebasePath(path) {
  return path.replace(/[.#$/\[\]]/g, '_');
}


const checkProductExists = async () => {
  const dbRef = ref(db,`rulemanes/ ${codigo1}`);

  const snapshot = await get(dbRef);
  
  return snapshot.exists()
};

const writeData = async () => {


  // Verifica si existe el código principal en la base de datos.
  const productExists = await checkProductExists();
  
  if (productExists) {
    const marcaRef = ref(db, `rulemanes/ ${codigo1}/${marca}`);
    await set(marcaRef, {
      auto:auto,
      modelo:modelo,
      ubicacion:ubicacion,
      marca:marca,
    });
  
    Swal.fire({
      title: 'Producto Creado',
      icon:'success',
      timer: 1000, // 3 segundos
      timerProgressBar: true,
      showConfirmButton: false
    })
    setCodigo1('')
    setMarca('')
    setAuto('')
    setModelo('')
    setUbicacion('')
      return;
    }
    else{

        Swal.fire({
          title: 'Error',
          text: 'El producto no existe.',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
    }



  
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
          <span> Marca:</span>
        <input
          type="text"
          placeholder="Marca"
          value={marca}
          onChange={handleMarca}
        />
        </div>


        <div className='contenedor-input'> 
          <span>Auto:</span>
        <input
          type="text"
          placeholder="Auto"
          value={auto}
          onChange={handleAuto}
        />
        </div>

        
        <div className='contenedor-input'> 
          <span> Modelo:</span>
        <input
          type="text"
          placeholder="Modelo"
          value={modelo}
          onChange={handleModelo}
        />
        </div>
        <div className='contenedor-input'> 
          <span> Ubicacion:</span>
        <input
          type="text"
          placeholder="Ubicacion"
          value={ubicacion}
          onChange={handleUbicacion}
        />
        </div>

      <button className='button-31' onClick={writeData}> Crear Producto </button>
      </div>
      </div>

    <div style={{opacity:'0'}}>.</div>
    </div>
  );
}
