import { useState } from 'react';
import Papa from 'papaparse';
import { ref, get, set, update } from 'firebase/database';
import { db } from '../../firebase';
import { uid } from 'uid';
import Navbar from '@/components/Navbarbautista';
import NavCsv from '@/components/NavCsvbautista';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

const storage = getStorage();

export default function ExcelUpdater2() {
  const [status, setStatus] = useState('Ningun archivo seleccionado');
  const [fileSelected, setFileSelected] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('');

  const handleFileUpload = async (event) => {
    setFileSelected(true);
    setStatus('Procesando archivo...');
    const file = event.target.files[0];

    if (file) {
      try {
        const data = await readCSVFile(file);
        setCsvData(data);
        setStatus('Archivo listo para actualizar.');

        // Subir archivo a Firebase Storage
        await uploadCSVFile(file, selectedMarca);
      } catch (error) {
        console.error('Error reading CSV file:', error);
        setStatus('Error occurred.');
      }
    } else {
      setStatus('No file selected.');
    }
  };

  const uploadCSVFile = async (file, marca) => {
    const fileRef = storageRef(storage, `listas/${marca}.csv`);
    await uploadBytes(fileRef, file);
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
          const dbRef3 = ref(db, `/productos/ ${codigo}`);
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            console.log('existe el item');
            // El elemento ya existe, así que actualízalo
            if (nuevoPrecio !== '') {
              await update(dbRef, {
                stock: 'Disponible',
                marca: selectedMarca,
                precio: nuevoPrecio,
              });
            }
          } else {
            console.log('no existe el item', nuevoPrecio);
            if (nuevoPrecio !== '') {
              // Crea la estructura completa con los campos vacíos
              await set(dbRef3, {
                altura: '',
                codigo1: codigo,
                codigo2: '',
                codigo3: '',
                descripcion: '',
                exterior: '',
                familia: '',
                interior: '',
                marcas: {
                  [selectedMarca]: {
                    stock: 'Disponible',
                    marca: selectedMarca,
                    precio: nuevoPrecio,
                  },
                },
              });
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
      <h1> ACTUALIZACION DE PRODUCTOS A PARTIR DE CSV</h1>
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
          Actualizar
        </button>
      )}
      <label style={{ marginLeft: '30px' }}>
        Seleccione la marca a actualizar:
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
      <div>
        <ul>
          Pasos a seguir:
          <li>Crear un excel con dos columnas </li>
          <li>
            En la primer fila de la primer columna poner texto
            &apos;CODIGO&apos;
          </li>
          <li>
            En la primer fila de la segunda columna poner texto
            &apos;PRECIO&apos;
          </li>
          <li>
            Descargar el archivo con formato .csv (tambien llamado valores
            separados por coma)
          </li>
          <li> Seleccionar ese archivo descargado con formato .csv</li>
          <li>Elegir la marca a actualizar</li>
          <li>Tocar boton actualizar</li>
        </ul>

        <Image src="/Ejemplo CSV.png" alt="" height={300} width={300} />
      </div>
    </div>
  );
}
