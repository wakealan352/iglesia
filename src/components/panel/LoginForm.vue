<script setup lang="ts">
import { ref, computed } from "vue";
import { auth } from "../../lib/api";

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const isSuccess = ref(false);
const progress = ref(0);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    progress.value = 0;

    const response = await auth.login({
      username: username.value,
      password: password.value,
    });

    // Set success state immediately
    isSuccess.value = true;

    // Trigger success animation
    const animationDuration = 1000; // 1 second
    const steps = 100;
    const stepDuration = animationDuration / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        progress.value = i;
      }, i * stepDuration);
    }

    localStorage.setItem("token", response.data.token);

    // Redirigir a la página de administración de eventos después de iniciar sesión
    setTimeout(() => {
      window.location.href = "/admin/eventos";
    }, 1000);
  } catch (err: any) {
    error.value = err.response?.data?.mensaje || "Error al iniciar sesión";
    isSuccess.value = false;
    progress.value = 0;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-32"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Iniciar Sesión</h2>

    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="username">
        Usuario
      </label>
      <input
        v-model="username"
        type="text"
        id="username"
        class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        required
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="password">
        Contraseña
      </label>
      <input
        v-model="password"
        type="password"
        id="password"
        class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        required
      />
    </div>

    <div v-if="error" class="mb-4 text-red-500 text-sm">
      {{ error }}
    </div>

    <div class="relative">
      <button
        type="submit"
        class="w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-colors duration-300 relative text-white"
        :class="[isSuccess ? 'text-white' : 'bg-teal-500 hover:bg-teal-600']"
        :disabled="isLoading || isSuccess"
      >
        <div class="relative z-10">
          {{
            isLoading
              ? "Iniciando sesión..."
              : isSuccess
              ? "Sesión iniciada"
              : "Iniciar Sesión"
          }}
        </div>
        <div
          class="absolute inset-0 bg-green-400 dark:bg-green-500 transition-all duration-1000 ease-out"
          :style="{ clipPath: `inset(0 ${100 - progress}% 0 0)` }"
        ></div>
      </button>
    </div>
  </form>
</template>
