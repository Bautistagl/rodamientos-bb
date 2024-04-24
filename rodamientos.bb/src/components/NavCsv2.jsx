import Link from 'next/link';
import React from 'react';

const NavCsv2 = () => {
  return (
    <div className="navCarrito2">
      <span>
        {' '}
        <Link href="actualizarCsv2"> Actualizar con CSV </Link>
      </span>
      <span>
        {' '}
        <Link href="eliminarCsv2"> Eliminar con CSV </Link>
      </span>
    </div>
  );
};

export default NavCsv2;
