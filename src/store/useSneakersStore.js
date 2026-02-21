import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
const savedStates = JSON.parse(localStorage.getItem('itemStates') || '{}')

export const useSneakersStore = defineStore('sneakers', () => {
  const items = ref([
    {
      id: 1,
      title: 'ADIDAS CAMPUS 00S',
      imageUrl: '/src/assets/sneakers/sneaker1.png',
      logoUrl: '/src/assets/icons/adidas.svg',
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
      logoUrl: '/src/assets/icons/adidas.svg',
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
      logoUrl: '/src/assets/icons/asics.svg',
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
      logoUrl: '/src/assets/icons/vans.png',
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
      logoUrl: '/src/assets/icons/nike.png',
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
      logoUrl: '/src/assets/icons/jordan.png',
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
      logoUrl: '/src/assets/icons/new_balance.png',
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
      logoUrl: '/src/assets/icons/nike.png',
      price: 120,
      gender: 'pánske',
      brand: 'Nike',
      dbpediaKey: 'Nike_Dunk',
      isFavorite: false,
      isAdded: false,
    },
  ].map(item => ({
    ...item,
    isFavorite: savedStates[item.id]?.isFavorite || false,
    isAdded: savedStates[item.id]?.isAdded || false,
  })))

  const cart = ref(savedCart)

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const cartCount = computed(() => cart.value.length)

  function toggleCart(item, size = null) {
    const existing = cart.value.find((i) => i.id === item.id && i.size === size)
  
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({ ...item, size, quantity: 1 })
      item.isAdded = true
    }
  }

  function updateQuantity(id, size, quantity) {
    const item = cart.value.find((i) => i.id === id && i.size === size)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(id, size)
      } else {
        item.quantity = quantity
      }
    }
  }

  function toggleFavorite(item) {
    item.isFavorite = !item.isFavorite
  }

  function removeFromCart(id, size = null) {
    cart.value = cart.value.filter((i) => !(i.id === id && i.size === size))
    const stillInCart = cart.value.some((i) => i.id === id)
    if (!stillInCart) {
      const item = items.value.find((i) => i.id === id)
      if (item) item.isAdded = false
    }
  }

  const searchQuery = ref('')
  const selectedGender = ref('')

  const filteredItems = computed(() => {
    return items.value.filter((item) => {
      const matchesGender = selectedGender.value ? item.gender === selectedGender.value : true
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesGender && matchesSearch
    })
  })

  const filteredFavorites = computed(() =>
    items.value.filter((item) => item.isFavorite)
  )

  watch(cart, (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  }, { deep: true })

  watch(items, (newItems) => {
    const states = {}
    newItems.forEach(item => {
      states[item.id] = {
        isFavorite: item.isFavorite,
        isAdded: item.isAdded,
      }
    })
    localStorage.setItem('itemStates', JSON.stringify(states))
  }, { deep: true })

  return {
    items,
    cart,
    totalPrice,
    cartCount,
    searchQuery,
    selectedGender,
    filteredItems,
    filteredFavorites,
    toggleCart,
    toggleFavorite,
    removeFromCart,
    updateQuantity,
  }
})