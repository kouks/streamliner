<template>
  <div class="product card">
    <div class="card-image">
      <figure class="product-image image is-2by1">
        <img :src="data.image" :alt="data.title">
      </figure>
    </div>

    <div class="card-content">
      <div class="content">
        <em class="has-text-grey is-size-7">
          {{ data.category }}
          &nbsp;
          <i class="fas fa-angle-right"></i>
          &nbsp;
          {{ data.manufacturer }}
        </em>
        <p>
          <a
            class="product-title"
            :title="data.title"
            :href="data.url"
            target="_blank"
            ref="noopener"
          >
            <b>{{ data.title | title }}</b>
          </a>
          <br>
          <small class="has-text-success">{{ data.price | pence }}</small>
        </p>
      </div>
    </div>

    <footer class="card-footer">
      <a
        v-if="isBeingCompared(data) || comparedProducts.length < 4"
        class="card-footer-item"
        :class="{ 'has-background-primary': isBeingCompared(data), 'has-text-white': isBeingCompared(data) }"
        @click="$emit('compare')"
      >
        Compare
      </a>

      <a
        v-else
        class="card-footer-item has-text-grey has-cursor-disabled"
      >
        Compare
      </a>

      <a
        class="card-footer-item has-text-danger"
        @click="$emit('discard')"
      >Discard</a>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    data: Object
  },

  computed: mapGetters(['isBeingCompared', 'comparedProducts'])
}
</script>
