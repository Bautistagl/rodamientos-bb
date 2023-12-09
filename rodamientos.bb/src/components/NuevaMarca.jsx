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
    
        get(child(dbRef2,'productos/' + ` ${producto.codigo1}/marcas/${marca}`))
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
              setMarca('')
              setPrecio('')
              setStock('')
              
            
          } else {
            set(ref(db,'productos/' + ` ${producto.codigo1}/marcas/${marca}`), {
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
      <input
        onChange={(e) => setMarca(e.target.value)} placeholder='marca'
      />
      <input onChange={(e) => setPrecio(e.target.value)} placeholder='precio'/>
      <input onChange={(e) => setStock(e.target.value)} placeholder='stock'/>

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