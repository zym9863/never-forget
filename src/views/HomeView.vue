<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '../stores/notes'
import { useCategoriesStore } from '../stores/categories'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'
import Header from '../components/Header.vue'

const notesStore = useNotesStore()
const categoriesStore = useCategoriesStore()
const activeCategory = ref('all')

const filteredNotes = computed(() => {
  if (activeCategory.value === 'all') {
    return notesStore.notes
  }
  return notesStore.getNotesByCategory(activeCategory.value)
})
</script>

<template>
  <div class="home">
    <Header />

    <main class="main-content">
      <div class="container">
        <NoteForm />

        <div class="category-filter">
          <h2 class="filter-title">
            <el-icon><Filter /></el-icon>
            筛选分类
          </h2>

          <div class="filter-buttons">
            <button
              class="category-button"
              :class="{ active: activeCategory === 'all' }"
              @click="activeCategory = 'all'"
            >
              <el-icon><Grid /></el-icon>
              <span>全部</span>
            </button>

            <button
              v-for="category in categoriesStore.categories"
              :key="category.id"
              class="category-button"
              :class="{ active: activeCategory === category.id }"
              @click="activeCategory = category.id"
              :style="activeCategory === category.id ? { backgroundColor: category.color, borderColor: category.color } : {}"
            >
              <div class="color-indicator" :style="{ backgroundColor: category.color }"></div>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>

        <NoteList :notes="filteredNotes" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-light);
}

.main-content {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-filter {
  margin: 1.5rem 0;
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.category-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: var(--primary-light);
}

.category-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.75rem;
  }

  .category-filter {
    padding: 1rem;
  }

  .category-button {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
