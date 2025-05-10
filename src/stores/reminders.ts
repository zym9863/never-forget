import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Reminder {
  id: string
  noteId: string
  time?: Date
  location?: {
    name: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  contact?: {
    name: string
    id: string
  }
}

// 用于序列化和反序列化Date对象
const serializeReminder = (reminder: Reminder): any => {
  const serialized: any = { ...reminder }
  if (reminder.time) {
    serialized.time = reminder.time.toISOString()
  }
  return serialized
}

const deserializeReminder = (reminder: any): Reminder => {
  const deserialized = { ...reminder }
  if (reminder.time) {
    deserialized.time = new Date(reminder.time)
  }
  return deserialized
}

export const useRemindersStore = defineStore('reminders', () => {
  // 从localStorage加载提醒数据
  const loadReminders = (): Reminder[] => {
    const savedReminders = localStorage.getItem('never-forget-reminders')
    if (savedReminders) {
      try {
        const parsedReminders = JSON.parse(savedReminders)
        return Array.isArray(parsedReminders)
          ? parsedReminders.map(deserializeReminder)
          : []
      } catch (e) {
        console.error('Failed to parse reminders from localStorage:', e)
        return []
      }
    }
    return []
  }

  const reminders = ref<Reminder[]>(loadReminders())

  // 监听提醒变化并保存到localStorage
  watch(reminders, (newReminders) => {
    localStorage.setItem(
      'never-forget-reminders',
      JSON.stringify(newReminders.map(serializeReminder))
    )
  }, { deep: true })

  function addReminder(reminder: Omit<Reminder, 'id'>) {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString()
    }
    reminders.value.push(newReminder)
    return newReminder
  }

  function updateReminder(id: string, updates: Partial<Omit<Reminder, 'id'>>) {
    const index = reminders.value.findIndex(reminder => reminder.id === id)
    if (index !== -1) {
      reminders.value[index] = { ...reminders.value[index], ...updates }
      return reminders.value[index]
    }
    return null
  }

  function deleteReminder(id: string) {
    const index = reminders.value.findIndex(reminder => reminder.id === id)
    if (index !== -1) {
      reminders.value.splice(index, 1)
      return true
    }
    return false
  }

  function getReminderById(id: string) {
    return reminders.value.find(reminder => reminder.id === id) || null
  }

  function getRemindersByNoteId(noteId: string) {
    return reminders.value.filter(reminder => reminder.noteId === noteId)
  }

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getReminderById,
    getRemindersByNoteId
  }
})
