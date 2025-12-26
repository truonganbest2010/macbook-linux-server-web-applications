import { ref, onMounted } from 'vue'
import { useYtUrlStore } from '../../stores/ytUrlStore'

export function useYtUrlApp() {
  const ytUrlStore = useYtUrlStore()

  const showAddForm = ref(false)
  const newUrl = ref({
    url: '',
    description: ''
  })

  onMounted(() => {
    ytUrlStore.fetchUrls()
  })

  async function handleAddUrl() {
    if (!newUrl.value.url.trim()) return
    
    await ytUrlStore.addYtUrl({
      url: newUrl.value.url,
      description: newUrl.value.description || null
    })
    
    // Reset form
    newUrl.value = { url: '', description: '' }
    showAddForm.value = false
  }

  async function toggleComplete(urlItem) {
    await ytUrlStore.updateYtUrl(urlItem.id, { 
      complete_status: !urlItem.complete_status 
    })
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this URL?')) {
      await ytUrlStore.deleteYtUrl(id)
    }
  }

  function openUrl(url) {
    window.open(url, '_blank')
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }

  return {
    ytUrlStore,
    showAddForm,
    newUrl,
    handleAddUrl,
    toggleComplete,
    handleDelete,
    openUrl,
    formatDate
  }
}