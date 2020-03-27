import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { $axios } from "@/assets/js/config.js";
import { doI18n } from '@/views/LoongUI/frame/i18n/loongUI-i18n.js'
import VueWechatTitle from 'vue-wechat-title'
import Router from 'vue-router'
Vue.use(VueWechatTitle)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$axios = $axios;
Vue.prototype.doI18n = doI18n;