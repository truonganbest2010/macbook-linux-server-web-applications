<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <NavBar />
    
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/layout/NavBar.vue'
</script>