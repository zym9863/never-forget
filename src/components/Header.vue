<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const activeRoute = computed(() => route.path)

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo" @click="navigateTo('/')">
        <div class="logo-icon">
          <el-icon><Memo /></el-icon>
        </div>
        <h1>忘不了</h1>
      </div>

      <nav class="navigation">
        <div class="nav-links">
          <div
            class="nav-item"
            :class="{ active: activeRoute === '/' }"
            @click="navigateTo('/')"
          >
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </div>

          <div
            class="nav-item"
            :class="{ active: activeRoute === '/categories' }"
            @click="navigateTo('/categories')"
          >
            <el-icon><Files /></el-icon>
            <span>分类管理</span>
          </div>

          <div
            class="nav-item"
            :class="{ active: activeRoute === '/reminders' }"
            @click="navigateTo('/reminders')"
          >
            <el-icon><Bell /></el-icon>
            <span>提醒管理</span>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--card-background);
  box-shadow: var(--shadow-md);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform var(--transition-fast) ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), var(--info-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navigation {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  color: var(--text-secondary);
  font-weight: 500;
}

.nav-item:hover {
  background-color: var(--hover-background);
  color: var(--primary-color);
}

.nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 0.5rem;
  }

  .logo h1 {
    font-size: 1.2rem;
  }
}
</style>
