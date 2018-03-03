// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/styles/common.css'
Vue.use(Mint)
Vue.use(vueResource)
import { Loadmore } from 'mint-ui'
import { Popup } from 'mint-ui';

Vue.component(Popup.name, Popup);
require('viewport-units-buggyfill').init()

Vue.component(Loadmore.name, Loadmore)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
