<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const countdown = ref(10);
const redirecting = ref(false);
const userName = ref("");

const loadUserName = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    // Intentar obtener el nombre del localStorage primero
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      userName.value = storedName;
      return;
    }

    if (user) {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userName.value = userDoc.data().displayName || user.displayName || "";
      } else {
        userName.value = user.displayName || "";
      }
    }
  } catch (error) {
    console.error("Error al cargar el nombre del usuario:", error);
  }
};

onMounted(async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Obtener y guardar el nombre del usuario antes de cerrar sesión
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const displayName = userDoc.exists()
        ? userDoc.data().displayName || user.displayName || ""
        : user.displayName || "";

      // Guardar el nombre en localStorage
      if (displayName) {
        localStorage.setItem("userName", displayName);
      }

      // Cerrar sesión
      await signOut(auth);
    }

    // Cargar el nombre del usuario (ahora desde localStorage)
    await loadUserName();

    // Eliminar el token
    localStorage.removeItem("token");

    // Iniciar la cuenta regresiva
    redirecting.value = true;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        // Limpiar el nombre de usuario al finalizar
        localStorage.removeItem("userName");
        window.location.href = "/";
      }
    }, 1000);
  } catch (error) {
    console.error("Error durante el proceso de logout:", error);
    window.location.href = "/";
  }
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
  >
    <div class="max-w-md w-full text-center space-y-8">
      <!-- Imagen central -->
      <div class="flex justify-center">
        <img
          src="/desconectado.png"
          alt="Sesión cerrada"
          class="w-48 h-48 object-contain"
        />
      </div>

      <!-- Mensaje de desconexión -->
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        ¡Hasta pronto<span v-if="userName">, {{ userName }}</span
        >!
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Has cerrado sesión correctamente
      </p>

      <!-- Botón con cuenta regresiva -->
      <div class="mt-4">
        <button
          disabled
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          Regresando a inicio en {{ countdown }} segundos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
