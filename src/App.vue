<script setup>
  import Header from './components/Header.vue'
  import CardList from './components/CardList.vue';
</script>

<template>
  <div class="bg-gray-200 w-4/5 m-auto rounded-3xl shadow-xl mt-14">
    <Header />

    <div class="p-10">
      <h2 class="text-3xl font-bold mb-8">Všetky tenisky</h2>

  
      <CardList />
    </div>
  </div>
</template>