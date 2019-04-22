import Vue from 'vue'
import Vuex from 'vuex'

import { api, authed } from '@/awis'

import criteria from './criteria'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { criteria },

  state: {
    products: null,
    keywords: null,
    discardedProducts: [],
    comparedProducts: [],
    userKeywords: null
  },

  getters: {
    products: (state) => {
      return state.products === null
        ? null
        : state.products.filter(p => state.discardedProducts.find(a => p.asin === a) === undefined)
    },
    keywords: state => state.keywords,
    userKeywords: state => state.userKeywords,
    allFeatures: (state) => {
      return state.products === null
        ? []
        : [...new Set(state.products.reduce((c, i) => c.concat(i.features.values), []))]
    },
    allBrands: (state) => {
      return state.products === null
        ? []
        : [...new Set(state.products.reduce((c, i) => c.concat(i.manufacturer), []))]
    },
    comparedProducts: state => state.comparedProducts.filter(p => state.discardedProducts.find(a => p.asin === a) === undefined),
    isBeingCompared: state => product => state.comparedProducts.find(p => p.asin === product.asin) !== undefined
  },

  mutations: {
    clearState (state) {
      state.products = null
      state.keywords = null
    }
  },

  actions: {
    async searchProducts ({ state }, criteria) {
      return api()
        .use(async req => req.query = criteria)
        .body('products')
        .then(products => state.products = products)
        .catch(console.error)
    },

    async searchKeywords ({ state }, pattern) {
      return api()
        .use(async req => req.query.pattern = pattern)
        .body('keywords')
        .then(keywords => state.keywords = keywords)
        .catch(console.error)
    },

    async loadUserKeywords ({ state }) {
      return authed()
        .body('me/keywords')
        .then(keywords => state.userKeywords = keywords)
        .catch(console.error)
    },

    discardProduct ({ state }, product) {
      state.discardedProducts.push(product.asin)
    },

    toggleComparison ({ state }, product) {
      state.comparedProducts.find(p => p.asin === product.asin) === undefined
        ? state.comparedProducts.push(product)
        : state.comparedProducts = state.comparedProducts.filter(p => p.asin !== product.asin)
    }
  }
})
