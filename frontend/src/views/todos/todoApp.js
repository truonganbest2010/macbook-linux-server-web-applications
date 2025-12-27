import { ref, onMounted } from 'vue'
import { useTodoStore } from '../../stores/todoStore'

export function useTodoApp() {
  const todoStore = useTodoStore()

  const showAddForm = ref(false)
  const newTodo = ref({
    title: '',
    description: '',
    category: ''
  })

  // Track which todos are expanded
  const expandedTodos = ref(new Set())

  // Edit modal state
  const editModal = ref(null)
  const editingTodo = ref({
    id: null,
    title: '',
    description: '',
    category: ''
  })

  // Delete confirm modal
  const confirmModal = ref(null)
  const todoToDelete = ref(null)

  onMounted(() => {
    todoStore.fetchTodos(1, todoStore.perPage)
  })

  async function handleAddTodo() {
    if (!newTodo.value.title.trim()) return
    
    await todoStore.addTodo({
      title: newTodo.value.title,
      description: newTodo.value.description || null,
      category: newTodo.value.category || null
    })
    
    newTodo.value = { title: '', description: '', category: '' }
    showAddForm.value = false
  }

  async function toggleComplete(todo) {
    await todoStore.updateTodo(todo.id, { completed: !todo.completed })
  }

  // New delete with confirm modal
  async function handleDelete(todo) {
    todoToDelete.value = todo
    const confirmed = await confirmModal.value.open()
    
    if (confirmed) {
      await todoStore.deleteTodo(todo.id)
    }
    
    todoToDelete.value = null
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }

  // Toggle expanded state
  function toggleExpand(todoId) {
    if (expandedTodos.value.has(todoId)) {
      expandedTodos.value.delete(todoId)
    } else {
      expandedTodos.value.add(todoId)
    }
    expandedTodos.value = new Set(expandedTodos.value)
  }

  function isExpanded(todoId) {
    return expandedTodos.value.has(todoId)
  }

  // Edit modal functions
  function openEditModal(todo) {
    editingTodo.value = {
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      category: todo.category || ''
    }
    editModal.value.open()
  }

  function closeEditModal() {
    editModal.value.close()
  }

  async function saveEdit() {
    await todoStore.updateTodo(editingTodo.value.id, {
      title: editingTodo.value.title,
      description: editingTodo.value.description || null,
      category: editingTodo.value.category || null
    })
    closeEditModal()
  }

  // Pagination handlers
  function handlePageChange(page) {
    todoStore.fetchTodos(page, todoStore.perPage)
  }

  function handlePerPageChange(perPage) {
    todoStore.fetchTodos(1, perPage)
  }

  return {
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
    // Confirm modal
    confirmModal,
    todoToDelete
  }
}