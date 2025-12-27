import { defineStore } from 'pinia'
import api from '../services/api'

export const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [],
    totalCount: 0,
    loading: false,
    error: null,
    // Pagination state
    currentPage: 1,
    perPage: 10
  }),

  getters: {
    paginatedTodos: (state) => {
      return state.todos
    }
  },

  actions: {
    async fetchTodos(page = 1, limit = 10) {
      this.loading = true
      this.currentPage = page
      this.perPage = limit
      
      const skip = (page - 1) * limit
      
      try {
        // Fetch paginated data
        const response = await api.get(`/todos?skip=${skip}&limit=${limit}`)
        this.todos = response.data
        
        // Fetch total count (separate request or modify backend)
        const countResponse = await api.get('/todos?limit=1000')
        this.totalCount = countResponse.data.length
        
        this.error = null
      } catch (err) {
        this.error = 'Failed to fetch todos'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async addTodo(todo) {
      try {
        const response = await api.post('/todos', todo)
        // Refresh current page
        await this.fetchTodos(this.currentPage, this.perPage)
        return response.data
      } catch (err) {
        this.error = 'Failed to add todo'
        throw err
      }
    },

    async updateTodo(id, updates) {
      try {
        const response = await api.put(`/todos/${id}`, updates)
        const index = this.todos.findIndex(t => t.id === id)
        if (index !== -1) {
          this.todos[index] = response.data
        }
        return response.data
      } catch (err) {
        this.error = 'Failed to update todo'
        throw err
      }
    },

    async deleteTodo(id) {
      try {
        await api.delete(`/todos/${id}`)
        // Refresh current page
        await this.fetchTodos(this.currentPage, this.perPage)
      } catch (err) {
        this.error = 'Failed to delete todo'
        throw err
      }
    }
  }
})