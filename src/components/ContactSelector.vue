<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'contact-selected', contact: { name: string; id: string }): void
}>()

const contactName = ref('')
const contactId = ref('')
const contacts = ref([
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' }
])

function handleContactSelect() {
  if (!contactName.value.trim()) {
    return
  }
  
  const contact = {
    name: contactName.value,
    id: contactId.value || Date.now().toString()
  }
  
  emit('contact-selected', contact)
}

function handleSelectExisting(contact: { id: string; name: string }) {
  contactName.value = contact.name
  contactId.value = contact.id
}
</script>

<template>
  <div class="contact-selector">
    <div class="contact-input">
      <el-input
        v-model="contactName"
        placeholder="输入联系人姓名"
      />
    </div>
    
    <div class="existing-contacts">
      <h4>选择已有联系人</h4>
      <div class="contacts-list">
        <el-tag
          v-for="contact in contacts"
          :key="contact.id"
          @click="handleSelectExisting(contact)"
          :effect="contactId === contact.id ? 'dark' : 'plain'"
          class="contact-tag"
        >
          {{ contact.name }}
        </el-tag>
      </div>
    </div>
    
    <el-button @click="handleContactSelect" type="primary">确认联系人</el-button>
  </div>
</template>

<style scoped>
.contact-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.existing-contacts {
  margin-top: 0.5rem;
}

.contacts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.contact-tag {
  cursor: pointer;
}
</style>
