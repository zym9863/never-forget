<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRemindersStore } from '../stores/reminders'
import type { Note } from '../stores/notes'

const props = defineProps<{
  note: Note
  categoryName: string
  categoryColor: string
}>()

const remindersStore = useRemindersStore()
const reminders = computed(() => remindersStore.getRemindersByNoteId(props.note.id))
const hasReminders = computed(() => reminders.value.length > 0)

// 计算提醒类型
const reminderTypes = computed(() => {
  const types = {
    time: false,
    location: false,
    contact: false
  }

  reminders.value.forEach(reminder => {
    if (reminder.time) types.time = true
    if (reminder.location) types.location = true
    if (reminder.contact) types.contact = true
  })

  return types
})

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.note.createdAt)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
})
</script>

<template>
  <div class="note-card">
    <div class="note-header">
      <div class="category-tag" :style="{ backgroundColor: categoryColor }">
        {{ categoryName }}
      </div>
      <div class="date">
        <el-icon><Calendar /></el-icon>
        {{ formattedDate }}
      </div>
    </div>

    <div class="note-content">
      <p v-if="note.content" class="text-content">{{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}</p>

      <div v-if="note.imageUrl" class="image-content">
        <img :src="note.imageUrl" alt="Note image" />
      </div>
    </div>

    <div class="note-footer">
      <div class="reminder-tags" v-if="hasReminders">
        <el-tooltip content="时间提醒" placement="top" v-if="reminderTypes.time">
          <div class="reminder-icon time">
            <el-icon><Clock /></el-icon>
          </div>
        </el-tooltip>

        <el-tooltip content="地点提醒" placement="top" v-if="reminderTypes.location">
          <div class="reminder-icon location">
            <el-icon><Location /></el-icon>
          </div>
        </el-tooltip>

        <el-tooltip content="联系人提醒" placement="top" v-if="reminderTypes.contact">
          <div class="reminder-icon contact">
            <el-icon><User /></el-icon>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-normal) ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--primary-color);
  opacity: 0;
  transition: opacity var(--transition-normal) ease;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.note-card:hover::before {
  opacity: 1;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-tag {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-md);
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}

.date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.note-content {
  flex: 1;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.text-content {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--hover-background);
}

.image-content img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  transition: transform var(--transition-normal) ease;
}

.note-card:hover .image-content img {
  transform: scale(1.05);
}

.note-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.reminder-tags {
  display: flex;
  gap: 0.5rem;
}

.reminder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  color: white;
  font-size: 0.9rem;
}

.reminder-icon.time {
  background-color: var(--success-color);
}

.reminder-icon.location {
  background-color: var(--warning-color);
}

.reminder-icon.contact {
  background-color: var(--info-color);
}

@media (max-width: 768px) {
  .note-card {
    padding: 1rem;
  }

  .category-tag {
    padding: 0.15rem 0.5rem;
    font-size: 0.7rem;
  }
}
</style>
