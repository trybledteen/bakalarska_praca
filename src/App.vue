<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

const isDrawerOpen = ref(false)
</script>

<template>
  <Drawer v-if="isDrawerOpen" :onClose="() => isDrawerOpen = false" />
  <div class="bg-gray-200 w-4/5 m-auto rounded-3xl shadow-xl mt-14">
    <Header :onOpenDrawer="() => (isDrawerOpen = !isDrawerOpen)" />
    <RouterView />
  </div>
</template>