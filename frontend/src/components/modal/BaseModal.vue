<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="handleClose"
      ></div>
    </Transition>

    <!-- Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          class="bg-white rounded-xl shadow-2xl w-full max-w-md"
          :class="sizeClass"
          @click.stop
        >
          <!-- Header -->
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h5 class="text-lg font-semibold text-gray-800">{{ title }}</h5>
            <button 
              v-if="showCloseButton"
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="showFooter" class="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <slot name="footer">
              <button 
                @click="handleClose"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="handleSave"
                :disabled="saveDisabled"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saveText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const isOpen = ref(false)

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  return sizes[props.size] || 'max-w-md'
})

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function handleSave() {
  emit('save')
}

function handleClose() {
  close()
  emit('close')
}

defineExpose({ open, close })
</script>