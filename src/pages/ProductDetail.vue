<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSneakersStore } from '../store/useSneakersStore.js'

const route = useRoute()
const store = useSneakersStore()
const isDbpediaOpen = ref(false)
const selectedSize = ref('')

const product = computed(() =>
  store.items.find((item) => item.id === Number(route.params.id))
)

const isCurrentSizeInCart = computed(() =>
  store.cart.some((i) => i.id === product.value?.id && i.size === selectedSize.value)
)
</script>

<template>
  <div class="p-10 px-25" v-if="product">
    <div class="flex gap-15">

      <div class="bg-gray-custom rounded-3xl p-8 w-100 flex items-center justify-center">
        <img :src="product.imageUrl" :alt="product.title" class="w-100" />
      </div>

      <div class="flex flex-col w-1/2 gap-4">
        <div class="flex items-center gap-3">
            <h2 class="text-3xl font-bold">{{ product.title }}</h2>
            <img :src="product.logoUrl" class="object-contain ml-auto w-11 h-11" />
        </div>
        <div class="flex items-center gap-3">
            <span class="text-2xl font-bold">{{ product.price }} €</span>
            <span class="text-gray-500">{{ product.gender }}</span>
        </div>

       <div class="relative">
            <select v-model="selectedSize" class="w-full py-2 px-3 bg-gray-custom rounded-xl outline-none appearance-none cursor-pointer  ">
                <option value="">Vyberte veľkosť</option>
                <option>36</option>
                <option>37</option>
                <option>38</option>
                <option>39</option>
                <option>40</option>
                <option>41</option>
                <option>42</option>
                <option>43</option>
                <option>44</option>
            </select>
            <img class="absolute right-4 top-3 w-4 pointer-events-none" src="/src/assets/icons/arrow-down.svg" />
        </div>

        <div class="flex gap-3">
            <button
            @click="store.toggleCart(product, selectedSize)"
            :disabled="!selectedSize"
            :class="!selectedSize ? 'bg-zinc-400 cursor-not-allowed' : isCurrentSizeInCart ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'"
            class="flex-1 py-3 rounded-xl font-bold text-white transition cursor-pointer"
            >
               Pridať do košíka
            </button>

          <button
            @click="store.toggleFavorite(product)"
            class=" bg-gray-custom rounded-xl px-4 cursor-pointer border border-gray-300"
          >
            <img
              :src="product.isFavorite ? '/src/assets/icons/heart1.svg' : '/src/assets/icons/heart.svg'"
              class="w-6 "
            />
          </button>
        </div>

        <div class="bg-gray-custom rounded-2xl mt-2">
            <button
                @click="isDbpediaOpen = !isDbpediaOpen"
                class="w-full flex justify-between items-center p-6 cursor-pointer"
            >
                <span class="font-bold">Informácie o produkte (DBpedia)</span>
                <span class="text-xl text-gray-500 transition-transform duration-300" :class="isDbpediaOpen ? 'rotate-180' : ''">˅</span>
            </button>
            <div v-if="isDbpediaOpen" class="px-6 pb-6">
                <p class="text-gray-400">Pripájanie k DBpedia...</p>
            </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-10 text-gray-400">
    Produkt sa nenašiel.
  </div>
</template>