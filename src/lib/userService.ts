import { auth, db } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export interface UserProfile {
  displayName: string;
  // Aquí puedes agregar más campos del perfil si los necesitas
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        displayName:
          userDoc.data().displayName || auth.currentUser?.displayName || "",
      };
    }
    return {
      displayName: auth.currentUser?.displayName || "",
    };
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    return {
      displayName: "",
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
        callback({
          displayName:
            doc.data().displayName || auth.currentUser?.displayName || "",
        });
      } else {
        callback({
          displayName: auth.currentUser?.displayName || "",
        });
      }
    },
    (error) => {
      console.error("Error al escuchar cambios del perfil:", error);
    }
  );
};
