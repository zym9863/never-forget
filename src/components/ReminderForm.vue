<script setup lang="ts">
import { ref } from 'vue'
import { useRemindersStore } from '../stores/reminders'
import LocationPicker from './LocationPicker.vue'
import ContactSelector from './ContactSelector.vue'

const props = defineProps<{
  noteId: string
}>()

const remindersStore = useRemindersStore()

const showForm = ref(false)
const useTimeReminder = ref(false)
const useLocationReminder = ref(false)
const useContactReminder = ref(false)
const reminderTime = ref('')
const location = ref<{ name: string; coordinates?: { latitude: number; longitude: number } }>({ name: '' })
const contact = ref<{ name: string; id: string }>({ name: '', id: '' })

function handleAddReminder() {
  // 至少需要一种提醒类型
  if (!useTimeReminder.value && !useLocationReminder.value && !useContactReminder.value) {
    return
  }

  const reminder: any = {
    noteId: props.noteId
  }

  if (useTimeReminder.value && reminderTime.value) {
    reminder.time = new Date(reminderTime.value)
  }

  if (useLocationReminder.value && location.value.name) {
    reminder.location = location.value
  }

  if (useContactReminder.value && contact.value.name) {
    reminder.contact = contact.value
  }

  // 如果没有任何有效的提醒条件，则不添加
  if (!reminder.time && !reminder.location && !reminder.contact) {
    return
  }

  remindersStore.addReminder(reminder)

  // Reset form
  useTimeReminder.value = false
  useLocationReminder.value = false
  useContactReminder.value = false
  reminderTime.value = ''
  location.value = { name: '' }
  contact.value = { name: '', id: '' }
  showForm.value = false
}

function toggleForm() {
  showForm.value = !showForm.value
}

function handleLocationSelected(selectedLocation: { name: string; coordinates?: { latitude: number; longitude: number } }) {
  location.value = selectedLocation
}

function handleContactSelected(selectedContact: { name: string; id: string }) {
  contact.value = selectedContact
}
</script>

<template>
  <div class="reminder-form">
    <el-button
      type="primary"
      @click="toggleForm"
    >
      {{ showForm ? '取消' : '+ 添加提醒' }}
    </el-button>

    <el-card v-if="showForm" class="form-card">
      <div class="form-header">
        <h3>添加提醒</h3>
      </div>

      <div class="form-content">
        <div class="reminder-section">
          <div class="section-header">
            <h4>时间提醒</h4>
            <el-switch v-model="useTimeReminder" />
          </div>

          <div v-if="useTimeReminder" class="section-content">
            <el-date-picker
              v-model="reminderTime"
              type="datetime"
              placeholder="选择日期和时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
        </div>

        <div class="reminder-section">
          <div class="section-header">
            <h4>地点提醒</h4>
            <el-switch v-model="useLocationReminder" />
          </div>

          <div v-if="useLocationReminder" class="section-content">
            <LocationPicker @location-selected="handleLocationSelected" />
          </div>
        </div>

        <div class="reminder-section">
          <div class="section-header">
            <h4>联系人提醒</h4>
            <el-switch v-model="useContactReminder" />
          </div>

          <div v-if="useContactReminder" class="section-content">
            <ContactSelector @contact-selected="handleContactSelected" />
          </div>
        </div>

        <div class="form-footer">
          <el-button type="primary" @click="handleAddReminder">添加提醒</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.reminder-form {
  margin-top: 1rem;
}

.form-card {
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.form-header h3 {
  color: var(--primary-color);
  margin: 0;
  font-weight: 600;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reminder-section {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--card-background);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.section-content {
  padding-top: 0.5rem;
  background-color: var(--hover-background);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
