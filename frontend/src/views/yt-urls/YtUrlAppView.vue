<template>
  <div class="urls">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>URL Manager</h1>
      <button class="btn btn-primary" @click="showAddForm = !showAddForm">
        {{ showAddForm ? 'Cancel' : '+ Add URL' }}
      </button>
    </div>

    <!-- Add URL Form -->
    <div v-if="showAddForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">New URL</h5>
        <form @submit.prevent="handleAddUrl">
          <div class="mb-3">
            <label class="form-label">URL *</label>
            <input 
              v-model="newUrl.url" 
              type="url" 
              class="form-control" 
              placeholder="https://example.com"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea 
              v-model="newUrl.description" 
              class="form-control" 
              rows="2"
              placeholder="What is this URL for?"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-success">Save URL</button>
        </form>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="ytUrlStore.loading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="ytUrlStore.error" class="alert alert-danger">
      {{ ytUrlStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="ytUrlStore.urls.length === 0" class="text-center py-5">
      <p class="text-muted">No URLs saved yet. Add one above!</p>
    </div>

    <!-- URL List -->
    <div v-else class="list-group">
      <div 
        v-for="urlItem in ytUrlStore.urls" 
        :key="urlItem.id"
        class="list-group-item d-flex justify-content-between align-items-start"
        :class="{ 'list-group-item-success': urlItem.complete_status }"
      >
        <div class="d-flex align-items-start">
          <input 
            type="checkbox" 
            class="form-check-input me-3 mt-1"
            :checked="urlItem.complete_status"
            @change="toggleComplete(urlItem)"
          />
          <div>
            <h6 
              class="mb-1" 
              :class="{ 'text-decoration-line-through': urlItem.complete_status }"
            >
              🔗 {{ urlItem.url }}
            </h6>
            <p class="mb-1 text-muted" v-if="urlItem.description">
              {{ urlItem.description }}
            </p>
            <small class="text-muted">
              Added: {{ formatDate(urlItem.date_added) }}
            </small>
          </div>
        </div>
        <div class="btn-group">
          <button 
            class="btn btn-outline-primary btn-sm"
            @click="openUrl(urlItem.url)"
          >
            Open
          </button>
          <button 
            class="btn btn-outline-danger btn-sm"
            @click="handleDelete(urlItem.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useYtUrlApp } from './YtUrlApp.js'

const {
  ytUrlStore,
  showAddForm,
  newUrl,
  handleAddUrl,
  toggleComplete,
  handleDelete,
  openUrl,
  formatDate
} = useYtUrlApp()
</script>