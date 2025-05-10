<script setup lang="ts">
import { ref } from 'vue'
import { useCategoriesStore, type Category } from '../stores/categories'
import Header from '../components/Header.vue'

const categoriesStore = useCategoriesStore()

const newCategory = ref({
  name: '',
  color: '#409EFF'
})

const editingCategory = ref<Category | null>(null)

function handleAddCategory() {
  if (newCategory.value.name.trim()) {
    categoriesStore.addCategory({
      name: newCategory.value.name,
      color: newCategory.value.color
    })
    newCategory.value.name = ''
    newCategory.value.color = '#409EFF'
  }
}

function handleEditCategory(category: Category) {
  editingCategory.value = { ...category }
}

function handleSaveEdit() {
  if (editingCategory.value && editingCategory.value.name.trim()) {
    categoriesStore.updateCategory(editingCategory.value.id, {
      name: editingCategory.value.name,
      color: editingCategory.value.color
    })
    editingCategory.value = null
  }
}

function handleCancelEdit() {
  editingCategory.value = null
}

function handleDeleteCategory(id: string) {
  if (id === 'default') {
    // Cannot delete default category
    return
  }
  categoriesStore.deleteCategory(id)
}
</script>

<template>
  <div class="category-view">
    <Header />

    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>
            <el-icon><Files /></el-icon>
            分类管理
          </h1>
        </div>

        <div class="content-grid">
          <div class="add-category">
            <div class="section-header">
              <h2>
                <el-icon><Plus /></el-icon>
                添加新分类
              </h2>
            </div>

            <div class="card-content">
              <div class="category-form">
                <div class="form-group">
                  <label for="category-name">分类名称</label>
                  <el-input
                    id="category-name"
                    v-model="newCategory.name"
                    placeholder="输入分类名称"
                    class="category-input"
                  />
                </div>

                <div class="form-group">
                  <label for="category-color">分类颜色</label>
                  <div class="color-picker-wrapper">
                    <el-color-picker
                      v-model="newCategory.color"
                      show-alpha
                      :predefine="[
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
                        '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6',
                        '#f97316', '#84cc16', '#06b6d4', '#a855f7'
                      ]"
                    />
                    <div class="color-preview" :style="{ backgroundColor: newCategory.color }"></div>
                  </div>
                </div>

                <button class="add-button" @click="handleAddCategory">
                  <el-icon><Plus /></el-icon>
                  添加分类
                </button>
              </div>
            </div>
          </div>

          <div class="categories-list">
            <div class="section-header">
              <h2>
                <el-icon><List /></el-icon>
                现有分类
              </h2>
            </div>

            <div class="categories-grid">
              <div
                v-for="category in categoriesStore.categories"
                :key="category.id"
                class="category-card"
                :style="{ borderColor: category.color }"
              >
                <div class="category-header" :style="{ backgroundColor: category.color }">
                  <template v-if="editingCategory && editingCategory.id === category.id">
                    <el-input
                      v-model="editingCategory.name"
                      size="small"
                      placeholder="分类名称"
                      class="edit-name-input"
                    />
                  </template>
                  <template v-else>
                    <h3>{{ category.name }}</h3>
                  </template>
                </div>

                <div class="category-body">
                  <div class="color-section">
                    <template v-if="editingCategory && editingCategory.id === category.id">
                      <el-color-picker
                        v-model="editingCategory.color"
                        show-alpha
                        :predefine="[
                          '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
                          '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6',
                          '#f97316', '#84cc16', '#06b6d4', '#a855f7'
                        ]"
                      />
                    </template>
                    <template v-else>
                      <div class="color-info">
                        <div class="color-preview large" :style="{ backgroundColor: category.color }"></div>
                        <span class="color-value">{{ category.color }}</span>
                      </div>
                    </template>
                  </div>

                  <div class="category-actions">
                    <template v-if="editingCategory && editingCategory.id === category.id">
                      <button class="action-button save" @click="handleSaveEdit">
                        <el-icon><Check /></el-icon>
                        保存
                      </button>
                      <button class="action-button cancel" @click="handleCancelEdit">
                        <el-icon><Close /></el-icon>
                        取消
                      </button>
                    </template>
                    <template v-else>
                      <button
                        class="action-button edit"
                        @click="handleEditCategory(category)"
                        :disabled="category.id === 'default'"
                      >
                        <el-icon><Edit /></el-icon>
                        编辑
                      </button>
                      <button
                        class="action-button delete"
                        @click="handleDeleteCategory(category.id)"
                        :disabled="category.id === 'default'"
                      >
                        <el-icon><Delete /></el-icon>
                        删除
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.category-view {
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

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.add-category, .categories-list {
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.card-content {
  padding: 1rem;
  background-color: var(--hover-background);
  border-radius: var(--border-radius-md);
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.category-input {
  width: 100%;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-preview {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.color-preview.large {
  width: 36px;
  height: 36px;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  margin-top: 0.5rem;
}

.add-button:hover {
  background-color: var(--primary-hover);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
}

.category-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.category-header {
  padding: 1rem;
  color: white;
  text-align: center;
}

.category-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.edit-name-input {
  width: 100%;
}

.category-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.color-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.color-value {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-family: monospace;
}

.category-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: var(--border-radius-md);
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.edit {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.action-button.edit:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
}

.action-button.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.action-button.delete:hover:not(:disabled) {
  background-color: var(--danger-color);
  color: white;
}

.action-button.save {
  background-color: var(--success-color);
  color: white;
}

.action-button.save:hover {
  background-color: #0d9669;
}

.action-button.cancel {
  background-color: var(--hover-background);
  color: var(--text-secondary);
}

.action-button.cancel:hover {
  background-color: var(--text-tertiary);
  color: white;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .add-category {
    margin-bottom: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
