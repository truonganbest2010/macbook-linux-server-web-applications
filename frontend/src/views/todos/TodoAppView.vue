<template>
  <div class="todos">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        Todos
        <span class="text-lg font-normal text-gray-500">({{ todoStore.totalCount }})</span>
      </h1>
      <button 
        @click="showAddForm = !showAddForm"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
      >
        <span v-if="!showAddForm">+ Add Todo</span>
        <span v-else>Cancel</span>
      </button>
    </div>

    <!-- Add Todo Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showAddForm" class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h5 class="text-lg font-semibold text-gray-800 mb-4">New Todo</h5>
        <form @submit.prevent="handleAddTodo">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              v-model="newTodo.title" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="newTodo.description" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows="2"
              placeholder="Add more details..."
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              v-model="newTodo.category" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., work, personal, shopping"
            />
          </div>
          <button 
            type="submit" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            Save Todo
          </button>
        </form>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="todoStore.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="todoStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ todoStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!todoStore.todos || todoStore.todos.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <p class="text-gray-500">No todos yet. Add one above!</p>
    </div>

    <!-- Todo List -->
    <template v-else>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div 
          v-for="(todo, index) in todoStore.todos" 
          :key="todo.id"
          class="border-b last:border-b-0"
          :class="{ 'bg-green-50': todo.completed }"
        >
          <!-- Compact Row (always visible) -->
          <div class="flex items-center px-4 py-3 gap-3">
            <!-- Checkbox -->
            <input 
              type="checkbox" 
              class="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              :checked="todo.completed"
              @change="toggleComplete(todo)"
            />

            <!-- Expand/Collapse Button -->
            <button 
              @click="toggleExpand(todo.id)"
              class="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              :class="{ 'rotate-90': isExpanded(todo.id) }"
            >
              <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Title (main content) -->
            <div 
              class="flex-1 min-w-0 cursor-pointer"
              @click="toggleExpand(todo.id)"
            >
              <span 
                class="text-gray-800 truncate block"
                :class="{ 'line-through text-gray-400': todo.completed }"
              >
                {{ todo.title }}
              </span>
            </div>

            <!-- Category Badge -->
            <span 
              v-if="todo.category" 
              class="hidden sm:inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0"
            >
              {{ todo.category }}
            </span>

            <!-- Date (hidden on mobile) -->
            <span class="hidden md:block text-xs text-gray-400 flex-shrink-0">
              {{ formatDate(todo.created_at) }}
            </span>

            <!-- Actions -->
            <div class="flex gap-1 flex-shrink-0">
              <button 
                @click.stop="openEditModal(todo)"
                class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <!-- Updated: pass todo object instead of just id -->
              <button 
                @click.stop="handleDelete(todo)"
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Expanded Details (collapsible) -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-48"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 max-h-48"
            leave-to-class="opacity-0 max-h-0"
          >
            <div 
              v-if="isExpanded(todo.id)" 
              class="px-4 pb-4 pl-14 overflow-hidden"
            >
              <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                <!-- Description -->
                <div v-if="todo.description">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                  <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ todo.description }}</p>
                </div>
                <div v-else>
                  <p class="text-gray-400 text-sm italic">No description</p>
                </div>

                <!-- Meta info (visible on mobile) -->
                <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <span v-if="todo.category" class="sm:hidden bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {{ todo.category }}
                  </span>
                  <span class="text-xs text-gray-400">
                    Created: {{ formatDate(todo.created_at) }}
                  </span>
                  <span v-if="todo.completed" class="text-xs text-green-600">
                    ✓ Completed
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="todoStore.currentPage"
        :total-items="todoStore.totalCount"
        :per-page="todoStore.perPage"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </template>

    <!-- Edit Modal -->
    <BaseModal 
      ref="editModal"
      title="Edit Todo"
      save-text="Save Changes"
      @save="saveEdit"
      @close="closeEditModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            v-model="editingTodo.title" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="editingTodo.description" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input 
            v-model="editingTodo.category" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
    </BaseModal>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      ref="confirmModal"
      type="danger"
      title="Delete Todo?"
      :message="todoToDelete ? `Are you sure you want to delete '${todoToDelete.title}'? This action cannot be undone.` : 'This action cannot be undone.'"
      confirm-text="Delete"
      cancel-text="Keep it"
    />
  </div>
</template>

<script setup>
import { useTodoApp } from './todoApp.js'
import BaseModal from '../../components/modal/BaseModal.vue'
import ConfirmModal from '../../components/modal/ConfirmModal.vue'
import Pagination from '../../components/pagination/Pagination.vue'

const {
  todoStore,
  showAddForm,
  newTodo,
  handleAddTodo,
  toggleComplete,
  handleDelete,
  formatDate,
  toggleExpand,
  isExpanded,
  editModal,
  editingTodo,
  openEditModal,
  closeEditModal,
  saveEdit,
  handlePageChange,
  handlePerPageChange,
  confirmModal,
  todoToDelete
} = useTodoApp()
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>