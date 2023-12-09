
import { db } from '@/firebasebautista';
import { get, push, ref, remove, set } from 'firebase/database';
import moment from 'moment'
import React, { useEffect, useState } from 'react';

import NavCarrito from './NavCarrito';
import Swal from 'sweetalert2';
import back from '@/config/axiosbautista';

const CarritosScreen2 = () => {
  const [catalogData, setCatalogData] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [usuario,setUsuario] =useState('')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [idPedido, setIdPedido] = useState('')
  const [comentario,setComentario] =useState('')



  const carritoRef = ref(db, 'usuarios/' + `${usuario}` + '/carrito2');






  const handleComentario =(e) =>{
    const valor = e.target.value
    setComentario(valor)
  }

  const obtenerDatosDelCarrito = async () => {
    try {
      const snapshot = await get(carritoRef);

      if (snapshot.exists()) {
        const carritoData = snapshot.val();
        const prods = Object.values(carritoData);

        setCatalogData(prods);
      } else {
        setCatalogData([])
      }

      // Actualiza el total del carrito
    //   updateTotalCarrito();
    } catch (error) {
      console.log('Error al leer los productos del carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const borrarProducto = (producto) => {
    const { codigo1,marca } = producto
    remove(ref(db, 'usuarios/'+ `${usuario}`+'/carrito2/' + codigo1 + '' + marca),{
    })
  }

  const updateTotalCarrito = async () => {
    try {
      const snapshot = await get(carritoRef);
  
      if (snapshot.exists()) {
        const carritoData = snapshot.val();
        const productosEnCarrito = Object.values(carritoData);
        let totaCarrito = 0;
  
        productosEnCarrito.forEach(producto => {
          totaCarrito += producto.precio * producto.cantidades;
        });
  
        setTotalCarrito(totaCarrito);
      
      } else {
        setTotalCarrito(0);
      }
    } catch (error) {
      console.log('Error al leer los productos del carrito:', error);
    }
  };
  
  const mandarMail = async () => {
    try {
      // Create an array of product information
      const productosEnCarrito = catalogData.map((producto) => ({
        codigo1: producto.codigo1,
        marca: producto.marca,
        descripcion: producto.descripcion,
        cantidad: producto.cantidades,
        precio: producto.precio,
        subtotal: (producto.precio * producto.cantidades).toFixed(2),
      }));
  
      // Prepare the data to be sent in the email
      const data = {
        mail: emailUsuario, 
        nombre: usuario, 
        carrito: productosEnCarrito, 
        comentario:comentario,
        total:totalCarrito,
      };
  
      // Send a POST request with the data
      const response = await back.post('/pedidoAdmin', data);
  
      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Formulario enviado',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.href = '/';
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const finalizarCompra = async () => {
    try {
      const carritoSnapshot = await get(carritoRef);
  
      if (carritoSnapshot.exists()) {
        const carritoData = carritoSnapshot.val();
        const productosEnCarrito = Object.values(carritoData);
        const fechaActual = moment().format('DD/MM/YYYY')
        let totalCarrito = 0;
        productosEnCarrito.forEach(producto => {
          totalCarrito += producto.precio * producto.cantidades;
        });
       

        const pedido = {
          id: '',
          productos: productosEnCarrito,
          total: totalCarrito,  
          fecha: fechaActual,
        };           
  
        // Guarda el pedido en la propiedad 'pedidos' del usuario
        const pedidosRef = ref(db, 'usuarios/'+ `${usuario}`+'/pedidos2');
        const newPedidoRef = push(pedidosRef);
        const nuevoPedidoID = newPedidoRef.key;
        setIdPedido(nuevoPedidoID)
        pedido.id = nuevoPedidoID;
        await set(newPedidoRef, pedido);
  
        
      
  
      
  
        // Borra los productos del carrito después de finalizar la compra
        await  mandarMail()
        await remove(carritoRef);
        updateTotalCarrito();
      } else {
        console.log('No se encontraron productos en el carrito');
      }
    } catch (error) {
      console.log('Error al finalizar la compra:', error);
    }
  };

  

  


  useEffect(() => {
    obtenerDatosDelCarrito();
    updateTotalCarrito()
    const id = localStorage.getItem('idRodamientos')
    const emailU =  localStorage.getItem('email')
    if(id){
      setUsuario(id)
      setEmailUsuario(emailU.email)
    }
    else{
      alert('nadie logeado')
    }
  }, [catalogData]);

 

  return (
    <div >
      
      <span style={{opacity:'0'}}>.</span>
      <NavCarrito/>
    <h2 style={{color:'white'}} >Carrito:</h2>
    {isLoading ? (
      <p>No hay productos en el carrito</p>
    ) : catalogData.length > 0 ? (
     

      <ul className='ul-pedidos2'>
        {catalogData.map((productos, index) => (
           <div key={index} className='card2'>
          <li className='li-prueba-carrito' >
    
            <div className='info-carrito' >
            <span style={{fontWeight:'bold',maxWidth:'12vw'}} className='producto-carrito'> {productos.codigo1}</span>
              <span> {productos.marca} </span>  
              <span style={{fontSize:'0.7rem',maxWidth:'12vw'}} > {productos.descripcion ? `${productos.descripcion}`:''}</span>
               <span> {productos.cantidades} </span>
               <span> ${productos.precio} </span>  
               <span> ${(productos.precio * productos.cantidades).toFixed(2)}</span>
              <button onClick={()=>{borrarProducto(productos)}}>Borrar</button>
            </div>

           
           
        
          </li>
           </div>
        ))}
      </ul>
      
    ) : (
      <h2 style={{display:'flex',margin:'auto', justifyContent:'center', color:'white'}}>No hay productos en el carrito</h2>
    )}
    <div className='boton-textarea'>
      <h2>{totalCarrito}</h2>
    <textarea  
    type="text"
    value={comentario}
    onChange={handleComentario}
    placeholder='Comentarios'></textarea>
    <button onClick={()=>{finalizarCompra()}}> Realizar pedido</button>
    </div>
    <span style={{opacity:'0'}}>.</span>
    
  </div>
  );
};

export default CarritosScreen2;