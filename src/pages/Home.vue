<script setup>
import CardList from '../components/CardList.vue'
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold">Všetky tenisky</h2>

      <div class="flex gap-4">
        <select v-model="store.selectedGender" class="py-2 px-3 border rounded-md outline-none focus: border-gray-300">
          <option value="">Všetky</option>
          <option value="dámske">Dámske</option>
          <option value="pánske">Pánske</option>
        </select>

        <div class="relative">
          <img class="absolute left-4 top-3 w-4" src="../assets/icons/search.svg" />
          <input
            v-model="store.searchQuery"
            class="border rounded-md py-2 pl-11 pr-4 outline-none focus: border-gray-300"
            type="text"
            placeholder="Hľadať..."
          />
        </div>
      </div>
    </div>

    <CardList />
  </div>
</template>