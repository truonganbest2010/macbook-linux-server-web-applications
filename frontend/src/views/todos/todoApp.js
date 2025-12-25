import { ref, onMounted } from 'vue'
import { useTodoStore } from '../../stores/todoStore'

export function useTodoList() {
    const todoStore = useTodoStore()
    const showAddForm = ref(false)
    const newTodo = ref({
        title: '',
        description: '',
        category: ''
        }
    )

    onMounted(() => {
        todoStore.fetchTodos()
    })

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
        formatDate
    }
}