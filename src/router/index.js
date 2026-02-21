import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Favorites from '../pages/Favorites.vue'
import ProductDetail from '../pages/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/favorites', component: Favorites },
    { path: '/product/:id', component: ProductDetail }
  ],
})

export default router