<script setup>
  import Header from './components/Header.vue'
  import CardList from './components/CardList.vue'
  import Drawer from './components/Drawer.vue';
</script>

<template>
  <!--<Drawer /> -->
  <div class="bg-gray-200 w-4/5 m-auto rounded-3xl shadow-xl mt-14">
    <Header />

    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Všetky tenisky</h2>

        <div class="flex gap-4">
          <select class="py-2 px-3 border rounded-md outline-none focus: border-gray-300">
            <option>Dámske</option>
            <option>Pánske</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3 w-4" src="./assets/icons/search.svg">
            <input 
              class="border rounded-md py-2 pl-11 pr-4 outline-none focus: border-gray-300" 
              type="text" 
              placeholder="Hľadať..."
            />
          </div>
        </div>
      </div>

  
      <CardList />
    </div>
  </div>
</template>