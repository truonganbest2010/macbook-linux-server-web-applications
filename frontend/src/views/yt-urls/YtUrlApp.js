import { ref, onMounted } from 'vue'
import { useYtUrlStore } from '../../stores/ytUrlStore'

export function useYtUrlApp() {
  const ytUrlStore = useYtUrlStore()

  const showAddForm = ref(false)
  const newYtUrl = ref({
    url: '',
    description: ''
  })

  // Edit modal state
  const editModal = ref(null)
  const editingYtUrl = ref({
    id: null,
    url: '',
    description: ''
  })

  onMounted(() => {
    ytUrlStore.fetchYtUrls()
  })

  async function handleAddYtUrl() {
    if (!newYtUrl.value.url.trim()) return
    
    await ytUrlStore.addYtUrl({
      url: newYtUrl.value.url,
      description: newYtUrl.value.description || null
    })
    
    newYtUrl.value = { url: '', description: '' }
    showAddForm.value = false
  }

  async function toggleComplete(ytUrl) {
    await ytUrlStore.updateYtUrl(ytUrl.id, { 
      complete_status: !ytUrl.complete_status 
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

  // Edit modal functions
  function openEditModal(ytUrl) {
    editingYtUrl.value = {
      id: ytUrl.id,
      url: ytUrl.url,
      description: ytUrl.description || ''
    }
    editModal.value.open()
  }

  function closeEditModal() {
    editModal.value.close()
  }

  async function saveEdit() {
    await ytUrlStore.updateYtUrl(editingYtUrl.value.id, {
      url: editingYtUrl.value.url,
      description: editingYtUrl.value.description || null
    })
    closeEditModal()
  }

  return {
    ytUrlStore,
    showAddForm,
    newYtUrl,
    handleAddYtUrl,
    toggleComplete,
    handleDelete,
    openUrl,
    formatDate,
    editModal,
    editingYtUrl,
    openEditModal,
    closeEditModal,
    saveEdit
  }
}