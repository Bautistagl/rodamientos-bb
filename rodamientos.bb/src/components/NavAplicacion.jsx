import Link from "next/link"

const NavAplicacion = () => {
    return (
      <div className="search-nav">
        <Link href="busquedaCodigo2" className="search-nav-button">
          Buscar por Codigo
        </Link>
        <Link href="busquedaMedidas2" className="search-nav-button">
          Buscar por Medida
        </Link>
      </div>
    );
  }
  
  export default NavAplicacion