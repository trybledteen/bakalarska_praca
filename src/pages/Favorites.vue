<script setup>
import Card from '../components/Card.vue'
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()
</script>

<template>
  <div class="p-10">
    <h2 class="text-3xl font-bold mb-8">Schránka</h2>

    <div v-if="store.filteredFavorites.length === 0" class="text-gray-400">
      Žiadne obľúbené položky
    </div>

    <div v-else class="grid grid-cols-4 gap-5">
      <Card
        v-for="item in store.filteredFavorites"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :imageUrl="item.imageUrl"
        :price="item.price"
        :gender="item.gender"
        :isFavorite="item.isFavorite"
        :onClickFavorite="() => store.toggleFavorite(item)"
      />
    </div>
  </div>
</template>