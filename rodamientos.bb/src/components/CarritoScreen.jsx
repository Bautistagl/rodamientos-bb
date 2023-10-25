
import { db } from '@/firebasebautista';
import { get, push, ref, remove, set } from 'firebase/database';
import moment from 'moment'
import React, { useEffect, useState } from 'react';

import NavCarrito from './NavCarrito';

const CarritosScreen = () => {
  const [catalogData, setCatalogData] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [usuario,setUsuario] =useState('')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [idPedido, setIdPedido] = useState('')



  const carritoRef = ref(db, 'usuarios/' + `${usuario}` + '/carrito');




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
    remove(ref(db, 'usuarios/'+ `${usuario}`+'/carrito/' + codigo1 + '' + marca),{
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
          totaCarrito += producto.precio * producto.cantidad;
        });
  
        setTotalCarrito(totaCarrito);
      
      } else {
        setTotalCarrito(0);
      }
    } catch (error) {
      console.log('Error al leer los productos del carrito:', error);
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
        const pedidosRef = ref(db, 'usuarios/'+ `${usuario}`+'/pedidos');
        const newPedidoRef = push(pedidosRef);
        const nuevoPedidoID = newPedidoRef.key;
        setIdPedido(nuevoPedidoID)
        pedido.id = nuevoPedidoID;
        await set(newPedidoRef, pedido);
  
        
      
  
      
  
        // Borra los productos del carrito después de finalizar la compra
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
              <span style={{fontSize:'0.9rem',maxWidth:'12vw'}} > {productos.descripcion ? `${productos.descripcion}`:''}</span>
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

    <textarea  placeholder='Comentarios'></textarea>
    <button onClick={()=>{finalizarCompra()}}> Realizar pedido</button>
    </div>
    <span style={{opacity:'0'}}>.</span>
    
  </div>
  );
};

export default CarritosScreen;