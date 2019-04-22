import Vue from 'vue'
import config from '@/config'

Vue.use({
  install: Vue => Vue.prototype.$config = config
})

Vue.filter('title', (value) => {
  return value
    .replace(/ - /g, '—')
    .replace(/,(?!\s)/g, ', ')
})

Vue.filter('pence', (value) => {
  return '£' + parseFloat(value / 100).toFixed(2)
})

Vue.filter('pounds', (value) => {
  return '£' + parseFloat(value).toFixed(2)
})

Vue.filter('point', (value) => {
  return parseFloat(value).toFixed(1)
})
