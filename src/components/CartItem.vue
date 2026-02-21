<script setup>
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()

defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  size: String,
  gender: String,
  quantity: Number,
})
</script>

<template>
  <div class="flex items-center border border-gray-300 p-4 rounded-xl gap-4 bg-gray-custom shadow-xl">
    <img class="w-18 h-18" :src="imageUrl" alt="Sneaker" />
    <div class="flex flex-col w-full">
  <p>{{ title }}</p>
  <span class="text-sm text-gray-400">{{ gender }}</span>
  <span v-if="size" class="text-sm text-gray-400">Veľkosť: {{ size }}</span>
  
  <div class="flex justify-between items-center mt-2">
    <b>{{ price * quantity }} €</b>
    
    <div class="flex items-center gap-2">
      <button 
        @click="store.updateQuantity(id, size, quantity - 1)"
        class="w-6 h-6 rounded-full bg-zinc-400 flex items-center justify-center hover:bg-gray-500 cursor-pointer"
        >-</button>
      <span>{{ quantity }}</span>
      <button 
        @click="store.updateQuantity(id, size, quantity + 1)"
        class="w-6 h-6 rounded-full bg-zinc-400 flex items-center justify-center hover:bg-gray-500 cursor-pointer"
      >+</button>
      <img
        class="w-6 opacity-30 hover:opacity-100 cursor-pointer transition ml-2"
        src="/src/assets/icons/cross.svg"
        @click="store.removeFromCart(id, size)"
      />
    </div>
  </div>
</div>
  </div>
</template>