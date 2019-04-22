import Vue from 'vue'
import Auth from '@/core/Auth'

export default async ({ to, from }) => {
  return new Auth().check()
    .then(() => {
      Vue.prototype.$user = new Auth().profile()
    })
    .catch(() => {
      return Promise.reject({
        path: '/login',
        query: {
          redirect: to.name
        }
      })
    })
}
