<template>
  <div class="yt-urls">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">YT URLs</h1>
      <button 
        @click="showAddForm = !showAddForm"
        class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
      >
        <span v-if="!showAddForm">+ Add URL</span>
        <span v-else>Cancel</span>
      </button>
    </div>

    <!-- Add URL Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showAddForm" class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h5 class="text-lg font-semibold text-gray-800 mb-4">New YouTube URL</h5>
        <form @submit.prevent="handleAddYtUrl">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL *</label>
            <input 
              v-model="newYtUrl.url" 
              type="url" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="newYtUrl.description" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              rows="2"
              placeholder="What is this video about?"
            ></textarea>
          </div>
          <button 
            type="submit" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            Save URL
          </button>
        </form>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="ytUrlStore.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="ytUrlStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ ytUrlStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="ytUrlStore.ytUrls.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🔗</div>
      <p class="text-gray-500">No YouTube URLs saved yet. Add one above!</p>
    </div>

    <!-- URL Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="ytUrl in ytUrlStore.ytUrls" 
        :key="ytUrl.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-md group"
        :class="{ 'ring-2 ring-green-500 bg-green-50': ytUrl.complete_status }"
      >
        <!-- Thumbnail placeholder -->
        <div class="relative bg-gray-100 h-32 flex items-center justify-center">
          <div class="text-4xl">🎬</div>
          
          <!-- Complete badge -->
          <div 
            v-if="ytUrl.complete_status"
            class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
          >
            ✓ Completed
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- URL (truncated) -->
          <p 
            class="text-sm text-cyan-600 truncate mb-2 cursor-pointer hover:text-cyan-800"
            :title="ytUrl.url"
            @click="openUrl(ytUrl.url)"
          >
            🔗 {{ ytUrl.url }}
          </p>

          <!-- Description -->
          <p v-if="ytUrl.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ ytUrl.description }}
          </p>

          <!-- Date -->
          <p class="text-xs text-gray-400 mb-3">
            Added: {{ formatDate(ytUrl.date_added) }}
          </p>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-3 border-t">
            <!-- Watch toggle -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                :checked="ytUrl.complete_status"
                @change="toggleComplete(ytUrl)"
              />
              <span class="text-sm text-gray-600">Completed</span>
            </label>

            <!-- Buttons -->
            <div class="flex gap-1">
              <button 
                @click="openUrl(ytUrl.url)"
                class="text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 p-2 rounded-lg transition"
                title="Open"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button 
                @click="openEditModal(ytUrl)"
                class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="handleDelete(ytUrl.id)"
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal 
      ref="editModal"
      title="Edit YouTube URL"
      save-text="Save Changes"
      @save="saveEdit"
      @close="closeEditModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input 
            v-model="editingYtUrl.url" 
            type="url" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="editingYtUrl.description" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            rows="3"
          ></textarea>
        </div>
      </div>
    </BaseModal>

  </div>
</template>

<script setup>
import { useYtUrlApp } from './YtUrlApp.js'
import BaseModal from '../../components/modal/BaseModal.vue'

const {
  ytUrlStore,
  showAddForm,
  newYtUrl,
  handleAddYtUrl,
  toggleComplete,
  handleDelete,
  openUrl,
  formatDate,
  editingYtUrl,
  openEditModal,
  closeEditModal,
  saveEdit
} = useYtUrlApp()
</script>

<style scoped>
/* Tailwind doesn't have line-clamp by default, add this utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>