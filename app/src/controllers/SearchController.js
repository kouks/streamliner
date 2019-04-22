import Controller from './Controller'

export default class SearchController extends Controller {
  /**
   * Load user keywords.
   *
   * @param {Route} request.to The vue route instance
   */
  async home ({ to }) {
    this.$store.dispatch('loadUserKeywords')
  }

  /**
   * Load products and keywords based on query.
   *
   * @param {Route} request.to The vue route instance
   */
  async results ({ to }) {
    this.$store.commit('clearState')
    this.$store.dispatch('criteria/clear')
    this.$store.dispatch('criteria/read', to.query)
    this.$store.dispatch('searchProducts', to.query)
    this.$store.dispatch('searchKeywords', to.query.keyword)
  }
}
