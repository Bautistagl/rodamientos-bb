import { useState } from 'react';
import Papa from 'papaparse';
import { ref, get, set, update } from 'firebase/database';
import { db } from '../firebase';
import { uid } from 'uid';
import Navbar from '@/components/Navbarbautista';
import NavCsv from '@/components/NavCsvbautista';

export default function ExcelUpdater() {
  const [status, setStatus] = useState('Ningun archivo seleccionado');
  const [fileSelected, setFileSelected] = useState(false);
  const [csvData, setCsvData] = useState(null);

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
          const dbRef = ref(db, `/rulemanes/ ${codigo}/SKF`);
          const uuid = uid();
          const nuevoValor = {
            precio: nuevoPrecio,
          };

          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            // El elemento ya existe, así que actualízalo
            if (nuevoPrecio !== '') {
              await update(dbRef, nuevoValor);
              console.log(`Actualizado: ${codigo}`);
            }
          } else {
            // El elemento no existe, así que créalo
            if (nuevoPrecio !== '') {
              await set(dbRef, {
                uuid,
                codigo1: codigo.toUpperCase(),
                marca: 'SKF',
                precio: nuevoPrecio,
                imagen: 'skfLogo',
              });
              console.log(`Creado: ${codigo}`);
            }
          }
        } catch (error) {
          console.error('Error updating/creating database:', error);
        }
      }
      setStatus('Actualización completada.');
    } else {
      setStatus('No se ha cargado ningún archivo.');
    }
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
    </div>
  );
}