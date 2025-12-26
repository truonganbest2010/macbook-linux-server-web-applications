import { ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'

export function useModal(modalRef) {
  let modalInstance = null

  onMounted(() => {
    if (modalRef.value) {
      modalInstance = new Modal(modalRef.value)
    }
  })

  onUnmounted(() => {
    if (modalInstance) {
      modalInstance.dispose()
    }
  })

  function open() {
    if (modalInstance) {
      modalInstance.show()
    }
  }

  function close() {
    if (modalInstance) {
      modalInstance.hide()
    }
  }

  return {
    open,
    close
  }
}