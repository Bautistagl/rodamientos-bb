import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { get, ref, remove, set, update } from 'firebase/database';
import { db } from '../firebase';
import { uid } from 'uid';

export default function ExcelUpdater() {
  const [status, setStatus] = useState('Idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      setConfirmed(true);
    }
  };

  const handleUpdate = async () => {
    if (confirmed) {
      setStatus('Reading Excel file...');

      try {
        const csvData = await readFileAsText(selectedFile);
        const { data } = Papa.parse(csvData, {
          header: true, // Si tu archivo tiene encabezados
        });

        // Resto del código para actualizar la base de datos desde el archivo CSV
        // ...

        setStatus('Update completed.');
        setConfirmed(false); // Reiniciar el estado de confirmación después de la actualización
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setStatus('Error occurred.');
      }
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (event) => {
        reject(event.target.error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      Status: {status}
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={handleConfirm}>Confirmar</button>
      {confirmed && (
        <button onClick={handleUpdate}>Actualizar Base de Datos</button>
      )}
    </div>
  );
}