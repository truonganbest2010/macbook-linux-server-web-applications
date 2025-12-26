<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      
      <!-- Brand -->
      <router-link class="navbar-brand" to="/" @click="closeMenu">
        🍗 MeatBird Server Applications
      </router-link>

      <!-- Hamburger Button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="toggleMenu"
        :class="{ 'collapsed': !isOpen }"
        :aria-expanded="isOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible Menu with Transition -->
      <Transition name="slide">
        <div 
          v-show="isOpen || !isMobile"
          class="navbar-collapse"
          :class="{ 'mobile-menu': isMobile }"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link 
                class="nav-link" 
                :class="{ active: $route.name === 'dashboard' }"
                to="/"
                @click="closeMenu"
              >
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                class="nav-link"
                :class="{ active: $route.name === 'todos' }"
                to="/todos"
                @click="closeMenu"
              >
                Todos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                class="nav-link"
                :class="{ active: $route.name === 'ytUrls' }"
                to="/yt-urls"
                @click="closeMenu"
              >
                YT URLs
              </router-link>
            </li>
          </ul>
        </div>
      </Transition>

    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 992)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleResize() {
  windowWidth.value = window.innerWidth
  // Close menu when resizing to desktop
  if (!isMobile.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Keep navbar on top of everything */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
}

/* Mobile dropdown menu stays on top */
@media (max-width: 991.98px) {
  .navbar-collapse.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #212529;
    padding: 0.5rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    z-index: 1030;  /* ← Add this */
  }
}
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Mobile menu styles */
@media (max-width: 991.98px) {
  .navbar-collapse.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #212529;
    padding: 0.5rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .navbar-collapse.mobile-menu .navbar-nav {
    padding: 0.5rem 0;
  }

  .navbar-collapse.mobile-menu .nav-link {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .navbar-collapse.mobile-menu .nav-link:last-child {
    border-bottom: none;
  }

  .navbar-collapse.mobile-menu .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 0.5rem;
    transition: all 0.2s ease;
  }
}

/* Hamburger animation */
.navbar-toggler {
  border: none;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.navbar-toggler:focus {
  box-shadow: none;
  outline: none;
}

.navbar-toggler:not(.collapsed) {
  transform: rotate(90deg);
}

/* Active link highlight */
.nav-link.active {
  font-weight: 600;
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #0d6efd;
}

@media (max-width: 991.98px) {
  .nav-link.active::after {
    display: none;
  }
  
  .nav-link.active {
    background-color: rgba(13, 110, 253, 0.2);
    padding-left: 0.5rem;
    border-radius: 4px;
  }
}

/* Ensure navbar has relative position for absolute menu */
.navbar {
  position: relative;
}
</style>