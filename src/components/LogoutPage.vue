<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const countdown = ref(10);
const redirecting = ref(false);

const clearAuthState = () => {
  // Limpiar todo el estado de autenticación
  localStorage.removeItem("token");
  sessionStorage.clear();

  // Limpiar cualquier otra información de usuario que puedas tener almacenada
  try {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  } catch (e) {
    console.error("Error al limpiar IndexedDB:", e);
  }
};

onMounted(async () => {
  try {
    // Cerrar sesión en Firebase usando la instancia singleton
    await signOut(auth);

    // Limpiar estado de autenticación
    clearAuthState();

    // Iniciar la cuenta regresiva
    redirecting.value = true;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        // Forzar recarga completa para limpiar el estado de la aplicación
        window.location.replace("/");
      }
    }, 1000);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // En caso de error, limpiar el estado de todas formas y redirigir
    clearAuthState();
    window.location.replace("/");
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
        ¡Hasta pronto!
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
