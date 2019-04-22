<template>
  <section class="hero is-fullheight is-primary">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <div class="box">
              <h1 class="title is-3 has-text-dark">Login to Streamliner</h1>
              <p class="subtitle is-5 has-text-grey">To link your data from the extension</p>

              <GoogleLogin
                :params="params"
                :onSuccess="success"
                :onFailure="failure"
                class="button is-large is-success"
              >Login with Google</GoogleLogin>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Auth from '@/core/Auth'
import GoogleLogin from 'vue-google-login'

export default {
  components: { GoogleLogin },

  data () {
    return {
      params: {
        client_id: this.$config.auth.googleClientId
      }
    }
  },

  methods: {
    success (response) {
      new Auth().login(response.Zi.id_token, response.w3)
        .then(() => this.$router.push({ name: this.$route.query.redirect || 'home' }))
        .catch(this.failure.bind(this))
    },

    failure () {
      alert('Login failed.')
    }
  }
}
</script>
