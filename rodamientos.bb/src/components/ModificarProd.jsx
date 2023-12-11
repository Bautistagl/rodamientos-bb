import { db } from '@/firebasebautista';
import { child, get, ref, set, update } from 'firebase/database';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

const ModificarProd = ({producto,setModificar}) => {
    const [altura,setAltura] = useState('')
    const [codigo1,setCodigo1] = useState('')
    const [codigo2,setCodigo2] = useState('')
    const [codigo3,setCodigo3] = useState('')
    const [descripcion,setDescripcion] = useState('')
    const [exterior,setExterior] = useState('')
    const [interior,setInterior] = useState('')
    const [marcaAuto,setMarcaAuto] = useState('')
    const [modelos,setModelos] = useState('')
    const [ubicacion,setUbicacion] = useState('')
    const [familia,setFamilia] = useState('')
    

    const dbRef = ref(db, `/productos/ ${producto.codigo1}`);
    const dbRef2 = ref(db)
    const writeData = () => {
        const updatedData = {
            altura: altura,
            codigo1: codigo1,
            codigo2: codigo2,
            codigo3: codigo3,
            descripcion: descripcion,
            exterior: exterior,
            interior: interior,
            marcaAuto: marcaAuto,
            modelos: modelos,
            ubicacion: ubicacion,
          };
          const filteredData = Object.fromEntries(
            Object.entries(updatedData).filter(([key, value]) => value !== '')
          );
    
        get(child(dbRef2,'productos/' + ` ${producto.codigo1}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            update(ref(db,'productos/' + ` ${producto.codigo1}`),filteredData)
               .then(() => {
                 Swal.fire({
                   title: 'Producto Actualizado',
                   icon:'success',
                   timer: 1000, // 3 segundos
                   timerProgressBar: true,
                   showConfirmButton: false
                 })
                 setModificar(null);
             
               })
               
               .catch(function () {
                 console.log('no se puede');
               });  
              
            
          } else {
           
            console.log('Hubo algun problema')
          
          }
        })
      };

  return (
    <>

    <div className="popUp2">
    <div className="textos-popUp2">
    <h1>
        {' '}
       Modificar  {producto.codigo1}{' '}
      </h1>
      <input onChange={(e) => setCodigo1(e.target.value)} placeholder={`${producto.codigo1}(codigo1)`}/>
      <input onChange={(e) => setCodigo2(e.target.value)} placeholder={`${producto.codigo2}(codigo2)`}/>
      <input onChange={(e) => setCodigo3(e.target.value)} placeholder={`${producto.codigo3}(codigo3)`}/>
      <input onChange={(e) => setDescripcion(e.target.value)} placeholder={`${producto.descripcion}(desc)`}/>
      <select
                            value={producto.familia}
                            onChange={(e) => setFamilia(e.target.value)}>
                            <option value="" disabled selected>
                              Familia
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
      <input
        onChange={(e) => setAltura(e.target.value)} placeholder={`${producto.altura}(altura)`}
      />
      <input onChange={(e) => setInterior(e.target.value)} placeholder={`${producto.interior}(interior)`}/>
      <input onChange={(e) => setExterior(e.target.value)} placeholder={`${producto.exterior}(exterior)`}/>
      <textarea onChange={(e) => setMarcaAuto(e.target.value)} placeholder={`${producto.marcaAuto}(Marcas Auto)`}/>
      <textarea onChange={(e) => setModelos(e.target.value)} placeholder={`${producto.modelo}(Modelos)`}/>
      <textarea onChange={(e) => setUbicacion(e.target.value)} placeholder={`${producto.ubicacion}(Ubicaciones)`}/>

      <div style={{ display: 'flex' }}>
      <button onClick={() => writeData()}>Agregar</button>
      <button onClick={() => setModificar(null)}>Cerrar</button>
      </div>
    </div>
  </div>
    </>
  )
}

export default ModificarProd