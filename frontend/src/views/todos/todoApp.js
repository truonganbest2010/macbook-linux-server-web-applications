import { ref, onMounted, compile } from 'vue'
import { useTodoStore } from '../../stores/todoStore'

export function useTodoApp() {
    const todoStore = useTodoStore()

    const showAddForm = ref(false)
    const newTodo = ref({
        title: '',
        description: '',
        category: ''
        }
    )       

    const editModal = ref(null)
    const editingTodo = ref({
        id: null,
        title: '',
        description: '',
        category: ''
    })

    onMounted(() => {
        todoStore.fetchTodos()
    })
    
    // ==== Modal Edit (update todo) Functions ====

    // Start editing a todo
    function openEditModal(todo) {
        // Copy the todo so we don't modify the original until save
        editingTodo.value = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            category: todo.category
        }
        editModal.value.open()
    }

    // Cancel editing
    function closeEditModal() {
        editModal.value.close()
        editingTodo.value = null
    }

    // Save edited todo
    async function saveEdit() {
        // Call API to update todo item
        await todoStore.updateTodo(editingTodo.value.id, {
            title: editingTodo.value.title,
            description: editingTodo.value.description || null,
            category: editingTodo.value.category || null
        })

        closeEditModal()
    }

    // Add new todo
    async function handleAddTodo() {
        if (!newTodo.value.title.trim()) return

        await todoStore.addTodo({
            title: newTodo.value.title,
            description: newTodo.value.description || null,
            category: newTodo.value.category || null
        })

        // Reset form
        newTodo.value = { title: '', description: '', category: '' }
        showAddForm.value = false

    }

    // Toggle complete status
    async function toggleComplete(todo) {
        await todoStore.updateTodo(todo.id, { completed: !todo.completed })
    }

    // Delete todo
    async function handleDelete(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            await todoStore.deleteTodo(id)
        }
    }

    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString()
    }

    return {
        todoStore,
        showAddForm,
        newTodo,
        handleAddTodo,
        toggleComplete,
        handleDelete,
        formatDate,

        editingTodo,
        editModal,
        openEditModal,
        closeEditModal,
        saveEdit
    }
}