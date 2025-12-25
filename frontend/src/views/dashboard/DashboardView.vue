<template>
  <div class="dashboard">
    <h1 class="mb-4">Dashboard</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchStats">
        Retry
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-else class="row">
      <!-- Todos Card -->
      <div class="col-md-6 mb-4">
        <div class="card border-primary">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">📝 Todos</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <h2 class="mb-0">{{ stats.total_todos }}</h2>
                <small class="text-muted">Total</small>
              </div>
              <div class="col-4">
                <h2 class="mb-0 text-success">{{ stats.completed_todos }}</h2>
                <small class="text-muted">Done</small>
              </div>
              <div class="col-4">
                <h2 class="mb-0 text-warning">{{ stats.pending_todos }}</h2>
                <small class="text-muted">Pending</small>
              </div>
            </div>
            <!-- Progress Bar -->
            <div class="progress mt-3" style="height: 10px;">
              <div 
                class="progress-bar bg-success" 
                role="progressbar"
                :style="{ width: completionPercent + '%' }"
              ></div>
            </div>
            <small class="text-muted">
              {{ completionPercent }}% complete
            </small>
          </div>
          <div class="card-footer">
            <router-link to="/todos" class="btn btn-outline-primary btn-sm">
              Go to Todos →
            </router-link>
          </div>
        </div>
      </div>

      <!-- URLs Card -->
      <div class="col-md-6 mb-4">
        <div class="card border-info">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">🔗 URLs</h5>
          </div>
          <div class="card-body text-center">
            <h1 class="display-4 mb-0">{{ stats.total_urls }}</h1>
            <p class="text-muted">Saved URLs</p>
          </div>
          <div class="card-footer">
            <router-link to="/urls" class="btn btn-outline-info btn-sm">
              Go to URLs →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card mt-4">
      <div class="card-header">
        <h5 class="mb-0">Quick Actions</h5>
      </div>
      <div class="card-body">
        <router-link to="/todos" class="btn btn-primary me-2">
          + New Todo
        </router-link>
        <router-link to="/urls" class="btn btn-info">
          + New URL
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