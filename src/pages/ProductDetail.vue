<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSneakersStore } from '../store/useSneakersStore.js'

  const route = useRoute()
  const store = useSneakersStore()
  const isDbpediaOpen = ref(false)
  const isModelOpen = ref(false)
  const selectedSize = ref('')
  const dbpediaData = ref(null)
  const dbpediaLoading = ref(false)

  const product = computed(() =>
    store.items.find((item) => item.id === Number(route.params.id))
  )

  const isCurrentSizeInCart = computed(() =>
    store.cart.some((i) => i.id === product.value?.id && i.size === selectedSize.value)
  )

  onMounted(async () => {
    if (product.value?.dbpediaKey) {
      dbpediaLoading.value = true
      try {
        const key = product.value.dbpediaKey.toLowerCase()
        const response = await fetch(`http://localhost:3001/api/brand/${encodeURIComponent(key)}`)
        dbpediaData.value = await response.json()
      } catch (error) {
        console.error('Error fetching DBpedia data:', error)
      } finally {
        dbpediaLoading.value = false
      }
    }
  })
</script>

<template>
  <div class="p-10 px-25" v-if="product">
    <div class="flex gap-15">

      <div class="bg-gray-custom rounded-3xl p-8 w-100 flex items-center justify-center self-start sticky top-10">
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
          <select v-model="selectedSize" class="w-full py-2 px-3 bg-gray-custom rounded-xl outline-none appearance-none cursor-pointer">
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
            :disabled="!selectedSize || isCurrentSizeInCart"
            :class="!selectedSize ? 'bg-zinc-400 cursor-not-allowed' : isCurrentSizeInCart ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'"
            class="flex-1 py-3 rounded-xl font-bold text-white transition cursor-pointer"
          >
            Pridať do košíka
          </button>

          <button
            @click="store.toggleFavorite(product)"
            class="bg-gray-custom rounded-xl px-4 cursor-pointer border border-gray-300"
          >
            <img
              :src="product.isFavorite ? '/src/assets/icons/heart1.svg' : '/src/assets/icons/heart.svg'"
              class="w-6"
            />
          </button>
        </div>

        <div class="bg-gray-custom rounded-2xl">
          <button
            @click="isModelOpen = !isModelOpen"
            class="w-full flex justify-between items-center p-6 cursor-pointer"
          >
            <span class="font-bold">Popis modelu</span>
            <span class="text-xl text-gray-500 transition-transform duration-300" :class="isModelOpen ? 'rotate-180' : ''">˅</span>
          </button>
          <div v-if="isModelOpen" class="px-6 pb-6">
            <p class="text-gray-600">{{ product.description }}</p>
          </div>
        </div>

        <div class="bg-gray-custom rounded-2xl">
          <button
            @click="isDbpediaOpen = !isDbpediaOpen"
            class="w-full flex justify-between items-center p-6 cursor-pointer"
          >
            <span class="font-bold">Informácie o značke (DBpedia)</span>
            <span class="text-xl text-gray-500 transition-transform duration-300" :class="isDbpediaOpen ? 'rotate-180' : ''">˅</span>
          </button>
          <div v-if="isDbpediaOpen" class="px-6 pb-6">

            <div v-if="dbpediaLoading" class="text-gray-400">Načítava sa...</div>

            <div v-else-if="dbpediaData && !dbpediaData.error">

              <p v-if="dbpediaData.description" class="text-gray-700 mb-4">
                {{ dbpediaData.description }}
              </p>

              <div class="flex flex-col gap-2 text-sm">
                <div v-if="dbpediaData.foundedYear" class="flex gap-2">
                  <span class="text-gray-500 w-28 shrink-0">Rok založenia:</span>
                  <span class="font-medium text-gray-700">{{ dbpediaData.foundedYear }}</span>
                </div>
                <div v-if="dbpediaData.location" class="flex gap-2">
                  <span class="text-gray-500 w-28 shrink-0">Sídlo:</span>
                  <span class="font-medium text-gray-700">{{ dbpediaData.location }}</span>
                </div>
                <div v-if="dbpediaData.founder" class="flex gap-2">
                  <span class="text-gray-500 w-28 shrink-0">Zakladateľ:</span>
                  <span class="font-medium text-gray-700">{{ dbpediaData.founder }}</span>
                </div>
                <div v-if="dbpediaData.website" class="flex gap-2">
                  <span class="text-gray-500 w-28 shrink-0">Web:</span>
                  <a :href="dbpediaData.website" target="_blank" class="text-blue-500 hover:underline break-all">
                    {{ dbpediaData.website }}
                  </a>
                </div>

                <div v-if="dbpediaData.categories && dbpediaData.categories.length">
                  <p class="text-gray-500 mb-2">Kategórie:</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="cat in dbpediaData.categories"
                      :key="cat"
                      class="bg-zinc-custom text-gray-700 text-xs px-2 py-1 rounded-lg border border-zinc-custom"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="dbpediaData.dbpediaUrl" class="mt-4 pt-3 border-t border-stone-400 ">
                <a :href="dbpediaData.dbpediaUrl" target="_blank" class="text-blue-500 hover:underline text-xs">
                  Zobraziť na DBpedia →
                </a>
              </div>
            </div>

            <div v-else class="text-gray-400">Dáta nie sú dostupné</div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div v-else class="p-10 text-gray-400">
    Produkt sa nenašiel.
  </div>
</template>