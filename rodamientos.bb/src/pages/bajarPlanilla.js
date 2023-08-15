import { useState, useEffect, useRef } from 'react';
import ExcelJS from 'exceljs';
import { db, auth } from '../firebase';
import 'firebase/database';
import { ref, get, child, update, set } from 'firebase/database';
import Swal from 'sweetalert2';
import Navbar from '@/components/Navbarbautista';
import Image from 'next/image';

export default function BajarPlanilla1() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [porcentaje, setPorcentaje] = useState(0);
  const nuevoPrecioRef = useRef('');
  const [searchFamily, setSearchFamily] = useState('');
  const [excelBuffer, setExcelBuffer] = useState(null);


  const usuarioRef = ref(db, 'usuarios');

  const handleConfirmacion = async () => {
    
    const updatedResults = searchResults.map((product) => {
      // Calculate the new price (you can modify this logic as per your requirement)

      const newPrice = parseFloat(product.precio) * porcentaje;

      const nuevosValores = {
        precio: newPrice.toFixed(0),
      };
      const productosRef = ref(
        db,
        `/rulemanes/ ${product.codigo1}/${product.marca}`
      );

      get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (product.codigo1 !== '' &&  porcentaje > 0) {
              update(productosRef, nuevosValores)
                .then(() => {
                  Swal.fire({
                    title: 'Actualizado',
                    icon: 'success',
                    timer: 1000, // 3 segundos
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                  window.location.reload()
                })
                .catch((error) => {
                  console.error('Error al actualizar los valores:', error);
                });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ingrese un numero valido',
              });
            }
          }
        })
        .catch((error) => {
          console.error('Error al obtener el producto:', error);
        });
    });
  };




  



  useEffect(() => {
    const productosRef = ref(db, 'rulemanes'); // Ruta de los productos en la base de datos
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

            footer:
              '<a href="https://wa.me/1137660939"> Clickea aca y pedi tu cuenta gratis! </a>',
          });
        });

      //   setCatalogData(snapshot.val());
    };

    getCatalogData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(term,searchFamily);
    setSearchResults(results);
  };
  const handleFamilySearch = (event) => {
    const family = event.target.value;
    setSearchFamily(family);
  
    // Realiza la búsqueda en los datos del catálogo
    const results = searchProducts(searchTerm, family); // Update: pass the searchTerm as well
    setSearchResults(results);
  };

  const searchProducts = (term,family) => {
    if (!catalogData) {
      return [];
    }

    const results = [];
  
  

    // Recorre cada producto en el catálogo
    Object.keys(catalogData).forEach((productId) => {
      const product = catalogData[productId];

      // Busca en cada propiedad del producto
      
      Object.values(product).forEach((value) => {
        var filtro = value.marca;
        var filtro2 = value.familia
        if(term !== '' && family !== '') {
            if (term === filtro && family === filtro2 ) {
              // Agrega el producto a los resultados si encuentra coincidencia
              results.push(value);
            }}
         if (term !== '' && family === '') {
          if (filtro === term ) {
            // Agrega el producto a los resultados si encuentra coincidencia
            results.push(value);
          }
        } 
        if(term === '' && family !== '') {
          if( filtro2 === family){
            results.push(value)
          }
        }   
        if(term === '' && family === '') {
          results.push()
        }
        
      });
    });

    return results;
  };

  function groupByCodigo1(searchResults) {
    return searchResults.reduce((result, obj) => {
      const codigo1 = obj.codigo1;
      if (!result[codigo1]) {
        result[codigo1] = [obj];
      } else {
        result[codigo1].push(obj);
      }
      return result;
    }, {});
  }

  const groupedResults = groupByCodigo1(searchResults);
  const handleChange = (event) => {
    nuevoPrecioRef.current = event.target.value;
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Rodamientos');
   
      // Agrega encabezados
      sheet.addRow(['Codigo', 'Marca', 'Precio']);
  
      // Agrega los datos
     
      Object.keys(groupedResults).map(codigo1 => {
        groupedResults[codigo1].map((producto)=> (
            sheet.addRow([producto.codigo1,producto.marca,producto.precio])
        ))
    
      });
     
      
  
      // Guarda el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      setExcelBuffer(buffer)
      // Puedes usar este buffer para descargar el archivo o hacer lo que necesites
  
  };



  return (
    <>
    <Navbar/>
 
     
      <div className='contenedor-flex'> 
      <select className='letras-masivo' value={searchTerm} onChange={handleSearch}>
          <option value=""  defaultValue>
            MARCA
          </option>
          <option value="Economica">Economica</option>
          <option value="HCH">HCH</option>
          <option value="NSK-NTN">NSK-NTN</option>
          <option value="SKF">SKF</option>
          <option value="INA">INA</option>
          <option value="DOLZ">DOLZ</option>
          <option value="DAYCO">DAYCO</option>
          <option value="DBH">DBH</option>
          <option value="CORTECO">CORTECO</option>
          <option value="TIMKEN">TIMKEN</option>
          
        </select>
     
        <select className='letras-masivo' value={searchFamily} onChange={handleFamilySearch}>
          <option value=""  defaultValue>
            FAMILIA
          </option>
          <option value="Reten">Reten</option>
                            <option value="Rodamientos">Rodamientos</option>
                            <option value="Tensor">Tensor</option>
                            <option value="Conos">Conos y cubetas</option>
                            <option value="Automotor">Automotor</option>
                            <option value="Embrague">Embrague</option>
                            <option value="Grasas">Grasas</option>
                            <option value="Crucetas">Crucetas/ tricelas</option>
                            <option value="Bombas">Bombas de agua</option>
                            <option value="Homocineticas">Homocineticas</option>
         
        </select>
            
     
        <button className='letras-masivo'  onClick={generateExcel}> CARGAR INFO </button>
           


           {excelBuffer ? (
            <button className='letras-masivo'> 

        <a
          href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBuffer.toString('base64')}`}
          download="rodamientos.xlsx"
        >
          DESCARGAR PLANILLA
        </a>
            </button>
      ) : (
        <div style={{width:'100%'}}>Generando planilla de Excel...</div>
      )}
      </div>
     
      <div className="fondo-busqueda2">
      {Object.keys(groupedResults).map((codigo1, index) => (
          <div className="contenedor-cards-edicion" key={index}>
            <div className="textos-completo">

                <div style={{ fontWeight: 'bold' }} className="titulo-singular-masivo">{codigo1}</div>
              
                {groupedResults[codigo1].map((producto, marcaIndex) => (
                  <div className='contenedor-flex'  key={marcaIndex}>
                    <div className='precio-planilla'>
                      ${producto.precio}
                    </div>
                    <Image
                      style={{marginRight:'100px'}}
                      alt=""
                      src={
                        producto.imagen === ''
                          ? '/importado5.png'
                          : `/${producto.imagen}.png`
                      }
                      width={150}
                      height={30}
                    />
                  

                  </div>
                ))}
              </div>
            </div>
         
        ))}
      


     
      </div>
    </>
  );
}
