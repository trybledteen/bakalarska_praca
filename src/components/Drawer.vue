<script setup>
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSneakersStore } from '../store/useSneakersStore.js'
import { useAuthStore } from '../store/useAuthStore.js'

const store  = useSneakersStore()
const auth   = useAuthStore()
const router = useRouter()

const loading = ref(false)
const success = ref(false)
const error   = ref('')

const props = defineProps({ onClose: Function })

async function placeOrder() {
  if (!auth.isLoggedIn) {
    router.push('/profile')
    props.onClose()
    return
  }

  loading.value = true
  error.value   = ''

  try {
    await auth.placeOrder(store.cart, store.totalPrice)
    success.value = true
    store.cart.forEach(item => store.removeFromCart(item.id, item.size))
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function goToProfile() {
  router.push('/profile')
  props.onClose()
}
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-gray-200 w-96 h-full fixed right-0 top-0 z-20 p-8 flex flex-col">
    <DrawerHead :onClose="onClose" />

    <div v-if="success" class="flex flex-col items-center justify-center flex-1 gap-4 text-center">
      <img src="/src/assets/icons/order-success.svg" alt="success" class="w-20" />
      <h3 class="text-xl font-bold">Objednávka bola prijatá!</h3>
      <p class="text-gray-500 text-sm">Ďakujeme za nákup. Históriu objednávok nájdete v profile.</p>
    </div>

    <template v-else>
      <div class="overflow-y-auto flex-1 pb-4 px-2 custom-scroll">
        <CartItemList />
      </div>

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Celkom:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ store.totalPrice }} €</b>
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <p v-if="!auth.isLoggedIn" class="text-gray-500 text-sm text-center">
          Pre objednávku sa prosím
          <span @click="goToProfile" class="text-yellow-500 cursor-pointer hover:underline">prihláste</span>
        </p>

        <button
          @click="placeOrder"
          :disabled="store.cart.length === 0 || loading"
          class="mt-2 transition bg-lime-500 w-full rounded-xl py-2 text-white disabled:bg-gray-500 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          {{ loading ? 'Spracováva sa...' : auth.isLoggedIn ? 'Objednať' : 'Prihlásiť sa' }}
        </button>
      </div>
    </template>
  </div>
</template>