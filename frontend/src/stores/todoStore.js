import { defineStore } from 'pinia';
import api from '../services/api';

export const useTodoStore = defineStore(
  'todos',
  {
    state: () => ({
      todos: [],
      loading: false,
      error: null,
    }),
    actions: {
      async fetchTodos() {
          this.loading = true;
          try {
              const response = await api.get('/todos');
              this.todos = response.data;
              this.error = null;
          } catch (error) {
              this.error('Error fetching todos');
              console.error(error);
          } finally {
              this.loading = false;
          }
      },

      async addTodo(todo) {
        try {
          const response = await api.post('/todos', todo);
          this.todos.push(response.data);
          return response.data;
        } catch (error) {
          this.error('Error adding todo: ', error)
          throw error
        }
      },

      async deleteTodo(id) {
        try {
          await api.delete(`/todos/${id}`);
          this.todos = this.todos.filter(todo => todo.id !== id);
        } catch (error) {
          this.error('Error deleting todo');
          throw error;
        }
      },

      async updateTodo(id, updatedTodo) {
        try {
          const response = await api.put(`/todos/${id}`, updatedTodo);
          const index = this.todos.findIndex(todo => todo.id === id);
          if (index !== -1) {
            this.todos[index] = response.data;
          }
          return response.data;
        } catch (error) {
          this.error('Error updating todo');
          throw error;
        }
      },
    },
  }
);