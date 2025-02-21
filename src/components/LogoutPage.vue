<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { auth_api } from "../lib/api";

const countdown = ref(7);
const redirecting = ref(false);
const userName = ref("");
let unsubscribe: (() => void) | null = null;

const clearAuthState = () => {
  // Limpiar el estado de autenticación
  localStorage.removeItem("token");
  sessionStorage.clear();

  // Limpiar cualquier otra información de usuario que puedas tener almacenada
  try {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  } catch (e) {
    console.error("Error al limpiar IndexedDB:", e);
  }
};

onMounted(() => {
  // Nos suscribimos a los cambios de estado de autenticación
  unsubscribe = auth_api.onAuthStateChange((user) => {
    if (user) {
      userName.value =
        user.displayName || user.email?.split("@")[0] || "Usuario";
      handleLogout();
    } else {
      // Si no hay usuario, redirigimos a inicio
      window.location.replace("/");
    }
  });
});

onUnmounted(() => {
  // Limpiamos la suscripción cuando el componente se desmonta
  if (unsubscribe) {
    unsubscribe();
  }
});

const handleLogout = async () => {
  try {
    // Usar auth_api para cerrar sesión
    await auth_api.logout();

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
};
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
        ¡Hasta pronto, {{ userName }}!
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
