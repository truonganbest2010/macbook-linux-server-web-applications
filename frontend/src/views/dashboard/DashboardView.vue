<template>
  <div class="dashboard">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <span>{{ error }}</span>
      <button 
        @click="fetchStats"
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
      >
        Retry
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Todos Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
        <div class="bg-blue-500 text-white px-6 py-4">
          <h5 class="text-lg font-semibold flex items-center gap-2">
            📝 Todos
          </h5>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-3 text-center mb-4">
            <div>
              <p class="text-3xl font-bold text-gray-800">{{ stats.total_todos }}</p>
              <p class="text-sm text-gray-500">Total</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-green-500">{{ stats.completed_todos }}</p>
              <p class="text-sm text-gray-500">Done</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-amber-500">{{ stats.pending_todos }}</p>
              <p class="text-sm text-gray-500">Pending</p>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              class="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              :style="{ width: completionPercent + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500">{{ completionPercent }}% complete</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t">
          <router-link 
            to="/todos" 
            class="text-blue-500 hover:text-blue-700 font-medium text-sm transition"
          >
            Go to Todos →
          </router-link>
        </div>
      </div>

      <!-- YT URLs Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-cyan-500">
        <div class="bg-cyan-500 text-white px-6 py-4">
          <h5 class="text-lg font-semibold flex items-center gap-2">
            🔗 YT URLs
          </h5>
        </div>
        <div class="p-6 text-center">
          <p class="text-5xl font-bold text-gray-800 mb-2">{{ stats.total_yt_urls }}</p>
          <p class="text-gray-500">Saved URLs</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t">
          <router-link 
            to="/yt-urls" 
            class="text-cyan-500 hover:text-cyan-700 font-medium text-sm transition"
          >
            Go to YT URLs →
          </router-link>
        </div>
      </div>

    </div>

    <!-- Quick Actions -->
    <div class="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b bg-gray-50">
        <h5 class="font-semibold text-gray-800">Quick Actions</h5>
      </div>
      <div class="p-6 flex gap-4">
        <router-link 
          to="/todos" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> New Todo
        </router-link>
        <router-link 
          to="/yt-urls" 
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> New YT URL
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboard } from './dashboard.js'

const { stats, loading, error, fetchStats } = useDashboard()

const completionPercent = computed(() => {
  if (stats.value.total_todos === 0) return 0
  return Math.round((stats.value.completed_todos / stats.value.total_todos) * 100)
})
</script>