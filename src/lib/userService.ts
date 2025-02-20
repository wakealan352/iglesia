import { auth, db } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export interface UserProfile {
  displayName: string;
  email: string;
  updatedAt: Date;
}

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
    return {
      displayName: "",
      email: "",
      updatedAt: new Date(),
    };
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
    }
  );
};
