<script setup>
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()

defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
})
</script>

<template>
  <div class="flex items-center border border-gray-300 p-4 rounded-xl gap-4 bg-gray-custom shadow-xl">
    <img class="w-18 h-18" :src="imageUrl" alt="Sneaker" />
    <div class="flex flex-col w-full">
      <p>{{ title }}</p>
      <div class="flex justify-between mt-2">
        <b>{{ price }} €</b>
        <img
          class="w-8 opacity-30 hover:opacity-100 cursor-pointer transition ml-30"
          src="/src/assets/icons/cross.svg"
          @click="store.removeFromCart(id)"
        />
      </div>
    </div>
  </div>
</template>