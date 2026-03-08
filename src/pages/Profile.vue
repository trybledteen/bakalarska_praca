<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/useAuthStore.js'

const auth = useAuthStore()

const isLogin   = ref(true)
const name      = ref('')
const email     = ref('')
const password  = ref('')
const error     = ref('')
const orders    = ref([])
const loading   = ref(false)

async function submit() {
  error.value = ''
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(name.value, email.value, password.value)
    }
    await loadOrders()
  } catch (e) {
    error.value = e.message
  }
}

async function loadOrders() {
  loading.value = true
  try {
    orders.value = await auth.fetchOrders()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function logout() {
  auth.logout()
  orders.value = []
}

onMounted(() => {
  if (auth.isLoggedIn) loadOrders()
})
</script>

<template>
  <div class="p-10 px-25">

    <!-- Prihlásený -->
    <div v-if="auth.isLoggedIn">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold">{{ auth.user.name }}</h2>
          <p class="text-gray-500 mt-1">{{ auth.user.email }}</p>
        </div>
        <button
          @click="logout"
          class="bg-gray-custom px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
        >
          Odhlásiť sa
        </button>
      </div>

      <!-- História objednávok -->
      <h3 class="text-xl font-bold mb-4">História objednávok</h3>

      <div v-if="loading" class="text-gray-400">Načítava sa...</div>

      <div v-else-if="orders.length === 0" class="text-gray-400">
        Zatiaľ žiadne objednávky.
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-gray-custom rounded-2xl p-6"
        >
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-500">
              {{ new Date(order.created_at).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
            </span>
            <span class="font-bold">{{ order.total_price }} €</span>
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-700">{{ item.title }} <span class="text-gray-400">({{ item.size }})</span></span>
              <span class="text-gray-500">{{ item.quantity }}x {{ item.price }} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Neprihlásený -->
    <div v-else class="max-w-md mx-auto">
      <h2 class="text-3xl font-bold mb-8">
        {{ isLogin ? 'Prihlásenie' : 'Registrácia' }}
      </h2>

      <div class="flex flex-col gap-3">
        <input
          v-if="!isLogin"
          v-model="name"
          type="text"
          placeholder="Meno"
          class="w-full py-3 px-4 bg-gray-custom rounded-xl outline-none"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full py-3 px-4 bg-gray-custom rounded-xl outline-none"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Heslo"
          class="w-full py-3 px-4 bg-gray-custom rounded-xl outline-none"
        />

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          @click="submit"
          class="w-full py-3 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold text-white transition cursor-pointer"
        >
          {{ isLogin ? 'Prihlásiť sa' : 'Registrovať sa' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          {{ isLogin ? 'Nemáte účet?' : 'Už máte účet?' }}
          <span
            @click="isLogin = !isLogin; error = ''"
            class="text-yellow-500 cursor-pointer hover:underline"
          >
            {{ isLogin ? 'Registrovať sa' : 'Prihlásiť sa' }}
          </span>
        </p>
      </div>
    </div>

  </div>
</template>