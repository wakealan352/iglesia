import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

export interface UserProfile {
  displayName: string;
  email: string;
  updatedAt: Date;
}

export interface UserWithId extends UserProfile {
  id: string;
}

export const getAllUsers = async (): Promise<UserWithId[]> => {
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
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
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
};

export const subscribeToUserProfile = (
  userId: string,
  callback: (profile: UserProfile) => void
): (() => void) => {
  return onSnapshot(
    doc(db, "users", userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          displayName: data.displayName || auth.currentUser?.displayName || "",
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
};
