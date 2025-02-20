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
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// Interfaces
export interface UserProfile {
  displayName: string;
  email: string;
  updatedAt: Date;
}

export interface UserWithId extends UserProfile {
  id: string;
}

export interface Fecha {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  banner?: string;
  infoIconoTexto?: string;
  infoAdiccional?: string;
  createdBy: string;
  updatedBy?: string;
}

// Función para verificar autenticación
const checkAuth = () => {
  if (!auth.currentUser) {
    throw new Error(
      "No hay sesión activa. Por favor, inicia sesión nuevamente."
    );
  }
  return true;
};

export const usuarios = {
  getAll: async (): Promise<UserWithId[]> => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName || "",
        email: doc.data().email || "",
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error("No se pudieron cargar los usuarios");
    }
  },

  getProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          displayName: data.displayName || auth.currentUser?.displayName || "",
          email: data.email || auth.currentUser?.email || "",
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return {
        displayName: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      throw new Error("No se pudo cargar el perfil del usuario");
    }
  },

  subscribeToProfile: (
    userId: string,
    callback: (profile: UserProfile) => void
  ): (() => void) => {
    return onSnapshot(
      doc(db, "users", userId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback({
            displayName:
              data.displayName || auth.currentUser?.displayName || "",
            email: data.email || auth.currentUser?.email || "",
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        } else {
          callback({
            displayName: auth.currentUser?.displayName || "",
            email: auth.currentUser?.email || "",
            updatedAt: new Date(),
          });
        }
      },
      (error) => {
        console.error("Error al escuchar cambios del perfil:", error);
        throw new Error("Error en la suscripción a cambios del perfil");
      }
    );
  },
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

      // Obtener todos los usuarios para mapear IDs a nombres
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const users = new Map();
      usersSnapshot.docs.forEach((doc) => {
        users.set(doc.id, doc.data().displayName || doc.data().email);
      });

      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdBy: users.get(doc.data().createdBy) || "Usuario desconocido",
          updatedBy: doc.data().updatedBy
            ? users.get(doc.data().updatedBy) || "Usuario desconocido"
            : undefined,
        })),
      };
    } catch (error) {
      console.error("Error al obtener fechas:", error);
      throw new Error("Error al cargar las fechas");
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
    } catch (error) {
      console.error("Error al crear fecha:", error);
      throw new Error("Error al crear la fecha");
    }
  },
  update: async (id: string, data: any) => {
    try {
      checkAuth();
      const docRef = doc(db, "fechas", id);
      const fechaData = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser!.uid,
      };

      await updateDoc(docRef, fechaData);

      return {
        data: {
          id,
          ...fechaData,
        },
      };
    } catch (error) {
      console.error("Error al actualizar fecha:", error);
      throw new Error("Error al actualizar la fecha");
    }
  },
  delete: async (id: string) => {
    try {
      checkAuth();
      await deleteDoc(doc(db, "fechas", id));
      return {
        data: { id },
        mensaje: "Fecha eliminada exitosamente",
      };
    } catch (error) {
      console.error("Error al eliminar fecha:", error);
      throw new Error("Error al eliminar la fecha");
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
