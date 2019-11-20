import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'

Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [
    { path: '*', component: Home },
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[

        {
          path: '/type/rapid',
          name: 'rapid',
          component: () => import('@/components/printType/Rapid.vue')
        },{
          path: '/type/primary',
          name: 'rapid',
          component: () => import('@/components/printType/Primary.vue')
        },{
          path: '/type/photo',
          name: 'rapid',
          component: () => import('@/components/printType/Photo.vue')
        }

      ],
      // scrollBehavior (to, from, savedPosition) {
      //   // return 期望滚动到哪个的位置
      //   return { x: 100, y: 0 }
      // }

    },


    {
      path:'/userInfo',
      name:'userInfo',
      component:() => import('@/components/UserInfo.vue'),
      meta: {
        requireAuth: true
      },
      // beforeEnter: (to,from,next)=>{
      //   const ticket=localStorage.getItem("ticket");
      //   // if(to.matched.some(route=>route.meta.requireAuth)){
      //     if(ticket){
      //       next()
      //     }else{
      //     // mapMutations(['changeLogDrawerState']);
      //     this.$store.commit('changeLogDrawerState');
      //       // next('/sail')
      //     }
      // }
    },
    // {
    //   path:'/campus',
    //   name:'campus',
    //   component: () => import('@/components/Campus'),
    //
    //
    // },{
    //   path:'/fileStore',
    //   name:'fileStore',
    //   component: () => import('@/components/FileStore')
    // },




  ]
})



