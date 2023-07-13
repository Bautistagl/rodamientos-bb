import { db } from '../firebase';
import { uid } from 'uid';
import { set, ref, onValue, update, get, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import 'firebase/database';
import Link from 'next/link';
import Navbar from '@/components/Navbarbautista';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // const [modelo, setModelo] = useState("")
  const [codigo1, setCodigo1] = useState('');
  // const [codigo2, setCodigo2] = useState("")
  // const [codigo3, setCodigo3] = useState("")
  const [medidas, setMedidas] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [marca, setMarca] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [altura, setAltura] = useState('');
  const [exterior, setExterior] = useState('');
  const [interior, setInterior] = useState('');
  const [rulemanes, setRulemanes] = useState([]);

  //   const handleModelo =(e) =>{
  //     setModelo(e.target.value)
  // }
  // const handleCodigo2 =(e) =>{
  //   setCodigo2(e.target.value)
  // }
  // const handleCodigo3 =(e) =>{
  //   setCodigo3(e.target.value)
  // }
  const handleCodigo1 = (e) => {
    setCodigo1(e.target.value);
  };

  const handleMedidas = (e) => {
    setMedidas(e.target.value);
  };

  const handlePrecio = (e) => {
    setPrecio(e.target.value);
  };

  const handleMarca = (e) => {
    setMarca(e.target.value);
  };

  const handleDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  const handleStock = (e) => {
    setStock(e.target.value);
  };

  const handleImagen = (e) => {
    setImagen(e.target.value);
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


  // filtrar producto
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  //write
  const writeData = () => {
    const uuid = uid();

const dbRef = ref(db)
    get(child(dbRef,'rulemanes/' + ` ${codigo1}/` + `${marca}`))
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
          setAltura('')
          setExterior('')
          setInterior('')
          setDescripcion('')
          setPrecio('')
          setMarca('')
          setStock('')
      } else {
        set(ref(db, 'rulemanes/' + ` ${codigo1}/` + `${marca}`), {
          uuid,
          // modelo,
          codigo1,
          // codigo2,
          // codigo3,
          altura,
          exterior,
          interior,
          descripcion,
          precio,
          marca,
          stock,
          imagen,
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
          setAltura('')
          setExterior('')
          setInterior('')
          setDescripcion('')
          setPrecio('')
          setMarca('')
          setStock('')
        })
        
        .catch(function () {
          console.log('no se puede');
        });
      }
    })
  };

  const actualizarValores = () => {
    const dbRef = ref(db, '/rulemanes/ 629 2RS/HCH');
    const nuevosValores = {
      imagen: 'hchLogo',
    };

    update(dbRef, nuevosValores)
      .then(() => {
        console.log('Valores actualizados correctamente.');
      })
      .catch((error) => {
        console.error('Error al actualizar los valores:', error);
      });
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
  }, [selectedCategory]);

  //update

  //delete

  return (
    <div className='creacion-fondo'>
     
      <Navbar/>
      <div className="inputs">
        {/* <input type='text' placeholder='modelo' value={modelo} onChange={handleModelo}/> */}
        <div className='contenedor-input'> 
          <span> Codigo Principal:</span>
        <input
          type="text"
          placeholder="codigo1"
          value={codigo1}
          onChange={handleCodigo1}
        />
        </div>
   
      
        <div className='contenedor-input'> 
          <span> Descripcion:</span>
        <input
          type="text"
          placeholder="descripcion"
          value={descripcion}
          onChange={handleDescripcion}
        />
          </div>
        <div className='contenedor-input'> 
          <span> Precio</span>
        <input
          type="text"
          placeholder="precio"
          value={precio}
          onChange={handlePrecio}
        />
          </div>
        <div className='contenedor-input'> 
          <span> Stock </span>
        <input
          type="text"
          placeholder="stock"
          value={stock}
          onChange={handleStock}
        />
          </div>
        <div className='contenedor-input'> 
          <span> Marca:</span>
        <input
          type="text"
          placeholder="marca"
          value={marca}
          onChange={handleMarca}
        />
          </div>

        <div className='contenedor-input'> 
        <span>
          Altura:
        </span>
        <input
          type="text"
          placeholder="ALTURA"
          value={altura}
          onChange={handleAltura}
        />
        </div>
        <div className='contenedor-input'> 
        <span> Interior:</span> 
        <input
          type="text"
          placeholder="INTERIOR"
          value={interior}
          onChange={handleInterior}
        />
        </div>
        <div className='contenedor-input'> 
          <span>  Exterior:</span>
        <input
          type="text"
          placeholder="EXTERIOR"
          value={exterior}
          onChange={handleExterior}
        />
        </div>
     
      
      </div>
      <button className='crear-producto' onClick={writeData}> Crear Producto </button>

      {/* {rulemanes.map( ruleman=>(
        <h1 key={ruleman.uuid}> {ruleman.altura}</h1>
      ))} */}
    </div>
  );
}
