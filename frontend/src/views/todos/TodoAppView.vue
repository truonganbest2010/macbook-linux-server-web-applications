<template>
  <div class="todos">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Todos</h1>
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
    <div v-else-if="todoStore.todos.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <p class="text-gray-500">No todos yet. Add one above!</p>
    </div>

    <!-- Todo List -->
    <div v-else class="space-y-3">
      <div 
        v-for="todo in todoStore.todos" 
        :key="todo.id"
        class="bg-white rounded-xl shadow-sm p-4 flex justify-between items-start transition hover:shadow-md"
        :class="{ 'bg-green-50 border-l-4 border-green-500': todo.completed }"
      >
        <div class="flex items-start gap-3">
          <!-- Checkbox -->
          <input 
            type="checkbox" 
            class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
            :checked="todo.completed"
            @change="toggleComplete(todo)"
          />
          
          <!-- Content -->
          <div>
            <h5 
              class="font-medium text-gray-800"
              :class="{ 'line-through text-gray-400': todo.completed }"
            >
              {{ todo.title }}
            </h5>
            <p v-if="todo.description" class="text-sm text-gray-500 mt-1">
              {{ todo.description }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span 
                v-if="todo.category" 
                class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {{ todo.category }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(todo.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button 
            @click="openEditModal(todo)"
            class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
            title="Edit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            @click="handleDelete(todo.id)"
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

  </div>
</template>

<script setup>
import { useTodoApp } from './todoApp.js'
import BaseModal from '../../components/modal/BaseModal.vue'

const {
  todoStore,
  showAddForm,
  newTodo,
  handleAddTodo,
  toggleComplete,
  handleDelete,
  formatDate,
  editModal,
  editingTodo,
  openEditModal,
  closeEditModal,
  saveEdit
} = useTodoApp()
</script>