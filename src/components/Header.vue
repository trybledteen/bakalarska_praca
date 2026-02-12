<template>
    <header class="flex justify-between border-b border-gray-300 px-10 py-5">

      <div class="flex items-center gap-4">
        <img src="/src/assets/logo.png" alt="logo" class="w-11"/>
        <div>
          <h2 class="uppercase text-xl font-bold">Stepway</h2>
        </div>
      </div>

      <ul class="flex items-center gap-7">
        <li class="flex items-center cursor-pointer gap-3 text-gray-600 hover:text-black">
          <img src="/src/assets/icons/search.svg" alt="cart" class="w-6"/>
          <span class="uppercase">Hľadať</span>
        </li>

        <li class="flex items-center cursor-pointer gap-3 text-gray-600 hover:text-black">
          <img src="/src/assets/icons/shopping-cart.svg" alt="cart" class="w-6"/>
          <b class="uppercase">120 €</b>
        </li>

        <li class="flex items-center cursor-pointer gap-3 text-gray-600 hover:text-black">
          <img src="/src/assets/icons/heart.svg" alt="cart" class="w-6"/>
          <span class="uppercase">Schránka</span>
        </li>

        <li class="flex items-center cursor-pointer gap-3 text-gray-600 hover:text-black">
          <img src="/src/assets/icons/user.svg" alt="cart" class="w-6"/>
          <span class="uppercase">Profil</span>
        </li>
      </ul>

    </header>
</template>