import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ref, get, remove } from 'firebase/database';
import { db } from '../../firebase';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';
import Navbar from '@/components/Navbarbautista';
import NavCsv from '@/components/NavCsvbautista';

const storage = getStorage();

export default function EliminarCsv() {
  const [status, setStatus] = useState('Ningun archivo seleccionado');
  const [csvData, setCsvData] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('SKF');

  useEffect(() => {
    const fetchCSVData = async () => {
      setStatus('Obteniendo archivo CSV...');
      const url = await fetchCSVFileURL(selectedMarca);
      if (url) {
        const data = await downloadCSVFile(url);
        setCsvData(data);
        setStatus('Archivo CSV cargado.');
      } else {
        setStatus(
          'No se encontró ningún archivo CSV para la marca seleccionada.'
        );
      }
    };

    if (selectedMarca) {
      fetchCSVData();
    }
  }, [selectedMarca]);

  const fetchCSVFileURL = async (marca) => {
    const fileRef = storageRef(storage, `listas/${marca}.csv`);
    try {
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('Error fetching CSV file URL:', error);
      return null;
    }
  };

  const downloadCSVFile = async (url) => {
    const response = await fetch(url);
    const csvText = await response.text();
    return csvText;
  };

  const handleAcceptChanges = async () => {
    if (csvData) {
      setStatus('Procesando archivo...');
      const { data } = Papa.parse(csvData, {
        header: true,
      });

      for (const row of data) {
        const codigo = row['CODIGO'];
        const precio = row['PRECIO'];

        try {
          const dbRef = ref(
            db,
            `/productos/ ${codigo}/marcas/${selectedMarca}`
          );
          const dbRef2 = ref(db, `/productos/ ${codigo}`);
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const precioActual = snapshot.val().precio;
            if (precioActual === precio) {
              await remove(dbRef2);
              await remove(dbRef); // Eliminar el elemento si el precio coincide
            } else {
              console.warn(
                `El precio en el archivo CSV no coincide con el precio en la base de datos para el producto con el código ${codigo}`
              );
            }
          }
        } catch (error) {
          console.error('Error removing from database:', error);
        }
      }
      setStatus('Eliminación completada.');
    } else {
      setStatus('No se ha cargado ningún archivo.');
    }
  };

  const handleMarcaChange = (event) => {
    setSelectedMarca(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <NavCsv />
      <h1> ELIMINACION DE PRODUCTOS A PARTIR DE CSV</h1>
      {status}
      <button style={{ marginLeft: '50px' }} onClick={handleAcceptChanges}>
        Eliminar
      </button>
      <label style={{ marginLeft: '30px' }}>
        Seleccione la marca a eliminar:
      </label>
      <select
        style={{ marginLeft: '30px' }}
        id="marcaSelect"
        name="marcaSelect"
        value={selectedMarca}
        onChange={handleMarcaChange}>
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
