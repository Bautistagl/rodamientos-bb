import React, { useState } from 'react'

const PopUp = ({usuario,agregarProducto,producto,marca,precio,setAbierto,abierto,cantidad,setCantidad}) => {
    
  return (
    <div className="popUp">
      <div className="textos-popUp">
        <h1>
          {' '}
          Que cantidad de {producto.codigo1} de {marca.marca} desea agregar?{' '}
        </h1>
        <input
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad"
        />

        <div style={{ display: 'flex' }}>
          <button
            onClick={() => {
              if (producto.descripcion) {
                agregarProducto(
                  producto,
                  cantidad,
                  usuario,
                  marca,
                  producto.descripcion,

                );
              } else {
                agregarProducto(producto, cantidad, usuario, marca,'');
              }
            }}>
            {' '}
            Agregar
          </button>

          <button
            onClick={() => {
              setAbierto(false);
            }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUp