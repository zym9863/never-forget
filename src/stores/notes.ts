import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Note {
  id: string
  content: string
  category: string
  createdAt: Date
  imageUrl?: string
}

// 用于序列化和反序列化Date对象
const serializeNote = (note: Note): any => ({
  ...note,
  createdAt: note.createdAt.toISOString()
})

const deserializeNote = (note: any): Note => ({
  ...note,
  createdAt: new Date(note.createdAt)
})

export const useNotesStore = defineStore('notes', () => {
  // 从localStorage加载笔记数据
  const loadNotes = (): Note[] => {
    const savedNotes = localStorage.getItem('never-forget-notes')
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        return Array.isArray(parsedNotes)
          ? parsedNotes.map(deserializeNote)
          : []
      } catch (e) {
        console.error('Failed to parse notes from localStorage:', e)
        return []
      }
    }
    return []
  }

  const notes = ref<Note[]>(loadNotes())

  // 监听笔记变化并保存到localStorage
  watch(notes, (newNotes) => {
    localStorage.setItem(
      'never-forget-notes',
      JSON.stringify(newNotes.map(serializeNote))
    )
  }, { deep: true })

  function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    notes.value.push(newNote)
    return newNote
  }

  function updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates }
      return notes.value[index]
    }
    return null
  }

  function deleteNote(id: string) {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      return true
    }
    return false
  }

  function getNoteById(id: string) {
    return notes.value.find(note => note.id === id) || null
  }

  function getNotesByCategory(category: string) {
    return notes.value.filter(note => note.category === category)
  }

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByCategory
  }
})
