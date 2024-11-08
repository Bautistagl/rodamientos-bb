import Link from 'next/link'
import React from 'react'

const NavCodigo = () => {
  return (
    <div className="search-nav">
      <Link href="busquedaMedidas2" className="search-nav-button">
        Buscar por Medida
      </Link>
      <Link href="busquedaAplicacion" className="search-nav-button">
        Buscar por Aplicacion
      </Link>
    </div>
  );
}

export default NavCodigo