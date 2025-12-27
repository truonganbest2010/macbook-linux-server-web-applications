<template>
  <Teleport to="body">
    <!-- Backdrop -->
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
        @click="handleCancel"
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
          class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
          @click.stop
        >
          <!-- Icon -->
          <div class="pt-6 pb-2 flex justify-center">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <!-- Danger Icon -->
              <svg v-if="type === 'danger'" class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <!-- Warning Icon -->
              <svg v-else-if="type === 'warning'" class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <!-- Info Icon -->
              <svg v-else class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 text-center">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-gray-500 text-sm">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-50 flex gap-3">
            <button 
              @click="handleCancel"
              class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="handleConfirm"
              class="flex-1 px-4 py-2.5 rounded-lg font-medium transition"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'danger',
    validator: (v) => ['danger', 'warning', 'info'].includes(v)
  },
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)
const resolvePromise = ref(null)

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-red-100'
    case 'warning': return 'bg-amber-100'
    default: return 'bg-blue-100'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-red-500 hover:bg-red-600 text-white'
    case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-white'
    default: return 'bg-blue-500 hover:bg-blue-600 text-white'
  }
})

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  
  return new Promise((resolve) => {
    resolvePromise.value = resolve
  })
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function handleConfirm() {
  close()
  if (resolvePromise.value) {
    resolvePromise.value(true)
  }
  emit('confirm')
}

function handleCancel() {
  close()
  if (resolvePromise.value) {
    resolvePromise.value(false)
  }
  emit('cancel')
}

defineExpose({ open, close })
</script>