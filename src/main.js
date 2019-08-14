// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

//引入定义的全局变量
import gloable from './store/gloable'
//存入全局备用
Vue.prototype.domain=gloable

//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//引入axios
import axios from 'axios'
Vue.prototype.$axios=axios
// 允许携带cookie
axios.defaults.withCredentials=true

//引入cookie插件
import Cookies from 'js-cookie'
Vue.prototype.Cookies=Cookies

//引入工具类
import utils from '@/js/utils.js'
Vue.prototype.toAes=utils

//引入VUEX
import store from './store/store'

//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'

//路由拦截
router.beforeEach((to, from, next)=>{

  next()

})

//请求拦截器
axios.interceptors.request.use((config)=>{

  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有Cookie的话添加Cookie
    let aucokie=Cookies.get("authcode")
    if(aucokie==null){
       Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }
  let token=window.localStorage.getItem("token"); //为所有的请求带上token
  config.headers['token']=token

  return config;
})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

//音频文件的使用
import yinpin from './../static/tishi/tishiyin.mp3'
import aiya from '../static/tishi/aiya.mp3'
import en from '../static/tishi/en.mp3'
import qingsong from '../static/tishi/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id,yinyue) => {
  let buttonAudio = document.getElementById(id);
  if(yinyue=="yinpin"){
    buttonAudio.setAttribute('src',yinpin)
  }
  if(yinyue=="en"){
    buttonAudio.setAttribute('src',en)
  }
  if(yinyue=="aiya"){
    buttonAudio.setAttribute('src',aiya)
  }
  if(yinyue=="qingsong"){
    buttonAudio.setAttribute('src',qingsong)
  }
  buttonAudio.play()
}
