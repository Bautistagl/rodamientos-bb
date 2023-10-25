import React, { useEffect, useState } from 'react';
import { db } from '@/firebasebautista';
import { get, ref } from 'firebase/database';

import NavPedidos from './NavPedidos';
import NavDetalles from './NavDetalles';

const PantallaPedidos = ({ usuario }) => {
  const [pedidosData, setPedidosData] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const verDetallesPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  };

  const cerrarDetallesPedido = () => {
    setPedidoSeleccionado(null);
    setModalVisible(false);
  };

  useEffect(() => {
    mostrarPedidos();
   
  }, [pedidosData]);

  const mostrarPedidos = async () => {
    try {
      const pedidosSnapshot = await get(
        ref(db, 'usuarios/' + `${usuario}` + '/pedidos')
      );

      if (pedidosSnapshot.exists()) {
        const pedidosData = pedidosSnapshot.val();
        const pedidos = Object.values(pedidosData);

        setPedidosData(pedidos);
      } else {
        setPedidosData([]);
      }
    } catch (error) {
      console.log('Error al obtener los pedidos:', error);
    }
  };

  return (
    <div className="pedidosScreen">
      <h2 style={{ color: 'black' }}>Mis pedidos:</h2>

      {modalVisible && pedidoSeleccionado ? (
        // Mostrar detalles del pedido seleccionado en un modal o componente
        <div>
          <h3>Detalles del Pedido</h3>
          <h3>Fecha: <span style={{fontWeight:'bold'}}> {pedidoSeleccionado.fecha} </span> </h3>
          <h3>Total del Pedido: <span style={{fontWeight:'bold'}}> ${pedidoSeleccionado.total} </span></h3>
          <h4>Resumen:</h4>
          <NavDetalles/>
          <ul style={{padding:'0px'}}>
            {pedidoSeleccionado.productos.map((producto, index) => (

              <div className='detallesPedido'  key={index}>
              <li>{producto.codigo1} </li>
              <li>{producto.marca}</li>
              <li>{producto.cantidades}</li>
              <li>${(producto.precio*producto.cantidades).toFixed(2)}</li>
              </div>
            ))}
          </ul>
          <button onClick={cerrarDetallesPedido}>Cerrar</button>
        </div>
      ) : (
        <div>
          {pedidosData.length > 0 ? (
            <ul style={{padding:'0'}} className="ul-pedidos">
              <div className="pedido-header">
                <NavPedidos/>
              </div>
              {pedidosData.map((pedido, index) => (
                <div key={index}>
                  <div className="pedido-data">
                    <p>{index + 1}</p>
                    <p>{pedido.fecha}</p>
                    <p> {pedido.productos.length}</p>
                    <p> ${pedido.total}</p>
                    <button onClick={() => verDetallesPedido(pedido)}>Ver detalles</button>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PantallaPedidos;