<script setup lang="ts">
import { computed } from 'vue'
import { useCategoriesStore } from '../stores/categories'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const categoriesStore = useCategoriesStore()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="category-selector">
    <el-select
      :model-value="selectedValue"
      @update:model-value="emit('update:modelValue', $event)"
      placeholder="选择分类"
      popper-class="category-dropdown"
    >
      <template #prefix>
        <div
          class="selected-color"
          v-if="selectedValue"
          :style="{ backgroundColor: categoriesStore.getCategoryById(selectedValue)?.color }"
        ></div>
      </template>

      <el-option
        v-for="category in categoriesStore.categories"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      >
        <div class="category-option">
          <div class="color-dot" :style="{ backgroundColor: category.color }"></div>
          <span>{{ category.name }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<style scoped>
.category-selector {
  display: inline-block;
  width: 100%;
  max-width: 200px;
}

.category-selector :deep(.el-input__wrapper) {
  padding-left: 0.5rem;
  box-shadow: 0 0 0 1px var(--border-color) inset;
  transition: all var(--transition-fast) ease;
}

.category-selector :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

.category-selector :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

.selected-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: var(--shadow-sm);
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast) ease;
}

:deep(.el-select-dropdown__item.selected) .color-dot {
  transform: scale(1.2);
}

:deep(.el-select-dropdown__item:hover) .color-dot {
  transform: scale(1.1);
}
</style>
