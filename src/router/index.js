import Vue from 'vue'
import VueRouter from 'vue-router'

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
        component: () => import('../views/Home.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'songlistpage:id',
        name: 'SongListPage',
        component: () => import("../views/SongListPage"),
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'userpage',
        name: 'UserPage',
        component: () => import("../views/UserPage"),
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import("../views/Search"),
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'artistpage:id',
        name: 'ArtistPage',
        component: () => import("../views/ArtistPage"),
        meta: {
          keepAlive: false
        }
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
