import { db } from "@/firebasebautista"
import { child, get, ref, set, update } from "firebase/database";
import firebase from "firebase/app";




export default function NuevaRama () {

  const agregarMarca = async (codigoRuleman, ) => {
    try {
      // Obtén la referencia al nodo específico en la rama productos
      const productoRef = ref(db, `productos/ ${codigoRuleman}/marcas/economica`);
  
      // Verifica si el nodo existe
      const productoSnapshot = await get(productoRef);
  
      if (productoSnapshot.exists()) {
        console.log(`La propiedad 'economica' ya existe para ${codigoRuleman}. Puedes actualizar sus valores si es necesario.`);
      } else {
        // Si el nodo no existe, crea la estructura con la nueva propiedad 'skf'
        await set(productoRef, {
          precio: 5500, // Reemplaza con el valor inicial de 'precio'
          stock: 'Disponible',  // Reemplaza con el valor inicial de 'stock'
          marca: 'Economica'
        });
  
        console.log(`Propiedad 'economica' agregada a ${codigoRuleman} exitosamente.`);
      }
    } catch (error) {
      console.error(`Error al agregar propiedad 'skf' a ${codigoRuleman}:`, error);
    }
  };
  // const crearRamaProductos = async (codigosRulemanes) => {
  //   try {
  //     // Obtén la referencia a la rama productos de la base de datos
  //     const productosRef = ref(db, 'productos');
  
  //     // Itera sobre los codigosRulemanes
  //     for (const codigoRulemanInfo of codigosRulemanes) {
  //       // Destructura las propiedades del códigoRuleman
  //       const { codigoRuleman, altura, interior, exterior, descripcion, codigo1, codigo2, codigo3, familia } = codigoRulemanInfo;
  
  //       // Trata las propiedades para asegurarte de que no sean undefined
  //       const processedAltura = altura !== undefined ? altura : '';
  //       const processedInterior = interior !== undefined ? interior : '';
  //       const processedExterior = exterior !== undefined ? exterior : '';
  //       const processedDescripcion = descripcion !== undefined ? descripcion : '';
  //       const processedCodigo1 = codigo1 !== undefined ? codigo1 : '';
  //       const processedCodigo2 = codigo2 !== undefined ? codigo2 : '';
  //       const processedCodigo3 = codigo3 !== undefined ? codigo3 : '';
  //       const processedFamilia = familia !== undefined ? familia : '';
  
  //       // Comprueba si el nodo ya existe en la rama productos
  //       const productoSnapshot = await get(child(productosRef, codigoRuleman));
  
  //       if (productoSnapshot.exists()) {
  //         // Si existe, actualiza el nodo existente con la nueva propiedad
  //         await update(child(productosRef, codigoRuleman), {
  //           altura: processedAltura,
  //           interior: processedInterior,
  //           exterior: processedExterior,
  //           descripcion: processedDescripcion,
  //           codigo1:processedCodigo1,
  //           codigo2:processedCodigo2,
  //           codigo3:processedCodigo3,
  //           familia:processedFamilia,
  //         });
  //       } else {
  //         // Si no existe, muestra un mensaje indicando que el nodo no existe
  //         console.log(`El nodo con código ${codigoRuleman} no existe en la rama productos.`);
  //       }
  //     }
  
  //     console.log('Rama de productos actualizada exitosamente');
  //   } catch (error) {
  //     console.error('Error al actualizar la rama de productos:', error);
  //   }
  // };
  
      
    // const getCodigosRulemanes = async () => {
    //     // Obtén la referencia a la rama rulemanes de la base de datos
    //     const codigosRulemanes = [];
    //     const rulemanesRef = ref(db, 'rulemanes');
      
    //     try {
    //       const snapshot = await get(rulemanesRef);
      
    //       if (snapshot.exists()) {
    //         const rulemanesData = snapshot.val();
      
    //         // Convierte el objeto a un array de pares clave-valor
    //         const rulemanesArray = Object.entries(rulemanesData);
      
    //         for (const [codigoRuleman, marcas] of rulemanesArray) {
    //           // Obtén la primer marca del ruleman
    //           const marca = Object.keys(marcas)[0];
      
    //           // Obtén las propiedades del ruleman
    //           const propiedades = marcas[marca];
      
    //           // Crea un objeto con las propiedades del ruleman
    //           const rulemanObjeto = {
    //             codigoRuleman,
    //             altura: propiedades.altura,
    //             interior: propiedades.interior,
    //             exterior: propiedades.exterior,
    //             familia: propiedades.familia,
    //             descripcion: propiedades.descripcion,
    //             codigo1: propiedades.codigo1,
    //             codigo2: propiedades.codigo2,
    //             codigo3: propiedades.codigo3,
    //           };
      
    //           // Agrega el ruleman al arreglo
    //           codigosRulemanes.push(rulemanObjeto);
    //         }
      
    //         return crearRamaProductos(codigosRulemanes);
            
    //       } else {
    //         console.log('No se encontraron productos en la rama especificada');
    //         return [];
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       return [];
    //     }
    //   };
    

  
    return(
        <>

        <button onClick={()=>agregarMarca('028-145299')}> Agregar marca</button>
        </>
    )

}