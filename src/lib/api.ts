import {
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// Función para verificar autenticación
const checkAuth = () => {
  if (!auth.currentUser) {
    throw new Error(
      "No hay sesión activa. Por favor, inicia sesión nuevamente."
    );
  }
  return true;
};

export const eventos = {
  getAll: async () => {
    try {
      const eventosRef = collection(db, "eventos");
      const q = query(eventosRef, orderBy("fecha", "desc"));
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } catch (error: any) {
      console.error("Error al obtener eventos:", error);
      throw new Error("Error al cargar los eventos: " + error.message);
    }
  },
  getById: async (id: string) => {
    try {
      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          data: {
            id: docSnap.id,
            ...docSnap.data(),
          },
        };
      }
      throw new Error("Evento no encontrado");
    } catch (error: any) {
      console.error("Error al obtener evento:", error);
      throw new Error("Error al obtener el evento: " + error.message);
    }
  },
  create: async (data: any) => {
    try {
      checkAuth();

      // Formatear los datos antes de guardar
      const eventData = {
        titulo: data.titulo?.trim() || "",
        descripcion: data.descripcion?.trim() || "",
        textoBoton: data.textoBoton?.trim() || "",
        linkBoton: data.linkBoton?.trim() || "",
        image: data.image || "",
        fecha: data.fecha || new Date().toISOString(),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser!.uid,
      };

      // Validar que si hay textoBoton también haya linkBoton
      if (eventData.textoBoton && !eventData.linkBoton) {
        throw new Error(
          "Si agregas un texto de botón, debes agregar también un enlace"
        );
      }

      const eventosRef = collection(db, "eventos");
      const docRef = await addDoc(eventosRef, eventData);

      return {
        data: {
          id: docRef.id,
          ...eventData,
        },
      };
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      throw new Error(error.message || "Error al crear el evento");
    }
  },
  update: async (id: string, data: any) => {
    try {
      checkAuth();

      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }

      // Formatear los datos antes de actualizar
      const updateData = {
        titulo: data.titulo?.trim() || "",
        descripcion: data.descripcion?.trim() || "",
        textoBoton: data.textoBoton?.trim() || "",
        linkBoton: data.linkBoton?.trim() || "",
        image: data.image || "",
        fecha: data.fecha || new Date().toISOString(),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser!.uid,
      };

      // Validar que si hay textoBoton también haya linkBoton
      if (updateData.textoBoton && !updateData.linkBoton) {
        throw new Error(
          "Si agregas un texto de botón, debes agregar también un enlace"
        );
      }

      await updateDoc(docRef, updateData);

      return {
        data: {
          id,
          ...updateData,
        },
      };
    } catch (error: any) {
      console.error("Error al actualizar evento:", error);
      throw new Error(error.message || "Error al actualizar el evento");
    }
  },
  delete: async (id: string) => {
    try {
      checkAuth();

      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }

      await deleteDoc(docRef);

      return {
        data: { id },
        mensaje: "Evento eliminado exitosamente",
      };
    } catch (error: any) {
      console.error("Error al eliminar evento:", error);
      throw new Error(error.message || "Error al eliminar el evento");
    }
  },
};

export const fechas = {
  getAll: async () => {
    try {
      const fechasRef = collection(db, "fechas");
      const q = query(fechasRef, orderBy("fecha", "asc"));
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } catch (error: any) {
      console.error("Error al obtener fechas:", error);
      throw new Error("Error al cargar las fechas: " + error.message);
    }
  },
  getById: async (id: string) => {
    try {
      const docRef = doc(db, "fechas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          data: {
            id: docSnap.id,
            ...docSnap.data(),
          },
        };
      }
      throw new Error("Fecha no encontrada");
    } catch (error: any) {
      console.error("Error al obtener fecha:", error);
      throw new Error("Error al obtener la fecha: " + error.message);
    }
  },
  create: async (data: any) => {
    try {
      checkAuth();

      const fechaData = {
        ...data,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser!.uid,
      };

      const fechasRef = collection(db, "fechas");
      const docRef = await addDoc(fechasRef, fechaData);

      return {
        data: {
          id: docRef.id,
          ...fechaData,
        },
      };
    } catch (error: any) {
      console.error("Error al crear fecha:", error);
      throw new Error(error.message || "Error al crear la fecha");
    }
  },
  update: async (id: string, data: any) => {
    try {
      checkAuth();

      const docRef = doc(db, "fechas", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("La fecha no existe");
      }

      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser!.uid,
      };

      await updateDoc(docRef, updateData);

      return {
        data: {
          id,
          ...updateData,
        },
      };
    } catch (error: any) {
      console.error("Error al actualizar fecha:", error);
      throw new Error(error.message || "Error al actualizar la fecha");
    }
  },
  delete: async (id: string) => {
    try {
      checkAuth();

      const docRef = doc(db, "fechas", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("La fecha no existe");
      }

      await deleteDoc(docRef);

      return {
        data: { id },
        mensaje: "Fecha eliminada exitosamente",
      };
    } catch (error: any) {
      console.error("Error al eliminar fecha:", error);
      throw new Error(error.message || "Error al eliminar la fecha");
    }
  },
};

export const auth_api = {
  login: async (credentials: { username: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username,
        credentials.password
      );
      const token = await userCredential.user.getIdToken();
      return {
        data: {
          token,
          user: userCredential.user,
        },
      };
    } catch (error: any) {
      throw error;
    }
  },
  changePassword: async (passwords: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("Usuario no autenticado");
    }

    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(
        user.email,
        passwords.oldPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      await updatePassword(user, passwords.newPassword);

      return {
        data: {
          mensaje: "Contraseña actualizada exitosamente",
        },
      };
    } catch (error: any) {
      throw {
        response: {
          data: {
            mensaje: "Error al cambiar la contraseña",
          },
        },
      };
    }
  },
};
