import Vue from 'vue'
import Cookies from 'js-cookie'
import '@/styles/index.scss' // global css
import ElementUI from 'element-ui'
import Fit2CloudUI from 'fit2cloud-ui'

import i18n from './lang' // internationalization
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import api from '@/api/index.js'
import filter from '@/filter/filter'
import directives from './directive'

import './styles/vdrr/common-temp.scss'

import vdrr from './components/vue-drag-resize-rotate'
Vue.component('vdrr', vdrr)

Vue.prototype.$api = api

import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts

import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css'// 引入样式
Vue.use(UmyUi)

// 引入vue-UUID组件
import UUID from 'vue-uuid'
Vue.use(UUID)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Fit2CloudUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(filter)
Vue.use(directives)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
