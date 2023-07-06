import {db} from '../firebase'
import {uid} from 'uid'
import { set,ref, onValue,update } from 'firebase/database'
import { useState,useEffect } from 'react'


import "firebase/database";
import Link from 'next/link';


export default function Home() {

  const [selectedCategory, setSelectedCategory] = useState("");

  // const [modelo, setModelo] = useState("")
  const [codigo1, setCodigo1] = useState("")
  // const [codigo2, setCodigo2] = useState("")
  // const [codigo3, setCodigo3] = useState("")
  const [medidas, setMedidas] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [marca, setMarca] = useState("")
  const [stock, setStock] = useState("")
  const [imagen, setImagen] = useState("")
  const [rulemanes, setRulemanes] = useState([])

//   const handleModelo =(e) =>{
//     setModelo(e.target.value)
// }
const handleCodigo1 =(e) =>{
  setCodigo1(e.target.value)
}
// const handleCodigo2 =(e) =>{
//   setCodigo2(e.target.value)
// }
// const handleCodigo3 =(e) =>{
//   setCodigo3(e.target.value)
// }

const handleMedidas=(e) =>{
  setMedidas(e.target.value)
}

const handlePrecio=(e) =>{
  setPrecio(e.target.value)
}
const handleMarca=(e) =>{
  setMarca(e.target.value)
}
const handleDescripcion=(e) =>{
  setDescripcion(e.target.value)
}
const handleStock=(e) =>{
  setStock(e.target.value)
}
const handleImagen=(e) =>{
  setImagen(e.target.value)
}   
// filtrar producto
const handleCategoryChange = (e) => {
  setSelectedCategory(e.target.value);
};

//write
const writeData = () => {

  const uuid = uid()
 
  set(ref(db,'rulemanes/' +` ${codigo1}/`+ `${marca}` ),{
    
    uuid,
    // modelo,
    codigo1,
    // codigo2,
    // codigo3,
    medidas,
    descripcion,
    precio,
    marca,
    stock,
    imagen,

  
  })
  .catch( function(){
    
    console.log('no se puede')
  }) 
  
}

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
useEffect(()=>{
  
  onValue(ref(db), snapshot => {
    const data= snapshot.val()
    if(data !==null){
      const filteredRulemanes = Object.values(data).filter((ruleman) =>
        selectedCategory ? ruleman.category === selectedCategory : true
      );
      setRulemanes(...filteredRulemanes);
      
    }
  })
}, [selectedCategory])

//update

//delete


  return (
    <>
    <Link href='/busqueda'>
    <button className='boton-busqueda'> Buscar productos </button>
    </Link>
    <button onClick={actualizarValores}> Actualizar valores</button>
    <Link href='/barraBusqueda'>
    <button className='boton-busqueda'> Barra productos </button>
    </Link>
    <select value={selectedCategory} onChange={handleCategoryChange}>
  <option value="">All Categories</option>
  <option value="category1" >Category 1</option>
  <option value="category2">Category 2</option>
  <option value="category3">Category 3</option>
  {/* Add more options as needed */}
</select>
      <div className='inputs'>

      {/* <input type='text' placeholder='modelo' value={modelo} onChange={handleModelo}/> */}
      <input type='text' placeholder='codigo1' value={codigo1} onChange={handleCodigo1}/>
      {/* <input type='text' placeholder='codigo2' value={codigo2} onChange={handleCodigo2}/>
      <input type='text' placeholder='codigo3' value={codigo3} onChange={handleCodigo3}/> */}
      <input type='text' placeholder='medidas' value={medidas} onChange={handleMedidas}/>
      <input type='text' placeholder='descripcion' value={descripcion} onChange={handleDescripcion}/>
      <input type='text' placeholder='precio' value={precio} onChange={handlePrecio}/>
      <input type='text' placeholder='stock' value={stock} onChange={handleStock}/>
      <input type='text' placeholder='marca' value={marca} onChange={handleMarca}/>
      <input type='text' placeholder='imagen' value={imagen} onChange={handleImagen}/>
      </div>
      
      <button onClick={writeData}> submit </button>
      {/* {rulemanes.map( ruleman=>(
        <h1 key={ruleman.uuid}> {ruleman.altura}</h1>
      ))} */}
    </>
  )
}
