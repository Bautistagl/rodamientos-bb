// // Importar las dependencias necesarias
// import { useEffect, useState } from 'react';
// import Papa from 'papaparse';

// import { get,ref,update } from 'firebase/database';
// import { db } from '../firebase';

// // Componente de ejemplo
// export default function ExcelUpdater() {
//   const [status, setStatus] = useState('Idle');

//   const actualizarCsv = () => {
//     async function updateDatabaseFromExcel() {
//       setStatus('Reading Excel file...');
//       try {
//         const response = await fetch('/archivoExcel2.csv');
//         const csvData = await response.text();

//         const { data } = Papa.parse(csvData, {
//           header: true, // Si tu archivo tiene encabezados
//         });

//         // Recorrer los registros del archivo Excel
//         for (const row of data) {
//           const codigo = row['PRUEBA'];
//           const nuevoPrecio = row['PRECIO'];
//           console.log(codigo,nuevoPrecio,'estos son los valores del csv')

//           // Lógica para actualizar la base de datos de Firebase
//           try {
            
//             const dbRef = ref(db,`/rulemanes/ ${codigo}/SKF`)
//             const nuevoValor = {
//                 precio: nuevoPrecio,
//             }
//             // Aquí debes realizar la lógica de actualización a tu base de datos de Firebase
//             // Puedes usar firebaseAdmin para interactuar con la Realtime Database
//             // Por ejemplo:
//             await get(dbRef)
//             .then((snapshot) => {
//              if (snapshot.exists()) {
//                 if(nuevoPrecio !== '') {
//                     update(dbRef,nuevoValor)
//                      .then(()=> {
//                         alert('Actualizacion exitosa')
//                      })
//                      .catch((error) => {
//                         console.error('Error al actualizar los valores:', error);
//                       });
//                 }
//              }
//             })
//           } catch (error) {
//             console.error('Error updating database:', error);
//           }
//         }

//         setStatus('Update completed.');
//       } catch (error) {
//         console.error('Error reading Excel file:', error);
//         setStatus('Error occurred.');
//       }
//     }

//     // Llamar a la función de actualización cuando el componente se monte
//     updateDatabaseFromExcel();
//   }

//   return <div>
    
    
    
//     Status: {status}
//     <button onClick={actualizarCsv}>ACTUALIZAR CSV</button>
    
    
    
//     </div>;
// }