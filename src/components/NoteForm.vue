<script setup lang="ts">
import { ref } from 'vue'
import { useNotesStore } from '../stores/notes'
import CategorySelector from './CategorySelector.vue'

const notesStore = useNotesStore()

const noteContent = ref('')
const selectedCategory = ref('default')
const imageUrl = ref('')
const showForm = ref(false)
const hasImage = ref(false)

function handleAddNote() {
  if (!noteContent.value.trim() && !imageUrl.value) {
    return
  }

  notesStore.addNote({
    content: noteContent.value,
    category: selectedCategory.value,
    imageUrl: hasImage.value ? imageUrl.value : undefined
  })

  // Reset form
  noteContent.value = ''
  imageUrl.value = ''
  selectedCategory.value = 'default'
  hasImage.value = false
  showForm.value = false
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string
      hasImage.value = true
    }

    reader.readAsDataURL(file)
  }
}

function removeImage() {
  imageUrl.value = ''
  hasImage.value = false
}

function toggleForm() {
  showForm.value = !showForm.value
}
</script>

<template>
  <div class="note-form-container">
    <button
      class="add-button"
      @click="toggleForm"
      :class="{ 'is-active': showForm }"
    >
      <div class="button-content">
        <el-icon v-if="!showForm"><Plus /></el-icon>
        <el-icon v-else><Close /></el-icon>
        <span>{{ showForm ? '取消' : '添加新笔记' }}</span>
      </div>
    </button>

    <div v-if="showForm" class="form-card">
      <div class="form-header">
        <h2>
          <el-icon><EditPen /></el-icon>
          添加新笔记
        </h2>
      </div>

      <div class="form-content">
        <div class="input-group">
          <label for="note-content">笔记内容</label>
          <el-input
            id="note-content"
            v-model="noteContent"
            type="textarea"
            rows="4"
            placeholder="记录你的想法、任务或灵感..."
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </div>

        <div class="image-section">
          <div class="image-header">
            <h3>
              <el-icon><Picture /></el-icon>
              添加图片
            </h3>
            <el-switch
              v-model="hasImage"
              active-color="var(--primary-color)"
              inactive-color="var(--text-tertiary)"
            />
          </div>

          <div v-if="hasImage" class="image-content">
            <div class="image-upload">
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
                id="image-upload"
              />
              <label for="image-upload" class="upload-button">
                <el-icon><Upload /></el-icon>
                <span>选择图片</span>
              </label>

              <div v-if="imageUrl" class="file-info">
                <span class="file-name">已选择图片</span>
                <button class="remove-button" @click="removeImage">
                  <el-icon><Delete /></el-icon>
                </button>
              </div>
            </div>

            <div v-if="imageUrl" class="image-preview">
              <img :src="imageUrl" alt="Preview" />
            </div>
          </div>
        </div>

        <div class="category-section">
          <h3>
            <el-icon><Files /></el-icon>
            选择分类
          </h3>
          <CategorySelector v-model="selectedCategory" />
        </div>

        <div class="form-footer">
          <button class="save-button" @click="handleAddNote">
            <el-icon><Check /></el-icon>
            保存笔记
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-form-container {
  margin-bottom: 2rem;
}

.add-button {
  width: 100%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border: 2px dashed var(--primary-color);
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal) ease;
}

.add-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-style: solid;
}

.add-button.is-active {
  background-color: var(--danger-color);
  color: white;
  border-color: var(--danger-color);
  border-style: solid;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-card {
  margin-top: 1rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.form-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.image-section, .category-section {
  background-color: var(--card-background);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.image-header, .category-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.image-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
}

.upload-button:hover {
  background-color: var(--primary-hover);
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-name {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  background-color: var(--primary-light);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--danger-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
}

.remove-button:hover {
  background-color: #d32f2f;
}

.image-preview {
  margin-top: 1rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--card-background);
  text-align: center;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
  box-shadow: var(--shadow-sm);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
}

.save-button:hover {
  background-color: #0d9669;
}

@media (max-width: 768px) {
  .form-card {
    padding: 1rem;
  }

  .image-section, .category-section {
    padding: 0.75rem;
  }
}
</style>
