import { useState } from 'react';
import Papa from 'papaparse';
import { ref, get, set, update, remove } from 'firebase/database';
import { db } from '../../firebase';
import { uid } from 'uid';
import Navbar from '@/components/Navbarbautista';
import NavCsv from '@/components/NavCsvbautista';

export default function ExcelUpdater2() {
  const [status, setStatus] = useState('Ningun archivo seleccionado');
  const [fileSelected, setFileSelected] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [marca,setMarca] = useState(null)
  const [selectedMarca, setSelectedMarca] = useState('SKF');


  const handleFileUpload = async (event) => {
    setFileSelected(true);
    setStatus('Procesando archivo...');
    const file = event.target.files[0];

    if (file) {
      try {
        const data = await readCSVFile(file);
        setCsvData(data);
        setStatus('Archivo listo para actualizar.');
      } catch (error) {
        console.error('Error reading CSV file:', error);
        setStatus('Error occurred.');
      }
    } else {
      setStatus('No file selected.');
    }
  };

  // const handleConfirmacion = (codigo, marca) => {
  //   const dbRef2 = ref(db, `/rulemanes/ ${codigo}/${marca}`);
  
  //   get(dbRef2)
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
          
  //         remove(dbRef2)
  //           .then((data) => {
            
  //             Swal.fire({
  //               title: 'Borrado',
  //               icon:'success',
  //               timer: 1000, // 3 segundos
  //               timerProgressBar: true,
  //               showConfirmButton: false
  //             })
  //            setProductToDelete(null)
  //           })
  //           .catch((error) => {
  //             alert('Error al actualizar los valores:', error);
  //           });
  //       }
  //       else{Hoja de cálculo sin título
  //         console.log('no entra en nada')
  //       }
  //     })
  //     .catch((error) => {
  //       alert('Error al obtener el producto:', error);
  //     });
  // };

  // const removeSKFProducts = async () => {
  //   try {
  //     const productsRef = ref(db, '/rulemanes');
  //     const snapshot = await get(productsRef);
   
  //     if (snapshot.exists()) {
  //       const products = snapshot.val();
      
  //       for (const codigo in products) {
  //         const marcaRef = ref(db, `/rulemanes/${codigo}/${selectedMarca}`);
  //         await remove(marcaRef);
       
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error removing SKF products:', error);
  //   }
  // };

  const handleAcceptChanges = async () => {

  

    if (csvData) {
      setStatus('Procesando archivo...');
      const { data } = Papa.parse(csvData, {
        header: true,
      });

      for (const row of data) {
        const codigo = row['CODIGO'];
        const nuevoPrecio = row['PRECIO'];

        try {
          const dbRef = ref(db, `/productos/ ${codigo}/marcas/${selectedMarca}`);
         
          const uuid = uid();
          const nuevoValor = {
            precio: nuevoPrecio,
          };

          const snapshot = await get(dbRef);
         
          
          

          if (snapshot.exists()) {
          
            // El elemento ya existe, así que actualízalo
            if (nuevoPrecio !== '') {
              
              await update(dbRef, {
              
                stock:"Disponible",
                marca: `${selectedMarca}`,
                precio: nuevoPrecio,
                
              });
        
              
            }
          } else {
            
            if (nuevoPrecio !== '') {
              await set(dbRef, {
                stock:'Disponible',
                marca: `${selectedMarca}`,
                precio: nuevoPrecio,
                
              });
             
              
            }
          }
          await update(ref(db, 'productos/' + ` ${codigo}/`), {
            codigo1:codigo,
          })
        } catch (error) {
          console.error('Error updating/creating database:', error);
        }
      }
      setStatus('Actualización completada.');
    } else {
      setStatus('No se ha cargado ningún archivo.');
    }
  };
  const handleMarcaChange = (event) => {
    setSelectedMarca(event.target.value);
  };

  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      <Navbar />
      <NavCsv />
      {status}
     
      {!fileSelected ? (
        <input style={{ marginLeft: '50px' }} type="file" accept=".csv" onChange={handleFileUpload} />
      ) : (
        <button style={{ marginLeft: '50px' }} onClick={handleAcceptChanges}>
          Actualizar
        </button>
      )}
       <label style={{marginLeft:"30px"}} >Seleccione la marca a actualizar:</label>
      <select 
        style={{marginLeft:"30px"}}
        id="marcaSelect"
        name="marcaSelect"
        value={selectedMarca}
        onChange={handleMarcaChange}
      >
          <option value="SKF">SKF</option>  
          <option value="DBH">DBH</option>
          <option value="Economica">Economica</option>
          <option value="HCH">HCH</option>
          <option value="NSK-NTN">NSK</option>
          <option value="NTN">NTN</option>
          <option value="INA">INA</option>
          <option value="DOLZ">DOLZ</option>
          <option value="DAYCO">DAYCO</option>
          <option value="CORTECO">CORTECO</option>
          <option value="TIMKEN">TIMKEN</option>
        {/* Agrega más opciones según tus marcas */}
      </select>
      
    </div>
  );
}