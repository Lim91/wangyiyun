import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'songlistpage:id',
        name: 'SongListPage',
        component: () => import("../views/SongListPage")
      },
      {
        path: 'userpage',
        name: 'UserPage',
        component: () => import("../views/UserPage")
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import("../views/Search")
      },
      {
        path: 'artistpage:id',
        name: 'ArtistPage',
        component: () => import("../views/ArtistPage")
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import("../views/Test")
      }
    ]
  },
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
