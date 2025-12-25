<template>
  <div id="app">
    <NavBar />
    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import NavBar from './components/layout/NavBar.vue';
</script>



<style>
body {
  background-color: #f8f9fa;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
