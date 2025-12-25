import { ref, onMounted } from 'vue'
import api from '../../services/api'

export function useDashboard() {
  const stats = ref({
    total_todos: 0,
    completed_todos: 0,
    pending_todos: 0,
    total_urls: 0
  })
  const loading = ref(true)
  const error = ref(null)

  async function fetchStats() {
    loading.value = true
    try {
      const response = await api.get('/stats')
      stats.value = response.data
      error.value = null
    } catch (err) {
      error.value = 'Failed to load dashboard stats'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStats()
  })

  return {
    stats,
    loading,
    error,
    fetchStats
  }
}