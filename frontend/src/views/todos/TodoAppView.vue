<template>
  <div class="todos">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Todos</h1>
      <button class="btn btn-primary" @click="showAddForm = !showAddForm">
        {{ showAddForm ? 'Cancel' : '+ Add Todo' }}
      </button>
    </div>

    <!-- Add Todo Form -->
    <div v-if="showAddForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">New Todo</h5>
        <form @submit.prevent="handleAddTodo">
          <div class="mb-3">
            <label class="form-label">Title *</label>
            <input 
              v-model="newTodo.title" 
              type="text" 
              class="form-control" 
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea 
              v-model="newTodo.description" 
              class="form-control" 
              rows="2"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <input 
              v-model="newTodo.category" 
              type="text" 
              class="form-control"
            />
          </div>
          <button type="submit" class="btn btn-success">Save Todo</button>
        </form>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="todoStore.loading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="todoStore.error" class="alert alert-danger">
      {{ todoStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="todoStore.todos.length === 0" class="text-center py-5">
      <p class="text-muted">No todos yet. Add one above!</p>
    </div>

    <!-- Todo List -->
    <div v-else class="list-group">
      <div 
        v-for="todo in todoStore.todos" 
        :key="todo.id"
        class="list-group-item d-flex justify-content-between align-items-start"
        :class="{ 'list-group-item-success': todo.completed }"
      >
        <div class="d-flex align-items-start">
          <input 
            type="checkbox" 
            class="form-check-input me-3 mt-1"
            :checked="todo.completed"
            @change="toggleComplete(todo)"
          />
          <div>
            <h5 
              class="mb-1" 
              :class="{ 'text-decoration-line-through': todo.completed }"
            >
              {{ todo.title }}
            </h5>
            <p class="mb-1 text-muted" v-if="todo.description">
              {{ todo.description }}
            </p>
            <small class="text-muted">
              <span v-if="todo.category" class="badge bg-secondary me-2">
                {{ todo.category }}
              </span>
              Created: {{ formatDate(todo.created_at) }}
            </small>
          </div>
        </div>
        <div>
          <button 
            class="btn btn-outline-primary btn-sm me-1"
            @click="openEditModal(todo)"
          >
            Edit
          </button>
          <button 
            class="btn btn-outline-danger btn-sm"
            @click="handleDelete(todo.id)"
          >
            Delete
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
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input 
          v-model="editingTodo.title" 
          type="text" 
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea 
          v-model="editingTodo.description" 
          class="form-control" 
          rows="3"
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Category</label>
        <input 
          v-model="editingTodo.category" 
          type="text" 
          class="form-control"
        />
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