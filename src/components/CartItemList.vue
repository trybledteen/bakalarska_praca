<script setup>
import CartItem from './CartItem.vue'
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()
</script>

<template>
  <div class="flex flex-col flex-1 gap-4">
    <CartItem
      v-for="item in store.cart"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :size="item.size"
      :gender="item.gender"
      :quantity="item.quantity"
    />

    <p v-if="store.cart.length === 0" class="text-gray-400 text-center mt-10">
      Košík je prázdny
    </p>
  </div>
</template>