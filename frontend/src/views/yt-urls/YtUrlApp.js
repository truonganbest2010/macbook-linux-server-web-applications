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

  // Delete confirm modal
  const confirmModal = ref(null)
  const ytUrlToDelete = ref(null)

  onMounted(() => {
    ytUrlStore.fetchYtUrls(1, ytUrlStore.perPage)
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

  async function handleDelete(ytUrl) {
    ytUrlToDelete.value = ytUrl
    const confirmed = await confirmModal.value.open()
    
    if (confirmed) {
      await ytUrlStore.deleteYtUrl(ytUrl.id)
    }
    
    ytUrlToDelete.value = null
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

  // Pagination handlers
  function handlePageChange(page) {
    ytUrlStore.fetchYtUrls(page, ytUrlStore.perPage)
  }

  function handlePerPageChange(perPage) {
    ytUrlStore.fetchYtUrls(1, perPage)
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
    // Edit modal
    editModal,
    editingYtUrl,
    openEditModal,
    closeEditModal,
    saveEdit,
    // Confirm modal
    confirmModal,
    ytUrlToDelete,
    // Pagination
    handlePageChange,
    handlePerPageChange
  }
}