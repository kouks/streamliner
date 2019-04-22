
export default {
  namespaced: true,

  state: {
    price: { active: false, relevance: 2, value: 0 },
    brand: { active: false, relevance: 2, value: '' },
    features: { active: false, relevance: 2, value: [] }
  },

  getters: {
    all: state => ({
      price: state.price,
      brand: state.brand,
      features: state.features
    })
  },

  mutations: {
    update (state, { field, conditions }) {
      state[field] = { ...conditions }
    },

    updateRelevance (state, { field, relevance }) {
      state[field].relevance = relevance
    },

    updateValue (state, { field, value }) {
      state[field].value = value
    },

    toggle (state, field) {
      state[field].active = !state[field].active
    }
  },

  actions: {
    read ({ commit }, query) {
      if (query.priceRelevance) {
        commit('update', {
          field: 'price',
          conditions: { active: true, relevance: Number(query.priceRelevance), value: Number(query.priceValue) }
        })
      }

      if (query.brandRelevance) {
        commit('update', {
          field: 'brand',
          conditions: { active: true, relevance: Number(query.brandRelevance), value: query.brandValue }
        })
      }

      if (query.featuresRelevance) {
        commit('update', {
          field: 'features',
          conditions: { active: true, relevance: Number(query.featuresRelevance), value: query.featuresValue.split('|') }
        })
      }
    },

    clear ({ state }) {
      state.price = { active: false, relevance: 2, value: 0 }
      state.brand = { active: false, relevance: 2, value: '' }
      state.features = { active: false, relevance: 2, value: [] }
    }
  }
}
