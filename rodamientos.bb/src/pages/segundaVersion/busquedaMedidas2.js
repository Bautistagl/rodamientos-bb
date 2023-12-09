import { useState, useEffect } from 'react';

import { db,auth } from '../../firebase';
import 'firebase/database';
import { ref, get, child,update } from 'firebase/database';
import Image from 'next/image';
import Swal from 'sweetalert2'

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';


export default function BusquedaAltura() {
  const [searchAltura, setSearchAltura] = useState(null);
  const [searchExterior, setSearchExterior] = useState(null);
  const [searchInterior, setSearchInterior] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]); 
  const [user, setUser] =useState(null)
  const [rol,setRol] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [usuario,setUsuario] = useState('')
  const [admin, setAdmin] = useState('');
  const [abierto,setAbierto] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidad, setCantidad] = useState(null)



  const usuarioRef = ref(db, 'usuarios');

 
  


  const handleClickAgregar = (producto) => {
    setSelectedProduct(producto);
    setAbierto(true);
  };
  
  // AGREGAR PRODUCTO, RECIBE OBJETO PRODUCTO Y CANTIDAD
  const agregarProducto = async (producto,cantidades,usuario,marca,descripcion) => {
    const {codigo1, precio } = producto
    try {
      const snapshot = await get(ref(db, 'usuarios/'+ `${usuario}`+'/carrito/' + codigo1 + '' + marca));
      
      if (snapshot.exists()) {

        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,  
        };
        if (descripcion) {
          productoEnCarrito.descripcion = descripcion;
        }


        update(ref(db, 'usuarios/'+ `${usuario}`+'/carrito/' + codigo1 + '' + marca), productoEnCarrito);

       } else {
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,    
        };
        if (descripcion) {
          productoEnCarrito.descripcion = descripcion;
        }
  
        update(ref(db, 'usuarios/'+ `${usuario}`+'/carrito/' + codigo1 + '' + marca), productoEnCarrito);
   
      }
      
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Producto agregado',
      showConfirmButton: false,
      timer:1000,
    
      
      
    })
    setCantidad(0)
    setAbierto(false)
    

}
catch (error) {
  console.log('Error al agregar el producto al carrito:', error);
}
};

  useEffect(() => {
    
    const productosRef = ref(db, 'productos'); // Ruta de los productos en la base de datos
    // Obtiene los datos del catálogo desde la base de datos
    const getCatalogData = async () => {
      await get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const productos = snapshot.val();
            setCatalogData(productos);
          } else {
            console.log('No se encontraron productos en la rama especificada');
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Debe iniciar sesión para ver los productos',
            
            footer: '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>'
          })
        });

      //   setCatalogData(snapshot.val());
    };
    const id = localStorage.getItem('idRodamientos')
    if(id){
      setUsuario(id)
    }
    else{
      alert('nadie logeado')
    }
    if ( window.localStorage.getItem('email')) {
      const adminData = JSON.parse(window.localStorage.getItem('email'))
      if(adminData) {
    
        setAdmin(adminData.email);
      }
    }

    getCatalogData();
    
  }, []);

  const handleSearch = () => {
   

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(searchAltura,searchInterior,searchExterior);
    const first30 = results.slice(0,50)
    
    setSearchResults(first30);
  };

  const searchProducts = (altura, interior, exterior) => {
    if (!catalogData || (altura === null && interior === null && exterior === null)) {
      return [];
    }
  
    const results = [];
  
    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];
  
      // Busca en cada propiedad del producto
    
        var filtroAltura = product.altura;
        var filtroExterior = product.exterior;
        var filtroInterior = product.interior;
  
        // Filtra los resultados
        if (altura && interior && exterior) {
          if (filtroAltura === altura && filtroExterior === exterior && filtroInterior === interior) {
            results.push(product);
          }
        } else if (altura && interior) {
          if (filtroAltura === altura && filtroInterior === interior) {
            results.push(product);
          }
        } else if (altura && exterior) {
          if (filtroAltura === altura && filtroExterior === exterior) {
            results.push(product);
          }
        } else if (interior && exterior) {
          if (filtroInterior === interior && filtroExterior === exterior) {
            results.push(product);
          }
        } else if (altura) {
          if (filtroAltura === altura) {
            results.push(product);
          }
        } else if (interior) {
          if (filtroInterior === interior) {
            results.push(product);
          }
        } else if (exterior) {
          if (filtroExterior === exterior) {
            results.push(product);
          }
        }
      });
    
  
    return results;
  };



  
  

  return (
    <>
    <div>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</>
        <div className='botones-busqueda'>
        <button className='button-30'><Link href='/busquedaCodigo'> BUSCAR POR CODIGO </Link></button>
        <button className='button-30'><Link href='/busquedaDescripcion'> BUSCAR POR DESCRIPCION </Link></button>
     

</div>
      
        <div className="barra-busqueda">
          {/* <span>Buscar producto por código:</span> */}
          <div style={{display:'flex',flexDirection:'column'}}> 

            <label>Interior</label>
               <input
            className="input-busqueda2"
            type="text"
            value={searchInterior}
            onChange={(e) => setSearchInterior(e.target.value)}
           
          />
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            
          <label>Exterior</label>
            <input
            className="input-busqueda2"
            type="text"
            value={searchExterior}
            onChange={(e) => setSearchExterior(e.target.value)}
            
          />
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>

           <label>Altura</label>
          <input
            className="input-busqueda2"
            type="text"
            value={searchAltura}
            onChange={(e) => setSearchAltura(e.target.value)}
            
          />
          </div>
       
        </div>
        <button className='button-31' onClick={()=>{handleSearch()}}> BUSCAR </button>

        {Object.keys(searchResults).map((codigo1, index) => (
          <div className="contenedor-cards" key={index}>
            <Image
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: '20px',
              }}
              alt=""
              src="/rodamiento.webp"
              width={200}
              height={200}
            />
            <div className="textos-completo2">
              <div className="codigo-medidas2">
                <div className="titulo-singular2">{searchResults[codigo1].codigo1}</div>
                <div className="medidas">
                <div className="titulo-singular2">{searchResults[codigo1].codigo2}</div>
                <div className="titulo-singular2">{searchResults[codigo1].codigo3}</div>
                  <span>
                    Interior: {searchResults[codigo1].interior} mm
                  </span>
                  <span>
                    Exterior: {searchResults[codigo1].exterior} mm
                  </span>
                  <span>Altura: {searchResults[codigo1].altura} mm</span>
                </div>
              </div>
              <div className="contenedor-propiedades3">
                <div className="propiedades-principales2">
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/tag.png"
                      width={40}
                      height={40}
                    />
                    MARCA
                  </span>
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/iconoPlata.png"
                      width={40}
                      height={40}
                    />{' '}
                    PRECIO
                  </span>
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/stock.png"
                      width={30}
                      height={30}
                    />
                    STOCK
                  </span>
                </div>

                {searchResults[codigo1].marcas && Object.values(searchResults[codigo1].marcas).map((producto, marcaIndex) => (
                  <div className="propiedades2" key={marcaIndex}>
                    <Image
                      style={{ marginRight: '100px' }}
                      alt=""
                      src={
                        producto.imagen === ''
                          ? '/TEST.jpg'
                          : `/${producto.marca}.png`
                      }
                      width={100}
                      height={25}
                    />

                    <span className="span-1">${producto.precio}</span>
                    {/* <span
                      className="span-2"
                      style={{
                        fontWeight:'bold',
                        color:
                          producto.stock === 'Disponible'
                            ? 'green'
                            : producto.stock === 'No disponible'
                            ? 'red'
                            : 'rgb(215, 215, 58)',
                      }}>
                       { producto.stock ? (producto.stock).toUpperCase() : ''}
                    </span> */}
                    <span className='span-3'> {producto.descripcion} </span>
                    {admin === 'rodamientosbb@admin.com' ? <button onClick={() => handleClickAgregar(producto)}>AGREGAR</button>  :''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {abierto ? (
        <PopUp usuario={usuario} agregarProducto={agregarProducto} producto={selectedProduct} 
          setAbierto={setAbierto} abierto={abierto} cantidad={cantidad} setCantidad={setCantidad}  />
      ) : null}
    </>
  );
}
