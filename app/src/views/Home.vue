<template>
  <div>
    <header class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-6 is-offset-3">
            <form class="field has-addons" @submit.prevent="$router.push({ name: 'results', query: { keyword: pattern } })">
              <div class="control is-expanded">
                <input type="text" class="input is-medium" placeholder="headphones" v-model="pattern">
              </div>
              <div class="control">
                <button class="button is-success is-medium">Go</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>

    <main class="section">
      <div class="container has-text-centered">
        <h3 class="title is-4">You Searched For</h3>

        <button class="button is-text is-loading is-large" v-if="keywords === null"></button>

        <div class="notification" v-else-if="keywords.length === 0">
          <i class="fas fa-exclamation-triangle"></i>
          &nbsp;
          No matching products found
        </div>

        <ul v-else>
          <li v-for="(keyword, key) in keywords" :key="key" class="is-size-5">
            <router-link :to="{ name: 'results', query: { keyword }}">{{ keyword }}</router-link>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      pattern: ''
    }
  },

  computed: mapGetters({
    keywords: 'userKeywords'
  })

}
</script>
