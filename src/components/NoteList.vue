<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '../stores/categories'
import type { Note } from '../stores/notes'
import NoteItem from './NoteItem.vue'
import { ref, onMounted } from 'vue'

defineProps<{
  notes: Note[]
}>()

const router = useRouter()
const categoriesStore = useCategoriesStore()
const isLoaded = ref(false)

onMounted(() => {
  // 添加加载动画效果
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

function handleNoteClick(noteId: string) {
  router.push(`/note/${noteId}`)
}

function getCategoryName(categoryId: string) {
  const category = categoriesStore.getCategoryById(categoryId)
  return category ? category.name : '未分类'
}

function getCategoryColor(categoryId: string) {
  const category = categoriesStore.getCategoryById(categoryId)
  return category ? category.color : '#909399'
}
</script>

<template>
  <div class="note-list">
    <h2 v-if="notes.length > 0" class="section-title">
      <el-icon><Collection /></el-icon>
      笔记列表
    </h2>

    <div v-if="notes.length > 0" class="notes-grid" :class="{ 'is-loaded': isLoaded }">
      <div
        v-for="(note, index) in notes"
        :key="note.id"
        class="note-wrapper"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="handleNoteClick(note.id)"
      >
        <NoteItem
          :note="note"
          :categoryName="getCategoryName(note.category)"
          :categoryColor="getCategoryColor(note.category)"
        />
      </div>
    </div>

    <div v-else class="no-notes">
      <el-empty
        description="暂无笔记"
        :image-size="200"
      >
        <template #description>
          <p>还没有添加任何笔记，点击上方"添加新笔记"按钮开始记录吧！</p>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  margin-top: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.note-wrapper {
  opacity: 0;
  transform: translateY(20px);
}

.is-loaded .note-wrapper {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-notes {
  margin-top: 3rem;
  text-align: center;
  color: var(--text-tertiary);
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.no-notes p {
  margin-top: 1rem;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>
