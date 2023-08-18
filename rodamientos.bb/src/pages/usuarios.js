import { useState, useEffect } from 'react';

import { db,auth } from '../firebase';
import 'firebase/database';
import { ref, get, child,update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'
import Image from 'next/image';
import Swal from 'sweetalert2'

import Navbar from '@/components/Navbarbautista';
import Link from 'next/link';


export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]); 
  const [user, setUser] =useState(null)
  const [rol,setRol] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState("");




 
  

  useEffect(() => {
    const productosRef = ref(db, 'usuarios'); // Ruta de los productos en la base de datos
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

    getCatalogData();
    
  }, []);



  const handleSearch = (event) => {
   if( event === 'todos') {
    const term = 'todos'
    setSearchTerm(term);
    
    const results = searchProducts(term);
    setSearchResults(results);
   } 
  
   
   else {

     const term = event.target.value
     setSearchTerm(term);
     
    const results = searchProducts(term);
    setSearchResults(results);
   }

  };
  
  const searchProducts = (term) => {
    if (!catalogData || term === '') {
      return [];
    }

    const results = [];

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId,key) => {
      const product = catalogData[productId];
        var filtro = product.email

         if(filtro ) {

          if (filtro.includes(term) ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            
            results.push(product.email);
          }

          if ( term === 'todos' ) {
            results.push(product.email)
          }
        }
    });

    return results;
  };




  
  const handleChange = (event) => {
    setNuevoPrecio(event.target.value);
  };

  return (
    <div>
      <Navbar />

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
            placeholder="USUARIOS"
          />
        
    
        </div>

        {Object.values(searchResults).map((codigo1,index) => (
          <div className="contenedor-cards2" key={index} >
             
             
              
            <div className="textos-completo2">
              
                <div className="titulo-singular">{codigo1}</div>
              
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );


}
