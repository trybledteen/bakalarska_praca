import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSneakersStore = defineStore('sneakers', () => {
  const items = ref([
    {
      id: 1,
      title: 'ADIDAS CAMPUS 00S',
      imageUrl: '/src/assets/sneakers/sneaker1.png',
      price: 120,
      gender: 'dámske',
      brand: 'Adidas',
      dbpediaKey: 'Adidas_Campus',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 2,
      title: 'ADIDAS SUPERSTAR II',
      imageUrl: '/src/assets/sneakers/sneaker2.png',
      price: 104,
      gender: 'dámske',
      brand: 'Adidas',
      dbpediaKey: 'Adidas_Superstar',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 3,
      title: 'ASICS GEL-NYC',
      imageUrl: '/src/assets/sneakers/sneaker3.png',
      price: 150,
      gender: 'dámske',
      brand: 'Asics',
      dbpediaKey: 'ASICS',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 4,
      title: 'VANS KNU SKOOL',
      imageUrl: '/src/assets/sneakers/sneaker4.png',
      price: 95,
      gender: 'pánske',
      brand: 'Vans',
      dbpediaKey: 'Vans_(brand)',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 5,
      title: 'NIKE P-6000 SDE',
      imageUrl: '/src/assets/sneakers/sneaker5.png',
      price: 120,
      gender: 'pánske',
      brand: 'Nike',
      dbpediaKey: 'Nike,_Inc.',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 6,
      title: 'AIR JORDAN 1 LOW',
      imageUrl: '/src/assets/sneakers/sneaker6.png',
      price: 130,
      gender: 'pánske',
      brand: 'Nike',
      dbpediaKey: 'Air_Jordan',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 7,
      title: 'NEW BALANCE 740 V2',
      imageUrl: '/src/assets/sneakers/sneaker7.png',
      price: 120,
      gender: 'dámske',
      brand: 'New Balance',
      dbpediaKey: 'New_Balance',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 8,
      title: 'NIKE DUNK LOW RETRO',
      imageUrl: '/src/assets/sneakers/sneaker8.png',
      price: 120,
      gender: 'pánske',
      brand: 'Nike',
      dbpediaKey: 'Nike_Dunk',
      isFavorite: false,
      isAdded: false,
    },
  ])

  const cart = ref([])

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price, 0)
  )

  const cartCount = computed(() => cart.value.length)

  function toggleCart(item) {
    if (item.isAdded) {
      cart.value = cart.value.filter((i) => i.id !== item.id)
      item.isAdded = false
    } else {
      cart.value.push(item)
      item.isAdded = true
    }
  }

  function toggleFavorite(item) {
    item.isFavorite = !item.isFavorite
  }

  function removeFromCart(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.isAdded = false
    cart.value = cart.value.filter((i) => i.id !== id)
  }

  return {
    items,
    cart,
    totalPrice,
    cartCount,
    toggleCart,
    toggleFavorite,
    removeFromCart,
  }
})