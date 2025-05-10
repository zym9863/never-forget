<script setup lang="ts">
import { computed } from 'vue'
import { useRemindersStore } from '../stores/reminders'
import { useNotesStore } from '../stores/notes'
import Header from '../components/Header.vue'

const remindersStore = useRemindersStore()
const notesStore = useNotesStore()

const remindersWithNotes = computed(() => {
  return remindersStore.reminders.map(reminder => {
    const note = notesStore.getNoteById(reminder.noteId)
    return {
      ...reminder,
      note
    }
  })
})

function handleDeleteReminder(id: string) {
  remindersStore.deleteReminder(id)
}
</script>

<template>
  <div class="reminder-view">
    <Header />

    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>
            <el-icon><Bell /></el-icon>
            提醒管理
          </h1>
        </div>

        <div v-if="remindersWithNotes.length > 0" class="reminders-list">
          <div v-for="item in remindersWithNotes" :key="item.id" class="reminder-card">
            <div class="card-header">
              <div class="header-title">
                <el-icon><Notification /></el-icon>
                <span>提醒详情</span>
              </div>
              <button
                class="delete-button"
                @click="handleDeleteReminder(item.id)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>

            <div class="reminder-details">
              <div class="note-preview">
                <h3>
                  <el-icon><Document /></el-icon>
                  关联笔记
                </h3>
                <router-link :to="`/note/${item.noteId}`" class="note-link">
                  <div class="note-content">
                    <p v-if="item.note">{{ item.note.content.substring(0, 100) }}{{ item.note.content.length > 100 ? '...' : '' }}</p>
                    <p v-else class="not-found">笔记不存在</p>
                  </div>
                  <div class="view-more">
                    <el-icon><ArrowRight /></el-icon>
                    查看详情
                  </div>
                </router-link>
              </div>

              <div class="reminder-conditions">
                <h3>
                  <el-icon><AlarmClock /></el-icon>
                  提醒条件
                </h3>
                <div class="conditions-list">
                  <div v-if="item.time" class="condition time">
                    <div class="condition-icon">
                      <el-icon><Clock /></el-icon>
                    </div>
                    <div class="condition-content">
                      <div class="condition-label">时间</div>
                      <div class="condition-value">{{ new Date(item.time).toLocaleString() }}</div>
                    </div>
                  </div>

                  <div v-if="item.location" class="condition location">
                    <div class="condition-icon">
                      <el-icon><Location /></el-icon>
                    </div>
                    <div class="condition-content">
                      <div class="condition-label">地点</div>
                      <div class="condition-value">{{ item.location.name }}</div>
                    </div>
                  </div>

                  <div v-if="item.contact" class="condition contact">
                    <div class="condition-icon">
                      <el-icon><User /></el-icon>
                    </div>
                    <div class="condition-content">
                      <div class="condition-label">联系人</div>
                      <div class="condition-value">{{ item.contact.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-reminders">
          <el-empty
            description="暂无提醒"
            :image-size="200"
          >
            <template #description>
              <p>还没有添加任何提醒，请在笔记详情页面添加提醒。</p>
            </template>
            <router-link to="/" class="go-home">
              <el-button type="primary">
                <el-icon><HomeFilled /></el-icon>
                返回首页
              </el-button>
            </router-link>
          </el-empty>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.reminder-view {
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

.reminders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.reminder-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
}

.reminder-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
}

.delete-button:hover {
  background-color: var(--danger-color);
}

.reminder-details {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.note-preview h3, .reminder-conditions h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  font-size: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.note-link {
  display: block;
  padding: 0.75rem;
  background-color: var(--hover-background);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  transition: background-color var(--transition-fast) ease;
}

.note-link:hover {
  background-color: var(--primary-light);
}

.note-content {
  margin-bottom: 0.5rem;
}

.note-content p {
  margin: 0;
  line-height: 1.5;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--primary-color);
  justify-content: flex-end;
}

.not-found {
  color: var(--text-tertiary);
  font-style: italic;
}

.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.condition {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  background-color: var(--hover-background);
}

.condition.time {
  border-left: 3px solid var(--success-color);
}

.condition.location {
  border-left: 3px solid var(--warning-color);
}

.condition.contact {
  border-left: 3px solid var(--info-color);
}

.condition-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
}

.time .condition-icon {
  background-color: var(--success-color);
}

.location .condition-icon {
  background-color: var(--warning-color);
}

.contact .condition-icon {
  background-color: var(--info-color);
}

.condition-content {
  flex: 1;
}

.condition-label {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
}

.condition-value {
  font-weight: 500;
  color: var(--text-primary);
}

.no-reminders {
  margin-top: 3rem;
  text-align: center;
  color: var(--text-tertiary);
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.no-reminders p {
  margin-top: 1rem;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.go-home {
  display: inline-block;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.75rem;
  }

  .reminders-list {
    grid-template-columns: 1fr;
  }

  .reminder-card {
    margin-bottom: 1rem;
  }
}
</style>
