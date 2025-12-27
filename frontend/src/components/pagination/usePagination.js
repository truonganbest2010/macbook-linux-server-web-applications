import { computed } from 'vue'

export function usePagination(props) {
  const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.perPage)
  })

  const startItem = computed(() => {
    if (props.totalItems === 0) return 0
    return (props.currentPage - 1) * props.perPage + 1
  })

  const endItem = computed(() => {
    return Math.min(props.currentPage * props.perPage, props.totalItems)
  })

  const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = props.currentPage
    
    if (total <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current
      let start = Math.max(1, current - 2)
      let end = Math.min(total, current + 2)
      
      // Adjust if at start
      if (current <= 3) {
        end = 5
      }
      // Adjust if at end
      if (current >= total - 2) {
        start = total - 4
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  })

  const canGoPrev = computed(() => props.currentPage > 1)
  const canGoNext = computed(() => props.currentPage < totalPages.value)

  return {
    totalPages,
    startItem,
    endItem,
    visiblePages,
    canGoPrev,
    canGoNext
  }
}