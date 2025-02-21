<template>
  <div>
    <!-- Hero -->
    <div class="relative h-screen overflow-hidden">
      <div
        ref="parallaxBackground"
        class="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroImage})` }"
      ></div>
      <div
        class="absolute inset-0 bg-black opacity-25 dark:opacity-45 transition-opacity duration-300 ease-in-out"
      ></div>
      <div class="relative h-full flex items-center justify-center z-10">
        <div class="text-center text-white p-5 selection:bg-teal-500">
          <h1 class="text-4xl sm:text-5xl font-bold mb-4">
            {{ saludo }} {{ displayName ? displayName : "a nuestra iglesia" }}
          </h1>
          <p class="text-xl sm:text-2xl">
            Un lugar de fe, comunidad y crecimiento espiritual
          </p>
        </div>
      </div>
      <!-- Scroll/Swipe Indicator -->
      <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <div class="scroll-indicator">
          <!-- Indicador para móviles (deslizar) -->
          <div class="sm:hidden flex flex-col items-center">
            <span class="text-white text-sm mb-2">Deslizar</span>
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
          </div>
          <!-- Indicador para pantallas más grandes (mouse) -->
          <div class="hidden sm:flex flex-col items-center">
            <span class="text-white text-sm mb-2">Bajar</span>
            <div class="mouse">
              <div class="mouse-wheel"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../lib/firebase";
import { usuarios } from "../lib/api";
import { onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      heroImage: "https://i.ibb.co/vCWvVYb/principal.jpg",
      displayName: "",
      unsubscribe: null,
      authUnsubscribe: null,
      nombresFemeninos: ["Angie", "Ana", "Maria", "Laura", "Sofia", "Isabella"],
    };
  },
  computed: {
    saludo() {
      if (this.nombresFemeninos.includes(this.displayName)) {
        return "Bienvenida";
      } else {
        return "Bienvenido";
      }
    },
  },
  methods: {
    handleScroll() {
      const parallaxBackground = this.$refs.parallaxBackground;
      if (parallaxBackground) {
        const scrollPosition = window.pageYOffset;
        const limit = parallaxBackground.offsetHeight;
        if (scrollPosition <= limit) {
          parallaxBackground.style.transform = `translateY(${
            scrollPosition * 0.5
          }px)`;
        }
      }
    },
    async setupProfileSubscription() {
      if (auth.currentUser) {
        try {
          // Primero intentamos obtener el perfil directamente
          const profile = await usuarios.getProfile(auth.currentUser.uid);
          this.displayName = profile.displayName;

          // Luego nos suscribimos a los cambios
          this.unsubscribe = usuarios.subscribeToProfile(
            auth.currentUser.uid,
            (profile) => {
              this.displayName = profile.displayName;
            }
          );
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
        }
      } else {
        this.displayName = "";
      }
    },
  },
  async mounted() {
    window.addEventListener("scroll", this.handleScroll);

    // Observar cambios en el estado de autenticación
    this.authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setupProfileSubscription();
      } else {
        this.displayName = "";
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // Limpiar todas las suscripciones
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  },
};
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInOut 2s infinite;
}

/* Mouse container */
.mouse {
  width: 26px;
  height: 40px;
  border: 2px solid #fff;
  border-radius: 20px;
  position: relative;
}

/* Mouse wheel */
.mouse-wheel {
  width: 3px;
  height: 8px;
  background-color: #fff;
  border-radius: 25%;
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  animation: mouse-wheel 2s ease infinite;
}

@keyframes mouse-wheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(7px);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Animación deslizar */
@keyframes swipeAnimation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.sm\:hidden svg {
  animation: swipeAnimation 2s infinite;
}
</style>
