<template>
  <nav class="bg-gray-900 shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        
        <!-- Brand -->
        <router-link 
          to="/" 
          class="text-white text-xl font-bold hover:text-gray-300 transition"
          @click="closeMenu"
        >
          MeatBird Server Applications
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-4">
          <router-link 
            to="/"
            class="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'dashboard' }"
            @click="closeMenu"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/todos"
            class="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'todos' }"
            @click="closeMenu"
          >
            Todos
          </router-link>
          <router-link 
            to="/yt-urls"
            class="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'ytUrls' }"
            @click="closeMenu"
          >
            YT URLs
          </router-link>
        </div>

        <!-- Mobile Hamburger -->
        <button 
          @click="toggleMenu"
          class="md:hidden text-gray-300 hover:text-white focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              v-if="!isOpen" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isOpen" class="md:hidden pb-4">
          <router-link 
            to="/"
            class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'dashboard' }"
            @click="closeMenu"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/todos"
            class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'todos' }"
            @click="closeMenu"
          >
            Todos
          </router-link>
          <router-link 
            to="/yt-urls"
            class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition"
            :class="{ 'bg-gray-700 text-white': $route.name === 'ytUrls' }"
            @click="closeMenu"
          >
            YT URLs
          </router-link>
        </div>
      </Transition>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}
</script>