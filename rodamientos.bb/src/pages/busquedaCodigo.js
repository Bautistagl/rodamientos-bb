import { useState, useEffect } from 'react';

import { db,auth } from '../firebase';
import 'firebase/database';
import { ref, get, child,update, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'
import Image from 'next/image';
import Swal from 'sweetalert2'

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';


export default function BusquedaCodigo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]); 
  const [usuario,setUsuario] = useState('')
  const [user, setUser] =useState(null)
  const [rol,setRol] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [cantidad, setCantidad] = useState(null)
  const [abierto,setAbierto] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [admin, setAdmin] = useState('');


  const usuarioRef = ref(db, 'usuarios');
  const productosRef = ref(db, 'rulemanes'); 
  const carritoRef = ref(db,'usuarios/' + `${usuario}`+'/carrito')





  const handleClickAgregar = (producto) => {
    setSelectedProduct(producto);
    setAbierto(true);
  };
  

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
          descripcion
          
        };


        update(ref(db, 'usuarios/'+ `${usuario}`+'/carrito/' + codigo1 + '' + marca), productoEnCarrito);

       } else {
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,
          descripcion,
          
        };
  
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
function isURL(value) {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(value);
}

  useEffect(() => {
    const productosRef = ref(db, 'rulemanes'); 
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


  const familiaImagenes = {
    Embrague:'/embrague.jpg',
    Bombas:'/bombaAgua.jpg',
    Homocineticas:'/correa.jpg',

  }

  const handleSearch = (event) => {
    const term = event.target.value.toUpperCase();
    setSearchTerm(term);

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term);
    const first30 = results.slice(0,50)
    
    setSearchResults(first30);
  };
  
  const searchProducts = (term) => {
    if (!catalogData || term === '') {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      
      const product = catalogData[productId];
      
     

      // Busca en cada propiedad del producto
      Object.values(product).forEach((value) => {
    
        var filtro  = value.codigo1;
        var filtro2 = value.codigo2
        var filtro3 = value.codigo3
        var filtro4 = value
       
        
        if(filtro ) {
          if (filtro.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            results.push(value);
          }
          
        }
        
        if(filtro2) {

          if (filtro2.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            if(results.includes(value)){
             
            } else{

              results.push(value);
            }
          }
        }

        if(filtro3) {

          if (filtro3.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            if(results.includes(value)){
             
            } else{

              results.push(value);
            }
          }
        }
      


      });
    });

    return results;
  };


  function groupByCodigo1(searchResults) {
  
    return searchResults.reduce((result, obj) => {
      const codigo1 = obj.codigo1;
      
      if (!result[codigo1] ) {
        result[codigo1] = [obj];
      } else {
        result[codigo1].push(obj);
       
      }
  
      
      return result;
    }, {});
  }

  const groupedResults = groupByCodigo1(searchResults);

  
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <>
    <div className={abierto ? 'blureado' : ''}>
      <Navbar />

      <div className="fondo-busqueda">
        <>.</> 
        <div className='botones-busqueda'>

        <button className='button-30'><Link href='/busquedaMedidas'> BUSCAR POR MEDIDAS </Link></button>
        <button className='button-30'> <Link href='/busquedaDescripcion'> BUSCAR POR DESCRIPCION </Link></button>
        
        </div>
        <div className="barra-busqueda">
      
          <Image
            className="icono-busqueda"
            width={30}
            height={30}
            alt=""
            src="/iconoBusqueda.png"
          />
          <input
            className="input-busqueda"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="CÓDIGO"
          />
        </div>

        {Object.keys(groupedResults).map((codigo1,index) => (
          <div className="contenedor-cards" key={index}>
             
               <>
                
               <Image
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: '20px',
              }}
              alt=""
              src={
                familiaImagenes[
                  groupedResults[codigo1][0].familia
                ]
                  ? familiaImagenes[
                      groupedResults[codigo1][0].familia
                    ]
                  : '/rodamiento.webp'

              }
              width={80}
              height={80}
            />
               </>
              
            <div className="textos-completo">
              <div className="codigo-medidas">
                <div className="titulo-singular">{codigo1}</div>
             
                <div className="medidas">
                <div className="titulo-singular">{groupedResults[codigo1][0].codigo2}</div>
                <div className="titulo-singular">{groupedResults[codigo1][0].codigo3}</div>
             
                  <span>
                    INTERIOR: {groupedResults[codigo1][0].interior} mm
                  </span>
                  <span>
                   EXTERIOR: {groupedResults[codigo1][0].exterior} mm
                  </span>
                  <span>ALTURA: {groupedResults[codigo1][0].altura} mm</span>
                </div>
              </div>
              <div className="contenedor-propiedades">
                <div className="propiedades-principales">
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/tag.png"
                      width={30}
                      height={30}
                    />
                    MARCA
                  </span>
                  <span>
                    {' '}
                    <Image
                      alt=""
                      style={{ marginRight: '10px', marginTop: '-5px' }}
                      src="/iconoPlata.png"
                      width={30}
                      height={30}
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

                {groupedResults[codigo1].map((producto, marcaIndex) => (
                  <div className="propiedades" key={marcaIndex}>
              
                    <Image
                      style={{ marginRight: '100px' }}
                      alt=""
                      src={`/${producto.imagen}.png`}
                      width={100}
                      height={25}
                    />

                    <span style={{fontWeight:'bold'}} className="span-1">${producto.precio}</span>
                    <span
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
                    </span>
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
