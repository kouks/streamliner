<template>
  <div>
    <header class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-6 is-offset-3">
            <div class="field has-addons">
              <div class="control is-expanded">
                <input type="text" class="input is-medium" :value="$route.query.keyword">
              </div>

              <div class="control">
                <button class="button is-success is-medium">Go</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-2">
            <h3 class="title is-4">Popular Keywords</h3>

            <button class="button is-text is-loading is-large" v-if="keywords === null"></button>

            <div class="notification" v-else-if="keywords.length === 0">
              <i class="fas fa-exclamation-triangle"></i>
              &nbsp;
              No other keywords found
            </div>

            <ul v-else>
              <li v-for="(keyword, key) in keywords" :key="key">
                <a @click="$router.push({ query: { keyword } })">{{ keyword }}</a>
              </li>
            </ul>
          </div>

          <div class="column is-6">
            <h3 class="title is-4">People Found</h3>

            <button class="button is-text is-loading is-large" v-if="products === null"></button>

            <div class="notification" v-else-if="products.length === 0">
              <i class="fas fa-exclamation-triangle"></i>
              &nbsp;
              No matching products found
            </div>

            <div class="columns is-multiline" v-else>
              <div class="column is-6" v-for="(product, key) in products" :key="key">
                <Product
                  :data="product"
                  @compare="toggleComparison(product)"
                  @discard="discardProduct(product)"
                ></Product>
              </div>
            </div>
          </div>

          <div class="column is-4">
            <h3 class="title is-4">I Care About</h3>

            <Criteria
              ref="criteria"
              @filter="onCriteriaFilter"
              @reset="onCriteriaReset"
            ></Criteria>
          </div>
        </div>
      </div>
    </main>

    <Comparison></Comparison>
  </div>
</template>

<script>
import Product from '@/components/Product'
import Criteria from '@/components/Criteria'
import Comparison from '@/components/Comparison'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { Comparison, Criteria, Product },

  computed: mapGetters(['keywords', 'products']),

  methods: {
    ...mapActions(['discardProduct', 'toggleComparison']),

    onCriteriaFilter (criteria) {
      const query = {
        keyword: this.$route.query.keyword
      }

      if (criteria.price.active) {
        query.priceRelevance = criteria.price.relevance
        query.priceValue = criteria.price.value
      }

      if (criteria.brand.active) {
        query.brandRelevance = criteria.brand.relevance
        query.brandValue = criteria.brand.value
      }

      if (criteria.features.active) {
        query.featuresRelevance = criteria.features.relevance
        query.featuresValue = criteria.features.value.join('|')
      }

      this.$router.push({ query })
    },

    onCriteriaReset () {
      this.$router.push({
        query: {
          keyword: this.$route.query.keyword
        }
      })
    }
  }
}
</script>
