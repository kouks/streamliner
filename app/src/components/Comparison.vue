<template>
  <div class="comparison">
    <button
      class="button is-primary"
      v-if="comparedProducts.length >= 2"
      @click="modalActive = true"
    >
      <span class="tag is-static">{{ comparedProducts.length }}/4</span>
      &nbsp;
      Compare Products
    </button>

    <div class="modal" :class="{ 'is-active': modalActive }">
      <div @click="modalActive = false" class="modal-background"></div>
      <div class="comparison-modal modal-content">
        <div class="columns is-gapless">
          <div
            class="column"
            :class="[`is-${12/comparedProducts.length}`]"
            v-for="(product, key) in comparedProducts"
            :key="key"
          >
            <Comparable :data="product" :criteria="criteria"></Comparable>
          </div>
        </div>
      </div>
      <a @click="modalActive = false" class="modal-close is-hidden-touch"></a>
      <a @click="modalActive = false" class="delete is-hidden-desktop"></a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Comparable from './Comparable'

export default {
  components: { Comparable },

  data () {
    return {
      modalActive: false
    }
  },

  computed: mapGetters({
    comparedProducts: 'comparedProducts',
    criteria: 'criteria/all'
  })
}
</script>
