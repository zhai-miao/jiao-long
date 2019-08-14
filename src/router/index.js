import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import userList from '@/view/user/userList'
import roleList from '@/view/role/roleList'
import menuList from '@/view/menu/menuList'

Vue.use(Router)


export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}}
          ]
        },
        {path:'/userList',component:userList,name:'userList'},
        {path:'/roleList',component:roleList,name:'roleList'},
        {path:'/menuList',component:menuList,name:'menuList'}
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }

  ]
})
