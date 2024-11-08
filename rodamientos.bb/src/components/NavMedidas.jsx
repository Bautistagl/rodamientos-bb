import Link from "next/link"

const NavMedida = () => {
    return (
      <div className="search-nav">
        <Link href="busquedaCodigo2" className="search-nav-button">
          Buscar por Codigo
        </Link>
        <Link href="busquedaAplicacion" className="search-nav-button">
          Buscar por Aplicacion
        </Link>
      </div>
    );
  }
  
  export default NavMedida