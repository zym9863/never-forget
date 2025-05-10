import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Category {
  id: string
  name: string
  color: string
}

// 默认分类
const defaultCategories: Category[] = [
  { id: 'default', name: '默认', color: '#409EFF' },
  { id: 'work', name: '工作', color: '#67C23A' },
  { id: 'personal', name: '个人', color: '#E6A23C' },
  { id: 'important', name: '重要', color: '#F56C6C' }
]

export const useCategoriesStore = defineStore('categories', () => {
  // 从localStorage加载分类数据
  const loadCategories = (): Category[] => {
    const savedCategories = localStorage.getItem('never-forget-categories')
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories)
        return Array.isArray(parsedCategories) ? parsedCategories : defaultCategories
      } catch (e) {
        console.error('Failed to parse categories from localStorage:', e)
        return defaultCategories
      }
    }
    return defaultCategories
  }

  const categories = ref<Category[]>(loadCategories())

  // 监听分类变化并保存到localStorage
  watch(categories, (newCategories) => {
    localStorage.setItem('never-forget-categories', JSON.stringify(newCategories))
  }, { deep: true })

  function addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>) {
    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      return categories.value[index]
    }
    return null
  }

  function deleteCategory(id: string) {
    // Don't allow deleting the default category
    if (id === 'default') return false

    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      return true
    }
    return false
  }

  function getCategoryById(id: string) {
    return categories.value.find(category => category.id === id) || null
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  }
})
