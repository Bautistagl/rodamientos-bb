import Link from 'next/link';
import React from 'react';

const NavCsv = () => {
  return (
    <div className="navCarrito">
      <span>Estado </span>
      <span>Archivo</span>
      <p>
        {' '}
        <Link href="actualizarCsv2"> Actualizar con CSV </Link>
      </p>
      <p>
        {' '}
        <Link href="eliminarCsv2"> Eliminar con CSV </Link>
      </p>
    </div>
  );
};

export default NavCsv;
