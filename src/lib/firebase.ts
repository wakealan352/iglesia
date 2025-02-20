import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnCG79O4QorOhTkvgSwIXtT2zV4yimCUw",
  authDomain: "iglesia-87cd3.firebaseapp.com",
  projectId: "iglesia-87cd3",
  storageBucket: "iglesia-87cd3.firebasestorage.app",
  messagingSenderId: "366923103958",
  appId: "1:366923103958:web:ef0d86dec0dd88f4359377",
};

// Inicializar Firebase
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (error: any) {
  if (!/already exists/.test(error.message)) {
    console.error("Error al inicializar Firebase:", error.stack);
  }
  firebaseApp = initializeApp(firebaseConfig, "secondary");
}

// Exportar las instancias de Firebase
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
