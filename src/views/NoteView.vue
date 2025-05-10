<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes'
import { useRemindersStore } from '../stores/reminders'
import Header from '../components/Header.vue'
import ReminderForm from '../components/ReminderForm.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const remindersStore = useRemindersStore()

const noteId = computed(() => route.params.id as string)
const note = computed(() => notesStore.getNoteById(noteId.value))
const reminders = computed(() => remindersStore.getRemindersByNoteId(noteId.value))

const isEditing = ref(false)
const editedContent = ref('')
const editedImageUrl = ref('')
const hasImage = ref(false)

onMounted(() => {
  if (note.value) {
    editedContent.value = note.value.content
    editedImageUrl.value = note.value.imageUrl || ''
    hasImage.value = !!note.value.imageUrl
  } else {
    // Note not found, redirect to home
    router.push('/')
  }
})

function handleEdit() {
  isEditing.value = true
}

function handleSave() {
  if (note.value) {
    notesStore.updateNote(noteId.value, {
      content: editedContent.value,
      imageUrl: hasImage.value ? editedImageUrl.value : undefined
    })
    isEditing.value = false
  }
}

function handleCancel() {
  if (note.value) {
    editedContent.value = note.value.content
    editedImageUrl.value = note.value.imageUrl || ''
    hasImage.value = !!note.value.imageUrl
  }
  isEditing.value = false
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      editedImageUrl.value = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }
}

function removeImage() {
  editedImageUrl.value = ''
}

function handleDelete() {
  if (note.value) {
    // Delete all reminders associated with this note
    reminders.value.forEach(reminder => {
      remindersStore.deleteReminder(reminder.id)
    })

    // Delete the note
    notesStore.deleteNote(noteId.value)
    router.push('/')
  }
}
</script>

<template>
  <div class="note-view">
    <Header />

    <main class="main-content" v-if="note">
      <div class="note-header">
        <h1>笔记详情</h1>
        <div class="note-actions">
          <el-button v-if="!isEditing" type="primary" @click="handleEdit">编辑</el-button>
          <template v-else>
            <el-button type="success" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </template>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
      </div>

      <div class="note-content">
        <div v-if="!isEditing" class="content-display">
          <p v-if="note.content" class="note-text">{{ note.content }}</p>
          <div v-if="note.imageUrl" class="image-display">
            <img :src="note.imageUrl" alt="Note image" />
          </div>
        </div>
        <div v-else class="content-edit">
          <el-input
            v-model="editedContent"
            type="textarea"
            rows="5"
            placeholder="编辑笔记内容..."
          />

          <div class="image-section">
            <div class="image-header">
              <h3>图片</h3>
              <el-switch v-model="hasImage" />
            </div>

            <template v-if="hasImage">
              <div class="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
                <el-button>选择图片</el-button>
                <span v-if="editedImageUrl" class="file-name">已选择图片</span>
                <el-button v-if="editedImageUrl" type="danger" size="small" @click="removeImage">移除图片</el-button>
              </div>

              <div v-if="editedImageUrl" class="image-preview">
                <img :src="editedImageUrl" alt="Preview" />
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="note-meta">
        <p>创建时间: {{ new Date(note.createdAt).toLocaleString() }}</p>
        <p>分类: {{ note.category }}</p>
      </div>

      <div class="reminders-section">
        <h2>提醒</h2>
        <div v-if="reminders.length > 0" class="reminders-list">
          <div v-for="reminder in reminders" :key="reminder.id" class="reminder-item">
            <div v-if="reminder.time">
              <p>时间: {{ new Date(reminder.time).toLocaleString() }}</p>
            </div>
            <div v-if="reminder.location">
              <p>地点: {{ reminder.location.name }}</p>
            </div>
            <div v-if="reminder.contact">
              <p>联系人: {{ reminder.contact.name }}</p>
            </div>
            <el-button
              size="small"
              type="danger"
              @click="remindersStore.deleteReminder(reminder.id)"
            >
              删除
            </el-button>
          </div>
        </div>
        <div v-else class="no-reminders">
          <p>暂无提醒</p>
        </div>

        <ReminderForm :noteId="noteId" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.note-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.note-content {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--card-background);
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.content-display {
  white-space: pre-wrap;
  color: var(--text-primary);
}

.note-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.image-display {
  margin-top: 1rem;
  text-align: center;
}

.image-display img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.image-section {
  margin-top: 1rem;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.image-upload {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.note-meta {
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: var(--hover-background);
  border-radius: var(--border-radius-md);
}

.note-meta p {
  margin: 0.5rem 0;
}

.reminders-section {
  margin-top: 2rem;
}

.reminders-list {
  margin-bottom: 1rem;
}

.reminder-item {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.reminder-item p {
  margin: 0.25rem 0;
  color: var(--text-primary);
}

.no-reminders {
  color: var(--text-secondary);
  font-style: italic;
  padding: 0.75rem;
  background-color: var(--hover-background);
  border-radius: var(--border-radius-md);
  text-align: center;
}
</style>
