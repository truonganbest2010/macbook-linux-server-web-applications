import { ref, onMounted, compile } from 'vue'
import { useTodoStore } from '../../stores/todoStore'

export function useTodoApp() {
    const todoStore = useTodoStore()

    const showAddForm = ref(false)
    const editingTodo = ref(null)
    const newTodo = ref({
        title: '',
        description: '',
        category: ''
        }
    )

    onMounted(() => {
        todoStore.fetchTodos()
    })

    function startEdit(todo) {
        // Copy the todo so we don't modify the original until save
        editingTodo.value = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            category: todo.category,
            completed: todo.completed,
        }
    }

    function cancelEdit() {
        editingTodo.value = null
    }

    async function saveEdit() {
        if (!editingTodo.value) return

        // Call API to update todo item
        await todoStore.updateTodo(editingTodo.value.id, {
            title: editingTodo.value.title,
            description: editingTodo.value.description,
            category: editingTodo.value.category,
            completed: editingTodo.value.completed
        })

        editingTodo.value = null
    }

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

    async function toggleComplete(todo) {
        await todoStore.updateTodo(todo.id, { completed: !todo.completed })
    }

    async function handleDelete(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            await todoStore.deleteTodo(id)
        }
    }

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
        startEdit,
        cancelEdit,
        saveEdit
    }
}