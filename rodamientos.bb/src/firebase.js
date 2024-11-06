
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmrLOJrFE6UpOHL72bcmcsXUjKXOqxAaE",
  authDomain: "rodamiento-bb.firebaseapp.com",
  databaseURL: "https://rodamiento-bb-default-rtdb.firebaseio.com",
  projectId: "rodamiento-bb",
  storageBucket: "rodamiento-bb.appspot.com",
  messagingSenderId: "730797910279",
  appId: "1:730797910279:web:04051100975b31cc103da2",
  measurementId: "G-LL6LRLCDE3",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

export const getEngineTypes = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "motores"));
    if (snapshot.exists()) {
      return snapshot.val().tiposMotores;
    } else {
      console.log("No hay datos disponibles");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los tipos de motores:", error);
    return [];
  }
};

export const getUbicaciones = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "ubicaciones"));
    if (snapshot.exists()) {
      return snapshot.val().tiposUbicaciones;
    } else {
      console.log("No hay datos disponibles");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los tipos de ubicaciones:", error);
    return [];
  }
};

export const getAllCarRelations = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "cars/relations"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No hay relaciones disponibles");
      return {};
    }
  } catch (error) {
    console.error("Error al obtener las relaciones:", error);
    return {};
  }
};
export const getAllCars = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "cars"));
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No hay relaciones disponibles");
      return {};
    }
  } catch (error) {
    console.error("Error al obtener las relaciones:", error);
    return {};
  }
};

export const getModelsByBrand = async (brand) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `cars/relations/${brand}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log(`No hay modelos disponibles para la marca ${brand}`);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    return [];
  }
};

export const addModelToBrand = async (brand, model) => {
  try {
    const currentModels = (await getModelsByBrand(brand)) || [];
    if (!currentModels.includes(model)) {
      const updatedModels = [...currentModels, model];
      await set(ref(db, `cars/relations/${brand}`), updatedModels);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al agregar el modelo:", error);
    return false;
  }
};

// Función para eliminar un modelo de una marca
export const removeModelFromBrand = async (brand, model) => {
  try {
    const currentModels = (await getModelsByBrand(brand)) || [];
    const updatedModels = currentModels.filter((m) => m !== model);
    await set(ref(db, `cars/relations/${brand}`), updatedModels);
    return true;
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const addUbicacion = async (ubicacion) => {
  try {
    const currentModels = (await getUbicaciones()) || [];
    if (!currentModels.includes(ubicacion)) {
      const updatedModels = [...currentModels, ubicacion];
      await set(ref(db, `ubicaciones/tiposUbicaciones`), updatedModels);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const removeUbicacion = async (ubicacion) => {
  try {
    const currentModels = (await getUbicaciones()) || [];
    const updatedModels = currentModels.filter((m) => m !== ubicacion);
    await set(ref(db, `ubicaciones/tiposUbicaciones`), updatedModels);
    return true;
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const addMotor = async (ubicacion) => {
  try {
    const currentModels = (await getEngineTypes()) || [];
    if (!currentModels.includes(ubicacion)) {
      const updatedModels = [...currentModels, ubicacion];
      await set(ref(db, `motores/tiposMotores`), updatedModels);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const removeMotor = async (ubicacion) => {
  try {
    const currentModels = (await getEngineTypes()) || [];
    const updatedModels = currentModels.filter((m) => m !== ubicacion);
    await set(ref(db, `motores/tiposMotores`), updatedModels);
    return true;
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const addAuto = async (ubicacion) => {
  try {
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};
export const removeAuto = async (ubicacion) => {
  try {
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return false;
  }
};






