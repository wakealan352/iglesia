<template>
  <div class="space-y-6 mt-24">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
          Administrar Fechas
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona las fechas importantes</p>
      </div>
      <button
        @click="openModal()"
        class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md flex items-center justify-center gap-2 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Fecha
      </button>
    </div>

    <!-- Notificación de Error -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
      <span
        class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
        @click="errorMessage = ''"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </span>
    </div>

    <!-- Lista de Fechas -->
    <div v-if="isLoading" class="text-center py-4">Cargando fechas...</div>

    <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <!-- Vista de tabla para desktop -->
      <table
        class="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-900 dark:text-white"
      >
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Fecha
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Título
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Hora
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Lugar/Link
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Detalles
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Días Restantes
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-900"
        >
          <tr
            v-for="fecha in fechas"
            :key="fecha.id"
            class="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(fecha.fecha) }}
            </td>
            <td class="px-6 py-4">{{ fecha.titulo }}</td>
            <td class="px-6 py-4">{{ fecha.hora }}</td>
            <td class="px-6 py-4">{{ fecha.lugar }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                <span v-if="fecha.banner" title="Tiene banner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span
                  v-if="fecha.infoIconoTexto"
                  :class="`h-4 w-4 rounded-full ${getColorClass(
                    fecha.infoIconoTexto
                  )}`"
                  :title="fecha.infoIconoTexto"
                ></span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="getDiasRestantesClass(fecha.fecha)">
                {{ getDiasRestantes(fecha.fecha) }}
              </span>
            </td>
            <td class="px-6 py-4 space-x-2">
              <button
                @click="openModal(fecha)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Editar
              </button>
              <button
                @click="deleteFecha(fecha.id)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Vista de tarjetas para móvil -->
      <div class="md:hidden">
        <div
          class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden"
        >
          <ul class="divide-y-2 divide-gray-200 dark:divide-gray-900">
            <li
              v-for="fecha in fechas"
              :key="fecha.id"
              class="relative overflow-hidden touch-pan-y"
              @touchstart="handleTouchStart($event, fecha.id)"
              @touchmove="handleTouchMove($event, fecha.id)"
              @touchend="handleTouchEnd(fecha.id)"
            >
              <!-- Acciones de deslizamiento -->
              <div class="absolute inset-y-0 left-0 w-16 bg-blue-500 flex items-center justify-center transform transition-transform duration-200"
                   :style="{ transform: `translateX(${-100 + (activeCard === fecha.id ? swipeX : 0)}%)` }">
                <button class="text-white flex items-center justify-center" @click="openModal(fecha)">
                  <img src="/svg/editar.svg" alt="Editar" class="w-7 h-7">
                </button>
              </div>
              <div class="absolute inset-y-0 right-0 w-16 bg-red-500 flex items-center justify-center transform transition-transform duration-200"
                   :style="{ transform: `translateX(${100 + (activeCard === fecha.id ? swipeX : 0)}%)` }">
                <button class="text-white flex items-center justify-center" @click="deleteFecha(fecha.id)">
                  <img src="/svg/eliminar.svg" alt="Eliminar" class="w-7 h-7">
                </button>
              </div>
              <div class="relative bg-white dark:bg-gray-700 transform transition-transform duration-200"
                   :style="{ transform: `translateX(${activeCard === fecha.id ? swipeX : 0}px)` }">
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition duration-150 ease-in-out">
                  <div class="flex flex-col space-y-2">
                    <div class="flex justify-between items-start">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ fecha.titulo }}
                      </h3>
                      <div class="flex flex-col items-end text-sm">
                        <span class="text-gray-500 dark:text-gray-400">
                          {{ formatDate(fecha.fecha) }}
                        </span>
                        <span :class="getDiasRestantesClass(fecha.fecha)" class="mt-1">
                          {{ getDiasRestantes(fecha.fecha) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div class="flex items-center">
                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ fecha.hora }}
                      </div>
                      <div class="flex items-center">
                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ fecha.lugar }}
                      </div>
                    </div>
                    <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600/80 group-hover:border-gray-200 dark:group-hover:border-gray-500">
                      <div class="flex items-center space-x-2">
                        <span v-if="fecha.banner" title="Tiene banner" class="text-green-500 dark:text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <span v-if="fecha.infoIconoTexto" :class="`h-4 w-4 rounded-full ${getColorClass(fecha.infoIconoTexto)}`" :title="fecha.infoIconoTexto"></span>
                      </div>
                      <!-- Indicadores de deslizamiento -->
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="activeCard === fecha.id && swipeX < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" :class="activeCard === fecha.id && swipeX < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                        <div class="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" :class="activeCard === fecha.id && swipeX > 0 ? 'text-blue-500' : 'text-gray-400 dark:text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="activeCard === fecha.id && swipeX > 0 ? 'text-blue-500' : 'text-gray-400 dark:text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal para Agregar/Editar -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl transform transition-all border border-gray-200 dark:border-gray-700"
        >
          <!-- Modal header -->
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg">
            <div class="flex justify-between items-center">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {{ editingFecha ? "Editar Fecha" : "Agregar Nueva Fecha" }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <!-- Modal content -->
          <div class="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <form @submit.prevent="saveFecha" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    type="date"
                    v-model="fechaForm.fecha"
                    id="fecha"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  />
                  <label
                    for="fecha"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Fecha
                  </label>
                </div>

                <div class="relative">
                  <input
                    type="time"
                    v-model="fechaForm.hora"
                    id="hora"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  />
                  <label
                    for="hora"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Hora
                  </label>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  v-model="fechaForm.titulo"
                  id="titulo"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="titulo"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Título
                </label>
              </div>

              <div class="relative">
                <input
                  type="text"
                  v-model="fechaForm.lugar"
                  id="lugar"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="lugar"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Lugar/Link
                </label>
              </div>

              <div class="relative">
                <textarea
                  v-model="fechaForm.descripcion"
                  id="descripcion"
                  rows="3"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                ></textarea>
                <label
                  for="descripcion"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Descripción
                </label>
              </div>

              <div class="relative">
                <select
                  v-model="fechaForm.infoAdiccional"
                  id="infoAdiccional"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
                <label
                  for="infoAdiccional"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Icono de Información
                </label>
              </div>

              <div class="relative">
                <button
                  type="button"
                  @click="showDropdown = !showDropdown"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 text-left"
                >
                  <div class="flex items-center">
                    <span
                      :class="`inline-block w-3 h-3 rounded-full mr-2 ${getColorClass(
                        fechaForm.tipoIcono
                      )}`"
                    >
                    </span>
                    {{ fechaForm.tipoIcono || "Seleccione una opción" }}
                  </div>
                </button>
                <label
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 left-1"
                >
                  Texto del Icono de Información
                </label>
                <div
                  v-if="showDropdown"
                  class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  <div
                    v-for="option in iconOptions"
                    :key="option.value"
                    @click="selectOption(option)"
                    class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300"
                  >
                    <div class="flex items-center">
                      <span
                        :class="`inline-block w-3 h-3 rounded-full mr-2 ${option.colorClass}`"
                      >
                      </span>
                      {{ option.label }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="relative flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="tieneBanner"
                      v-model="fechaForm.tieneBanner"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="tieneBanner"
                      class="font-medium text-gray-700 dark:text-gray-300"
                      >Incluir banner</label
                    >
                  </div>
                </div>

                <div
                  v-if="fechaForm.tieneBanner"
                  class="relative transition-all duration-300"
                >
                  <input
                    type="text"
                    v-model="fechaForm.banner"
                    id="banner"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="banner"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    URL del Banner
                  </label>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="submit"
                  class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
                >
                  {{ editingFecha ? "Actualizar" : "Crear" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fechas } from "../../lib/api";

export default {
  name: "AdminFechasList",
  data() {
    return {
      fechas: [],
      showModal: false,
      showDropdown: false,
      editingFecha: null,
      errorMessage: "",
      iconOptions: [
        {
          value: "Canasta de amor",
          label: "Canasta de amor",
          colorClass: "bg-red-500",
        },
        {
          value: "Cena del Señor",
          label: "Cena del Señor",
          colorClass: "bg-red-700",
        },
        {
          value: "Reunión de damas",
          label: "Reunión de damas",
          colorClass: "bg-pink-500",
        },
        {
          value: "Reunión de varones",
          label: "Reunión de varones",
          colorClass: "bg-blue-500",
        },
        {
          value: "Reunión de jovenes",
          label: "Reunión de jovenes",
          colorClass: "bg-teal-500",
        },
        {
          value: "Domingo misionero",
          label: "Domingo misionero",
          colorClass: "bg-green-500",
        },
        {
          value: "Culto de oración",
          label: "Culto de oración",
          colorClass: "bg-violet-500",
        },
      ],
      fechaForm: {
        fecha: "",
        titulo: "",
        hora: "",
        lugar: "",
        descripcion: "",
        infoAdiccional: 0,
        tipoIcono: "",
        infoIconoTexto: "",
        banner: "",
        tieneBanner: false,
      },
      activeCard: null,
      swipeX: 0,
      swipeStartX: 0,
      isLoading: true,
    };
  },
  async created() {
    await this.loadFechas();
  },
  methods: {
    async loadFechas() {
      try {
        this.isLoading = true;
        const response = await fechas.getAll();
        this.fechas = this.sortFechas(response.data);
      } catch (error) {
        console.error("Error al cargar fechas:", error);
        this.errorMessage = "Error al cargar las fechas";
      } finally {
        this.isLoading = false;
      }
    },
    sortFechas(fechas) {
      return fechas.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaA - fechaB;
      });
    },
    openModal(fecha = null) {
      this.editingFecha = fecha;
      if (fecha) {
        this.fechaForm = { ...fecha };
        this.fechaForm.tieneBanner = !!fecha.banner;
        if (this.fechaForm.fecha) {
          const fechaObj = new Date(this.fechaForm.fecha);
          this.fechaForm.fecha = fechaObj.toISOString().split("T")[0];
        }
        const opcionesPredefinidas = [
          "Canasta de amor",
          "Cena del Señor",
          "Reunión de damas",
          "Reunión de varones",
          "Reunión de jovenes",
          "Domingo misionero",
          "Culto de oración",
        ];
        this.fechaForm.tipoIcono = opcionesPredefinidas.includes(
          this.fechaForm.infoIconoTexto
        )
          ? this.fechaForm.infoIconoTexto
          : "";
      } else {
        this.fechaForm = {
          fecha: "",
          titulo: "",
          hora: "",
          lugar: "",
          descripcion: "",
          infoAdiccional: 0,
          tipoIcono: "",
          infoIconoTexto: "",
          banner: "",
          tieneBanner: false,
        };
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingFecha = null;
    },
    async saveFecha() {
      try {
        this.fechaForm.infoIconoTexto = this.fechaForm.tipoIcono;

        if (!this.fechaForm.tieneBanner) {
          this.fechaForm.banner = null;
        }

        if (this.editingFecha) {
          await fechas.update(this.editingFecha.id, this.fechaForm);
        } else {
          await fechas.create(this.fechaForm);
        }
        await this.loadFechas();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar fecha:", error);
        this.errorMessage = "Error al guardar la fecha";
      }
    },
    async deleteFecha(id) {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta fecha?")) {
        try {
          await fechas.delete(id);
          await this.loadFechas();
        } catch (error) {
          console.error("Error al eliminar fecha:", error);
          this.errorMessage = "Error al eliminar la fecha";
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getColorClass(value) {
      const option = this.iconOptions.find((opt) => opt.value === value);
      return option ? option.colorClass : "";
    },
    selectOption(option) {
      this.fechaForm.tipoIcono = option.value;
      if (option.value !== "personalizado") {
        this.fechaForm.infoIconoTexto = option.value;
      }
      this.showDropdown = false;
    },
    getDiasRestantes(fecha) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEvento = new Date(fecha);
      fechaEvento.setHours(0, 0, 0, 0);

      const diferencia = fechaEvento - hoy;
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

      if (dias < 0) return "Evento pasado";
      if (dias === 0) return "Hoy";
      if (dias === 1) return "Mañana";
      return `${dias} días`;
    },

    getDiasRestantesClass(fecha) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEvento = new Date(fecha);
      fechaEvento.setHours(0, 0, 0, 0);

      const dias = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24));

      if (dias < 0) return "text-gray-500 dark:text-gray-400";
      if (dias <= 7) return "text-red-600 dark:text-red-400 font-semibold";
      if (dias <= 30) return "text-yellow-600 dark:text-yellow-400";
      return "text-green-600 dark:text-green-400";
    },
    handleTouchStart(event, id) {
      this.activeCard = id;
      this.swipeX = 0;
      this.swipeStartX = event.touches[0].clientX;
    },
    handleTouchMove(event, id) {
      if (this.activeCard !== id) return;
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.swipeStartX;
      this.swipeX = Math.max(Math.min(deltaX, 100), -100);
    },
    handleTouchEnd(id) {
      if (this.activeCard !== id) return;
      if (Math.abs(this.swipeX) > 25) {
        if (this.swipeX > 0) {
          this.openModal(this.fechas.find(f => f.id === id));
        } else {
          this.deleteFecha(id);
        }
      }
      this.activeCard = null;
      this.swipeX = 0;
    },
  },
};
</script>
