import { db } from '@/firebasebautista';
import { child, get, ref, set } from 'firebase/database';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

const NuevaMarca = ({producto,setNuevaMarca}) => {
    const [marca,setMarca] = useState('')
    const [precio,setPrecio] = useState('')
    const [stock,setStock] = useState('')

    const dbRef = ref(db, `/productos/ ${producto.codigo1}/marcas/${marca}`);
    const dbRef2 = ref(db)
    const writeData = () => {
      let codigo = producto.codigo1;
      if (codigo.includes("POL")) {
        codigo = codigo.replace("POL", "Pol");
      } else if (codigo.includes("VIT")) {
        codigo = codigo.replace("VIT", "Vit");
      }
        get(child(dbRef2,'productos/' + ` ${codigo}/marcas/${marca}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            Swal.fire({
              title: 'Error',
              text: 'La marca ya existe.',
              icon: 'error',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
              setMarca('')
              setPrecio('')
              setStock('')
              
            
          } else {
            set(ref(db,'productos/' + ` ${codigo}/marcas/${marca}`), {
             marca:marca,
             precio:precio,
             stock:stock,
            
             
            })
            .then(() => {
              Swal.fire({
                title: 'Producto Creado',
                icon:'success',
                timer: 1000, // 3 segundos
                timerProgressBar: true,
                showConfirmButton: false
              })
              setMarca('')
              setPrecio('')
              setStock('')
              setNuevaMarca(null)
          
            })
            
            .catch(function () {
              console.log('no se puede');
            });
          }
        })
      };

  return (
    <>
    {/* <div className='nuevaMarca'>
        <input onChange={(e) => setMarca(e.target.value)} placeholder='marca' />
        <input onChange={(e) => setPrecio(e.target.value)} placeholder='precio'/>
        <input onChange={(e) => setStock(e.target.value)} placeholder='stock'/>
        <button onClick={()=>{writeData()}}> Agregar</button>
        <button onClick={()=>{setNuevaMarca(null)}}>Cerrar</button>
    </div> */}
    <div className="popUp">
    <div className="textos-popUp">
      <h1>
        {' '}
       Agregar nueva marca de {producto.codigo1}{' '}
      </h1>
      <select
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="AYS">AYS</option>
                            <option value="Economica">Economica</option>
          <option value="HCH">HCH</option>
          <option value="NSK-NTN">NSK</option>
          <option value="NTN">NTN</option>
          <option value="SKF">SKF</option>
          <option value="INA">INA</option>
          <option value="DOLZ">DOLZ</option>
          <option value="DAYCO">DAYCO</option>
          <option value="DBH">DBH</option>
          <option value="CORTECO">CORTECO</option>
          <option value="TIMKEN">TIMKEN</option>
                          </select>
      <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder='precio'/>
      <select
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}>
                            <option value="" disabled selected>
                              Seleccionar
                            </option>
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="No disponible">No disponible</option>
                            <option value="Consultar">Consultar</option>
                          </select>

      <div style={{ display: 'flex' }}>
      <button onClick={()=>{writeData()}}> Agregar</button>

      <button onClick={()=>{setNuevaMarca(null)}}>Cerrar</button>
      </div>
    </div>
  </div>
    </>
  )
}

export default NuevaMarca