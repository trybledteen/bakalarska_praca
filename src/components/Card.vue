<script setup>
    defineProps({
        id: Number,
        title: String,
        imageUrl: String,
        price: Number,
        gender: String,
        isFavorite: Boolean,
        onClickFavorite: Function
    })
</script>

<template>
    <RouterLink :to="`/product/${id}`" class="relative bg-gray-custom border border-gray-300 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl">
        <img @click.prevent="onClickFavorite" :src="!isFavorite ? '/src/assets/icons/heart.svg' : '/src/assets/icons/heart1.svg'" alt="Like 1" class=" w-8 absolute top-10 left-10"/>
        
        <img :src="imageUrl" alt="Sneaker"/>
        
        <p class="mt-2">{{ title }}</p>
        <span class="text-sm text-gray-500">{{ gender }}</span>

        <div class="flex justify-between mt-5">
          <div class="flex flex-col">
            <span class="text-gray-600">Cena:</span>
            <b>{{ price }} €</b>
          </div>
        </div>
      </RouterLink>  
</template>