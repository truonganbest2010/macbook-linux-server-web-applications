<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
    <!-- Info -->
    <p class="text-sm text-gray-500">
      Showing <span class="font-medium">{{ startItem }}</span> - 
      <span class="font-medium">{{ endItem }}</span> of 
      <span class="font-medium">{{ totalItems }}</span>
    </p>

    <!-- Page Controls -->
    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      <button 
        @click="onPageChange(currentPage - 1)"
        :disabled="!canGoPrev"
        class="px-3 py-1.5 rounded-lg border text-sm font-medium transition"
        :class="canGoPrev 
          ? 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        ← Prev
      </button>

      <!-- Page Numbers -->
      <div class="flex gap-1">
        <!-- First page + ellipsis -->
        <template v-if="visiblePages[0] > 1">
          <button 
            @click="onPageChange(1)"
            class="w-9 h-9 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 text-sm transition"
          >
            1
          </button>
          <span v-if="visiblePages[0] > 2" class="w-9 h-9 flex items-center justify-center text-gray-400">
            ...
          </span>
        </template>

        <!-- Visible page numbers -->
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="onPageChange(page)"
          class="w-9 h-9 rounded-lg text-sm font-medium transition"
          :class="page === currentPage 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border'"
        >
          {{ page }}
        </button>

        <!-- Last page + ellipsis -->
        <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
          <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="w-9 h-9 flex items-center justify-center text-gray-400">
            ...
          </span>
          <button 
            @click="onPageChange(totalPages)"
            class="w-9 h-9 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 text-sm transition"
          >
            {{ totalPages }}
          </button>
        </template>
      </div>

      <!-- Next Button -->
      <button 
        @click="onPageChange(currentPage + 1)"
        :disabled="!canGoNext"
        class="px-3 py-1.5 rounded-lg border text-sm font-medium transition"
        :class="canGoNext 
          ? 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        Next →
      </button>
    </div>

    <!-- Per Page Selector -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500">Show:</span>
      <select 
        :value="perPage"
        @change="onPerPageChange(Number($event.target.value))"
        class="border rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { usePagination } from './usePagination.js'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  },
  perPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50]
  }
})

const emit = defineEmits(['page-change', 'per-page-change'])

const {
  totalPages,
  startItem,
  endItem,
  visiblePages,
  canGoPrev,
  canGoNext
} = usePagination(props)

function onPageChange(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}

function onPerPageChange(perPage) {
  emit('per-page-change', perPage)
}
</script>