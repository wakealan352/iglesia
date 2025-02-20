import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  // Verificar tanto el usuario actual como el token
  const token = localStorage.getItem("token");
  return !!auth.currentUser || !!token;
};

export const redirectIfNotAuthenticated = async () => {
  if (typeof window === "undefined") return;

  // Esperar a que Firebase inicialice
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const token = localStorage.getItem("token");

      if (!user && !token) {
        window.location.href = "/";
      }

      unsubscribe();
      resolve(user);
    });
  });
};
