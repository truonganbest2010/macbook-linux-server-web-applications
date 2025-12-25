import { ref, onMounted } from 'vue'
import { useUrlStore } from '../../stores/urlStore'

export function useUrlApp() {
  const urlStore = useUrlStore()

  const showAddForm = ref(false)
  const newUrl = ref({
    url: '',
    description: ''
  })

  onMounted(() => {
    urlStore.fetchUrls()
  })

  async function handleAddUrl() {
    if (!newUrl.value.url.trim()) return
    
    await urlStore.addUrl({
      url: newUrl.value.url,
      description: newUrl.value.description || null
    })
    
    // Reset form
    newUrl.value = { url: '', description: '' }
    showAddForm.value = false
  }

  async function toggleComplete(urlItem) {
    await urlStore.updateUrl(urlItem.id, { 
      complete_status: !urlItem.complete_status 
    })
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this URL?')) {
      await urlStore.deleteUrl(id)
    }
  }

  function openUrl(url) {
    window.open(url, '_blank')
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }

  return {
    urlStore,
    showAddForm,
    newUrl,
    handleAddUrl,
    toggleComplete,
    handleDelete,
    openUrl,
    formatDate
  }
}