<script setup>
import { RouterLink } from 'vue-router'
import { useSneakersStore } from '../store/useSneakersStore.js'

const store = useSneakersStore()

defineProps({
  onOpenDrawer: Function,
})
</script>

<template>
  <header class="flex justify-between border-b border-gray-300 px-10 py-4">
    <RouterLink to="/" class="flex items-center gap-4">
      <img src="/src/assets/logo.png" alt="logo" class="w-11" />
      <div>
        <h2 class="uppercase text-xl font-bold">Stepway</h2>
      </div>
    </RouterLink>

    <ul class="flex items-center gap-7">
      <li
        @click="onOpenDrawer"
        class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-black"
      >
        <img src="/src/assets/icons/shopping-cart.svg" alt="cart" class="w-6" />
        <b class="uppercase">{{ store.totalPrice }} €</b>
      </li>

      <RouterLink to="/favorites" class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-black">
        <img src="/src/assets/icons/heart.svg" alt="cart" class="w-6" />
        <span class="uppercase">Schránka</span>
      </RouterLink>

      <li class="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-black">
        <img src="/src/assets/icons/user.svg" alt="cart" class="w-6" />
        <span class="uppercase">Profil</span>
      </li>
    </ul>
  </header>
</template>