<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const banners = [
  '/src/assets/banners/banner1.jpg',
  '/src/assets/banners/banner2.jpg',
  '/src/assets/banners/banner3.jpg',
]

const current = ref(0)
let timer = null

function next() {
  current.value = (current.value + 1) % banners.length
}

function prev() {
  current.value = (current.value - 1 + banners.length) % banners.length
}

function goTo(index) {
  current.value = index
}

onMounted(() => {
  timer = setInterval(next, 6000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl mx-10 mt-10">

    <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${current * 100}%)` }">
      <img
        v-for="(banner, index) in banners"
        :key="index"
        :src="banner"
        class="w-full shrink-0 object-cover h-98"
      />
    </div>

    <button
      @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow cursor-pointer transition"
    >
      ‹
    </button>

    <button
      @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow cursor-pointer transition"
    >
      ›
    </button>

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in banners"
        :key="index"
        @click="goTo(index)"
        class="w-2 h-2 rounded-full transition cursor-pointer"
        :class="current === index ? 'bg-white' : 'bg-white/40'"
      />
    </div>

  </div>
</template>