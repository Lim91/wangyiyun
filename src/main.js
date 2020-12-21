import Vue from 'vue'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import store from './store'

//导入rem适配文件
import 'lib-flexible/flexible'

//从vant框架导入Button组件
import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Cell,
  Uploader,
  Lazyload,
  IndexBar,
  IndexAnchor,
  Slider
} from 'vant'

//注册Button组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Icon)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(Uploader)
  .use(Lazyload, {
    lazyComponent: true,
  })
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Slider)



//配置请求基础路径
axios.defaults.baseURL = 'http://music.kele8.cn';

//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  //处理post请求参数, 进行参数序列化
  if (config.method == 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);

    // 

  }

  //必须返回config
  return config;
})

//定义全局过滤器，保留小数点后一位小数
Vue.filter('nodecimal', (v) => {
  return (v / 10000).toFixed(1);
})

Vue.filter('changSeconds', (v) => {
  var seconds = parseInt(v);
  var newTime = "00:00";
  if (seconds < 10) {
    newTime = `00:0${seconds}`
  } else if (seconds >= 10 && seconds <= 60) {
    newTime = `00:${seconds}`
  } else if (seconds > 60 && seconds < 600) {
    let newSeconds = "00";
    if ((seconds % 60) < 10) {
      newSeconds = `0${seconds % 60}`;
    } else {
      newSeconds = seconds % 60;
    }
    newTime = `0${Math.floor(seconds / 60)}:${newSeconds}`
  }
  return newTime;
})

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
