import { useState, useEffect } from 'react';

import { db, auth, storage } from '../../firebase';
import 'firebase/database';
import { ref, get, child, update, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { ref as sRef,uploadString, getDownloadURL } from 'firebase/storage';
import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';
import PopUp from '@/components/PopUpbautista';
import NavCodigo from '@/components/NavCodigobautista';
import { listAll } from 'firebase/storage';

export default function BusquedaCodigo2() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [fotosData, setFotosData] = useState([])
  const [usuario, setUsuario] = useState('');
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [cantidad, setCantidad] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [admin, setAdmin] = useState('');
  const [selectedMarca, setSelectedMarca] = useState(null)

  const usuarioRef = ref(db, 'usuarios');
  const productosRef = ref(db, 'productos');
  const carritoRef = ref(db, 'usuarios/' + `${usuario}` + '/carrito');

  const handleClickAgregar = (producto, marca) => {
    setSelectedMarca(marca)
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

        productosEnCarrito.forEach((producto) => {
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
  const agregarProducto = async (producto,cantidades,usuario,selectedMarca,descripcion) => {
    const {codigo1 } = producto
    const {precio,marca,stock} = selectedMarca
   
    try {
      const snapshot = await get(ref(db, 'usuarios/'+ `${usuario}`+'/carrito2/' + codigo1 + '' + marca));
      
      if (snapshot.exists()) {
          
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,
          descripcion,
          
        };


        update(ref(db, 'usuarios/'+ `${usuario}`+'/carrito2/' + codigo1 + '' + marca), productoEnCarrito);

       } else {
        const productoEnCarrito = {
          codigo1,
          precio,
          cantidades,
          marca,
          descripcion,
          
        };
  
        update(ref(db, 'usuarios/'+ `${usuario}`+'/carrito2/' + codigo1 + '' + marca), productoEnCarrito);
   
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
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value);
  }

  useEffect(() => {
    const productosRef = ref(db, 'productos');
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

            footer:
              '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>',
          });
        });
    };
    const id = localStorage.getItem('idRodamientos');
    if (id) {
      setUsuario(id);
    } else {
      alert('nadie logeado');
    }
    if (window.localStorage.getItem('email')) {
      const adminData = JSON.parse(window.localStorage.getItem('email'));
      if (adminData) {
        setAdmin(adminData.email);
      }
    }

    getCatalogData();
    listAll(sRef(storage,'fotos')).then(imgs=>{
      imgs.items.forEach(val => {
        getDownloadURL(val).then(url=>{
          setFotosData(data =>[...data,url])
        })
      })
    })
  }, []);

  const familiaImagenes = {
    Embrague: '/embrague.jpg',
    Bombas: '/bombaAgua.jpg',
    Homocineticas: '/correa.jpg',
  };
  const findPhotoLink = (productName) => {
    const matchingLink = fotosData.find(link => link.includes(productName.toUpperCase()));
    return matchingLink || '/rodamiento.webp'; // Si no se encuentra, usar una imagen predeterminada
  };
  const handleSearch = (event) => {
    const term = event.target.value.toUpperCase();
    setSearchTerm(term);

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term);
    const first30 = results.slice(0, 50);

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

      var filtro = product.codigo1;
      var filtro2 = product.codigo2;
      var filtro3 = product.codigo3;

      if (filtro) {
        if (filtro.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia

          results.push(product);
        }
      }

      if (filtro2) {
        if (filtro2.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia
          if (results.includes(product)) {
          } else {
            results.push(product);
          }
        }
      }

      if (filtro3) {
        if (filtro3.includes(term)) {
          // Agrega el producto a los resultados si encuentra coincidencia
          if (results.includes(product)) {
          } else {
            results.push(product);
          }
        }
      }
    });

    return results;
  };

  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <>
      <div className={abierto ? 'blureado' : ''}>
        <Navbar />
        <NavCodigo/>

        <div className="fondo-busqueda">
          <>.</>
          
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
          

          {Object.keys(searchResults).map((codigo1, index) => (
            <div className="contenedor-cards" key={index}>
              <>
              
                <Image
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    marginLeft: '20px',
                  }}
                  alt=""
                  src={findPhotoLink(searchResults[codigo1].codigo1)}
                  width={80}
                  height={80}
                />
              </>

              <div className="textos-completo2">
                <div className="codigo-medidas2">
                  <div className="titulo-singular2">
                    {searchResults[codigo1].codigo1}
                  </div>
                  <div className="medidas">
                    <div className="titulo-singular2">
                      {searchResults[codigo1].codigo2}
                    </div>
                    <div className="titulo-singular2">
                      {searchResults[codigo1].codigo3}
                    </div>

                    <span>INTERIOR: {searchResults[codigo1].interior} mm</span>
                    <span>EXTERIOR: {searchResults[codigo1].exterior} mm</span>
                    <span>ALTURA: {searchResults[codigo1].altura} mm</span>
                  </div>
                </div>
                <div className="contenedor-propiedades3">
                  <div>

                    <div className="propiedades-principales2">
                      <span> MARCA</span>
                      <span>PRECIO</span>
                      <span>STOCK </span>
                    </div>

                  {searchResults[codigo1].marcas &&
                    Object.values(searchResults[codigo1].marcas).map(
                      (producto, marcaIndex) => (
                        <>
                        
                          <div className="propiedades2" key={marcaIndex}>
                           
                            <Image
                              style={{ marginRight: '100px' }}
                              alt=""
                              src={`/${producto.marca.toLowerCase()}Logo.png`}
                              width={100}
                              height={25}
                            />

                            <span style={{ fontWeight: 'bold' }}>
                              ${producto.precio}
                            </span>
                            <span
                              className="span-2"
                              style={{
                                fontWeight: 'bold',
                                color:
                                  producto.stock.toLowerCase() == 'disponible'
                                    ? 'green'
                                    : producto.stock == 'No disponible'
                                    ? 'red'
                                    : 'rgb(215, 215, 58)',
                              }}>
                              {producto.stock
                                ? producto.stock.toUpperCase()
                                : ''}
                            </span>

                         
                            {admin === 'rodamientosbb@admin.com' ? (
                              <button
                                onClick={() =>
                                  handleClickAgregar(
                                    producto,
                                    searchResults[codigo1]
                                  )
                                }>
                                AGREGAR
                              </button>
                            ) : (
                              ''
                            )}
                          </div>
                        </>
                      )
                    )}
                  </div>

                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {abierto ? (
        <PopUp
          usuario={usuario}
          agregarProducto={agregarProducto}
          producto={selectedProduct}
          marca={marca}
          precio={marca.precio}
          setAbierto={setAbierto}
          abierto={abierto}
          cantidad={cantidad}
          setCantidad={setCantidad}
        />
      ) : null}
    </>
  );
}
