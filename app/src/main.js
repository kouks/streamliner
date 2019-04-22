import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'

import '@/bootstrap/registerServiceWorker'
import '@/bootstrap/registerGlobalPlugins'
import '@/bootstrap/registerControllerRouter'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
