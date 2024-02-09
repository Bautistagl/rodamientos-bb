
import { initializeApp } from "firebase/app";
import { getDatabase, } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmrLOJrFE6UpOHL72bcmcsXUjKXOqxAaE",
  authDomain: "rodamiento-bb.firebaseapp.com",
  databaseURL: "https://rodamiento-bb-default-rtdb.firebaseio.com",
  projectId: "rodamiento-bb",
  storageBucket: "rodamiento-bb.appspot.com",
  messagingSenderId: "730797910279",
  appId: "1:730797910279:web:04051100975b31cc103da2",
  measurementId: "G-LL6LRLCDE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const auth = getAuth(app)
const storage = getStorage(app);



export { db,auth,storage };