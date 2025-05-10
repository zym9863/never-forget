<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'location-selected', location: { name: string; coordinates?: { latitude: number; longitude: number } }): void
}>()

const locationName = ref('')
const useCurrentLocation = ref(false)
const coordinates = ref<{ latitude: number; longitude: number } | null>(null)

function handleLocationSelect() {
  if (!locationName.value.trim()) {
    return
  }
  
  const location = {
    name: locationName.value,
    coordinates: coordinates.value || undefined
  }
  
  emit('location-selected', location)
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordinates.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        useCurrentLocation.value = true
      },
      (error) => {
        console.error('Error getting location:', error)
        useCurrentLocation.value = false
      }
    )
  } else {
    console.error('Geolocation is not supported by this browser.')
    useCurrentLocation.value = false
  }
}
</script>

<template>
  <div class="location-picker">
    <div class="location-input">
      <el-input
        v-model="locationName"
        placeholder="输入地点名称"
      />
      
      <el-checkbox v-model="useCurrentLocation" @change="getCurrentLocation">
        使用当前位置
      </el-checkbox>
    </div>
    
    <div v-if="coordinates" class="coordinates">
      <p>纬度: {{ coordinates.latitude }}</p>
      <p>经度: {{ coordinates.longitude }}</p>
    </div>
    
    <el-button @click="handleLocationSelect" type="primary">确认地点</el-button>
  </div>
</template>

<style scoped>
.location-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coordinates {
  font-size: 0.8rem;
  color: #606266;
}
</style>
