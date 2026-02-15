<script setup>
    defineProps({
        title: String,
        imageUrl: String,
        price: Number
    });
</script>

<template>
    <div class="relative bg-gray-custom border border-gray-300 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl">
        <img src="/src/assets/icons/heart.svg" alt="Like 1" class=" w-8 absolute top-8 left-8"/>
        <img :src="imageUrl" alt="Sneaker"/>
        
        <p class="mt-2">{{ title }}</p>

        <div class="flex justify-between mt-5">
          <div class="flex flex-col">
            <span class="text-gray-600">Cena:</span>
            <b>{{ price }} €</b>
          </div>

          <img src="/src/assets/icons/plus.svg" alt="Plus" class="w-7"/>
        </div>
      </div>  
</template>