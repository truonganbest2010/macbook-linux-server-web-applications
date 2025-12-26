<template>
  <div 
    class="modal fade" 
    tabindex="-1" 
    ref="modalRef"
    :data-bs-backdrop="closeOnBackdrop ? true : 'static'"
  >
    <div class="modal-dialog" :class="modalSizeClass">
      <div class="modal-content">
        
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button 
            v-if="showCloseButton"
            type="button" 
            class="btn-close" 
            @click="handleClose"
          ></button>
        </div>
        
        <!-- Body -->
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div class="modal-footer" v-if="showFooter">
          <slot name="footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="handleClose"
            >
              {{ cancelText }}
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleSave"
              :disabled="saveDisabled"
            >
              {{ saveText }}
            </button>
          </slot>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useModal } from './useModal.js'

const props = defineProps({
  title: {
    type: String,
    default: 'Modal'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  saveText: {
    type: String,
    default: 'Save'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  saveDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])

const modalRef = ref(null)
const { open, close } = useModal(modalRef)

const modalSizeClass = computed(() => {
  const sizeMap = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }
  return sizeMap[props.size] || ''
})

function handleSave() {
  emit('save')
}

function handleClose() {
  close()
  emit('close')
}

defineExpose({ open, close })
</script>