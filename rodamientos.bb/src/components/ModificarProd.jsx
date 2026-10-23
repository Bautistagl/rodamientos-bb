import { db, storage } from "@/firebasebautista";
import { get, ref, update } from "firebase/database";
import {
  normalizarCodigo,
  keyProducto,
  keyDeProducto,
  pathProducto,
} from "@/utils/productoKeybautista";
import { ref as sRef, uploadString, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ModificarProd = ({ producto, setModificar, onGuardado }) => {
  const [altura, setAltura] = useState("");
  const [codigo1, setCodigo1] = useState("");
  const [codigo2, setCodigo2] = useState("");
  const [codigo3, setCodigo3] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [exterior, setExterior] = useState("");
  const [interior, setInterior] = useState("");
  const [marcaAuto, setMarcaAuto] = useState("");
  const [modelos, setModelos] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [familia, setFamilia] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSubiendoImagen(true);
    try {
      const dataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target.result === "string") {
            resolve(e.target.result);
          } else {
            reject(new Error("El valor de dataURL no es una cadena de texto"));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      const storageRef = sRef(storage, `fotos/${producto.codigo1}.jpg`);
      const snapshot = await uploadString(storageRef, dataURL, "data_url");
      const url = await getDownloadURL(snapshot.ref);

      setImageUrl(url);
      console.log("Imagen subida correctamente:", url);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Swal.fire({
        title: "Error al subir la imagen",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setSubiendoImagen(false);
    }
  };

  const writeData = async () => {
    try {
      const updatedData = {
        altura: altura,
        codigo1: normalizarCodigo(codigo1),
        codigo2: codigo2.trim().toUpperCase(),
        codigo3: codigo3.trim().toUpperCase(),
        descripcion: descripcion,
        exterior: exterior,
        interior: interior,
        familia: familia,
        marcaAuto: marcaAuto,
        modelos: modelos,
        ubicacion: ubicacion,
        imageUrl: imageUrl,
      };

      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(([key, value]) => value !== ""),
      );

      // Clave REAL del nodo que se está editando. Antes se usaba
      // "productos/" + codigo1 (sin el espacio), lo que creaba un producto
      // nuevo en vez de modificar el existente.
      const keyActual = keyDeProducto(producto);
      const keyNueva = filteredData.codigo1
        ? keyProducto(filteredData.codigo1)
        : keyActual;
      let keyFinal = keyActual;

      if (keyNueva !== keyActual) {
        // Cambió el código: se mueve el producto a la clave nueva para que el
        // CSV y el buscador lo encuentren por el código nuevo.
        const destino = await get(ref(db, pathProducto(keyNueva)));
        if (destino.exists()) {
          Swal.fire({
            title: "Ese código ya existe",
            text: `Ya hay un producto con el código ${filteredData.codigo1}.`,
            icon: "error",
          });
          return;
        }
        const actual = (await get(ref(db, pathProducto(keyActual)))).val() || {};
        await update(ref(db, "productos"), {
          [keyNueva]: { ...actual, ...filteredData },
          [keyActual]: null,
        });
        keyFinal = keyNueva;
      } else {
        await update(ref(db, pathProducto(keyActual)), filteredData);
      }

      Swal.fire({
        title: "Producto Actualizado",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setModificar(null);
      if (onGuardado) {
        if (keyFinal !== keyActual) await onGuardado(keyActual);
        await onGuardado(keyFinal);
      }
    } catch (error) {
      console.error("Error al escribir datos:", error);
    }
  };

  return (
    <>
      <div className="popUp2">
        <div className="textos-popUp2">
          <h1> Modificar {producto.codigo1} </h1>
          <input
            onChange={(e) => setCodigo1(e.target.value)}
            placeholder={`${producto.codigo1}(codigo1)`}
          />
          <input
            onChange={(e) => setCodigo2(e.target.value)}
            placeholder={`${producto.codigo2}(codigo2)`}
          />
          <input
            onChange={(e) => setCodigo3(e.target.value)}
            placeholder={`${producto.codigo3}(codigo3)`}
          />
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            disabled={subiendoImagen}
          />
          {subiendoImagen && <p>Subiendo imagen...</p>}
          <input
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder={`${producto.descripcion}(desc)`}
          />
          <select
            value={familia || producto.familia || ""}
            onChange={(e) => setFamilia(e.target.value)}
          >
            <option value="" disabled>
              Familia
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
          <input
            onChange={(e) => setAltura(e.target.value)}
            placeholder={`${producto.altura}(altura)`}
          />
          <input
            onChange={(e) => setInterior(e.target.value)}
            placeholder={`${producto.interior}(interior)`}
          />
          <input
            onChange={(e) => setExterior(e.target.value)}
            placeholder={`${producto.exterior}(exterior)`}
          />

          <div style={{ display: "flex" }}>
            <button
              className="buscar4"
              onClick={() => writeData()}
              disabled={subiendoImagen}
            >
              {subiendoImagen ? "Subiendo..." : "Agregar"}
            </button>
            <button className="buscar4" onClick={() => setModificar(null)}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModificarProd;
