import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function register(name, email, password) {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setAuth(data.token, data.user)
  }

  async function login(email, password) {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setAuth(data.token, data.user)
  }

  async function placeOrder(items, totalPrice) {
    const res = await fetch('http://localhost:3001/api/orders', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify({ items, totalPrice }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  async function fetchOrders() {
    const res = await fetch('http://localhost:3001/api/orders', {
      headers: { 'Authorization': `Bearer ${token.value}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  return { user, isLoggedIn, register, login, logout, placeOrder, fetchOrders }
})