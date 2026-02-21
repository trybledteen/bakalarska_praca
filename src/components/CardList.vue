<script setup>
import Card from './Card.vue'
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <Card
      v-for="item in store.filteredItems"
      :key="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :gender="item.gender"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
      :onClickAdd="() => store.toggleCart(item)"
      :onClickFavorite="() => store.toggleFavorite(item)"
    />
  </div>
</template>