import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
const savedStates = JSON.parse(localStorage.getItem('itemStates') || '{}')

export const useSneakersStore = defineStore('sneakers', () => {
  const items = ref([
    {
      id: 1,
      title: 'ADIDAS CAMPUS 00S',
      description: 'Adidas Campus 00s je ikonická obuv inšpirovaná basketbalovými teniskami z 80. rokov. Vyznačuje sa semišovým zvrškom, gumovou podrážkou a klasickými tromi prúžkami Adidas.',
      imageUrl: '/src/assets/sneakers/sneaker1.png',
      logoUrl: '/src/assets/icons/adidas.svg',
      price: 120,
      gender: 'dámske',
      brand: 'Adidas',
      dbpediaKey: 'Adidas',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 2,
      title: 'CONVERSE CHUCK 70',
      description: 'Converse Chuck 70 je prémiová verzia klasického Chuck Taylor All Star. Vyznačuje sa hrubšou podrážkou, lepším tlmením a kvalitnejšími materiálmi. Ideálna pre každodenné nosenie.',
      imageUrl: '/src/assets/sneakers/sneaker2.png',
      logoUrl: '/src/assets/icons/converse.svg',
      price: 100,
      gender: 'dámske',
      brand: 'Converse',
      dbpediaKey: 'Converse_(brand)',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 3,
      title: 'ASICS GEL-NYC',
      description: 'ASICS GEL-NYC je retro bežecká obuv inšpirovaná modelmi z 90. rokov. Obsahuje technológiu GEL pre tlmenie nárazov a kombináciu semišu a textilu.',
      imageUrl: '/src/assets/sneakers/sneaker3.png',
      logoUrl: '/src/assets/icons/asics.svg',
      price: 150,
      gender: 'dámske',
      brand: 'Asics',
      dbpediaKey: 'Asics',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 4,
      title: 'VANS KNU SKOOL',
      description: 'Vans Knu Skool je moderná verzia klasického modelu Old Skool s objemnejšou podrážkou. Ideálna pre skateboarding aj každodenné nosenie.',
      imageUrl: '/src/assets/sneakers/sneaker4.png',
      logoUrl: '/src/assets/icons/vans.png',
      price: 95,
      gender: 'pánske',
      brand: 'Vans',
      dbpediaKey: 'Vans',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 5,
      title: 'NIKE P-6000 SDE',
      description: 'Nike P-6000 SDE je retro bežecká obuv z konca 90. rokov. Kombinuje vintage estetiku s modernými materiálmi a technológiou tlmenia nárazov.',
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
      title: 'PUMA SUEDE CLASSIC',
      description: 'Puma Suede Classic je jedna z najpopulárnejších tenisiek značky Puma. Prvýkrát predstavená v roku 1968, stala sa ikonou streetwear kultúry vďaka svojmu semišovému zvršku.',
      imageUrl: '/src/assets/sneakers/sneaker6.png',
      logoUrl: '/src/assets/icons/puma.svg',
      price: 90,
      gender: 'pánske',
      brand: 'Puma',
      dbpediaKey: 'Puma_(brand)',
      isFavorite: false,
      isAdded: false,
    },
    {
      id: 7,
      title: 'NEW BALANCE 740 V2',
      description: 'New Balance 740 V2 je chunky retro tenisky inšpirované behom z prelomu tisícročí. Vyznačujú sa výrazným logom N a pohodlnou platformou.',
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
      title: 'REEBOK CLUB C 85',
      description: 'Reebok Club C 85 je klasická tenisková obuv z roku 1985. Čistý dizajn a koža robí z tejto tenisky nadčasový kúsok do každého šatníka.',
      imageUrl: '/src/assets/sneakers/sneaker8.png',
      logoUrl: '/src/assets/icons/reebok.svg',
      price: 80,
      gender: 'dámske',
      brand: 'Reebok',
      dbpediaKey: 'Reebok',
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