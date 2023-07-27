import { db } from '../firebase';
import { uid } from 'uid';
import { set, ref, onValue, update, get, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import 'firebase/database';
import Link from 'next/link';
import Navbar from '@/components/Navbarbautista';
import Image from 'next/image';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // const [modelo, setModelo] = useState("")
  const [codigo1, setCodigo1] = useState('');
  const [codigo2, setCodigo2] = useState("")
  const [codigo3, setCodigo3] = useState("")
  const [medidas, setMedidas] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [marca, setMarca] = useState('');
  const [familia,setFamilia] = useState('')
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
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

  const handleMedidas = (e) => {
    setMedidas(e.target.value);
  };

  const handlePrecio = (e) => {
    setPrecio(e.target.value);
  };

  const handleMarca = (e) => {
    setMarca(e.target.value);
  };
  const handleFamilia = (e) => {
    setFamilia(e.target.value);
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


  // filtrar producto
  // const handleCategoryChange = (e) => {
  //   setSelectedCategory(e.target.value);
  // };

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
          setCodigo2('')
          setCodigo3('')
          setAltura('')
          setExterior('')
          setInterior('')
          setImagen('')
          setFamilia('')
          setDescripcion('')
          setPrecio('')
          setMarca('')
          setStock('')
      } else {
        set(ref(db, 'rulemanes/' + ` ${codigo1}/` + `${marca}`), {
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
          setCodigo2('')
          setCodigo3('')
          setAltura('')
          setExterior('')
          setFamilia('')
          setInterior('')
          setImagen('')
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

  const actualizarEconomica = () => {
    const dbRef = ref(db, '/rulemanes/ 6306 2RS/Economica');
    const nuevosValores = {
      interior:"30",
      exterior:"72",
      altura:"19",
    };

    update(dbRef, nuevosValores)
      .then(() => {
        alert('Valores actualizados correctamente.');
      })
      .catch((error) => {
        console.error('Error al actualizar los valores:', error);
      });
  };

  // const actualizarHCH = () => {
  //   const dbRef = ref(db, '/rulemanes/ 6306 2RS/HCH');
  //   const nuevosValores = {
  //     interior:"17",
  //     exterior:"47",
  //     altura:47"
  //   };

  //   update(dbRef, nuevosValores)
  //     .then(() => {
  //       alert('Valores actualizados correctamente.');
  //     })
  //     .catch((error) => {
  //       console.error('Error al actualizar los valores:', error);
  //     });
  // };
  const actualizarNSK = () => {
    const dbRef = ref(db, '/rulemanes/ 6306 2RS/NSK-NTN');
    const nuevosValores = {
      interior:"30",
      exterior:"72",
      altura:"19",
    };

    update(dbRef, nuevosValores)
      .then(() => {
        alert('Valores actualizados correctamente.');
      })
      .catch((error) => {
        console.error('Error al actualizar los valores:', error);
      });
  };
  const actualizarSKF = () => {
    const dbRef = ref(db, '/rulemanes/ 6306 2RS/SKF');
    const nuevosValores = {
      interior:"30",
      exterior:"72",
      altura:"19",
    };

    update(dbRef, nuevosValores)
      .then(() => {
        alert('Valores actualizados correctamente.');
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
          <span> Precio</span>
        <input
          type="text"
          placeholder="Precio"
          value={precio}
          onChange={handlePrecio}
        />
          </div>
        <div className='contenedor-input'> 
          <span> Stock </span>
          <select
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="Disponible">Disponible</option>
                            <option value="No disponible">No disponible</option>
                            <option value="Consultar">Consultar</option>
                          </select>
          </div>

          <div className='contenedor-input'> 
          <span> Marca:</span>
          <select
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="Economica">IMPORTADA</option>
                            <option value="HCH">HCH</option>
                            <option value="NSK-NTN">NSK-NTN</option>
                            <option value="SKF">SKF</option>
                            <option value="INA">INA</option>
                            {/* <option value="DOLZ">DOLZ</option> */}
                            <option value="DAYCO">DAYCO</option>
                            <option value="DBH">DBH</option>
                            <option value="CORTECO">CORTECO</option>
                            <option value="TIMKEN">TIMKEN</option>
                          </select>
          </div>


          <div className='contenedor-input'> 
          <span> Imagen Marca </span>
          <select
                            value={imagen}
                            onChange={(e) => setImagen(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="eco">IMPORTADA</option>
                            <option value="hchLogo">HCH</option>
                            <option value="nskLogo">NSK-NTN</option>
                            <option value="skfLogo">SKF</option>
                            <option value="dbhLogo">DBH</option>
                            <option value="cortecoLogo2">CORTECO</option>
                            <option value="timkenLogo2">TIMKEN</option>
                            <option value="inaLogo">INA</option>
                          </select>
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
        
        
     
      
      <button className='button-31' onClick={writeData}> Crear Producto </button>
      </div>
      </div>

      {/* {rulemanes.map( ruleman=>(
        <h1 key={ruleman.uuid}> {ruleman.altura}</h1>
      ))} */} 
    </div>
  );
}
