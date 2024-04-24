import { useState } from 'react';
import Papa from 'papaparse';
import { ref, get, remove } from 'firebase/database';
import { db } from '../../firebase';
import Navbar from '@/components/Navbarbautista';
import NavCsv from '@/components/NavCsvbautista';
import Image from 'next/image';
import NavCsv2 from '@/components/NavCsv2bautista';

export default function EliminarCsv() {
  const [status, setStatus] = useState('Ningun archivo seleccionado');
  const [fileSelected, setFileSelected] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [marca, setMarca] = useState(null);
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
          const dbRef = ref(
            db,
            `/productos/ ${codigo}/marcas/${selectedMarca}`
          );

          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const precioActual = snapshot.val().precio;
            if (precioActual === nuevoPrecio) {
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
      <h1> ELIMINACION DE PRODUCTOS A PARTIR DE CSV</h1>
      {status}

      {!fileSelected ? (
        <input
          style={{ marginLeft: '50px' }}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      ) : (
        <button style={{ marginLeft: '50px' }} onClick={handleAcceptChanges}>
          Eliminar
        </button>
      )}
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
      <div></div>
    </div>
  );
}
