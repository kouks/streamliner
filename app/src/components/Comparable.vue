<template>
  <div class="comparable">
    <a
      class="comparable-title"
      :title="data.title"
      :href="data.url"
      target="_blank"
      ref="noopener"
    >
      {{ data.title | title }}
    </a>

    <div class="comparable-image">
      <figure class="image is-3by1">
        <img :src="data.image" :alt="data.title">
      </figure>
    </div>

    <div class="comparable-content">
      <div class="content">
        <p class="has-text">
          <em class="has-text-grey is-size-7">
            {{ data.category }}
            &nbsp;
            <i class="fas fa-angle-right"></i>
            &nbsp;
            {{ data.manufacturer }}
          </em>
        </p>
      </div>
    </div>

    <ul class="comparable-list">
      <li>
        <span
          :class="{
            'has-text-success': criteria.price.active && priceDifference < 0,
            'has-text-danger': criteria.price.active && priceDifference >= 0
          }"
        >{{ data.price | pence }}</span>
        &nbsp;
        <span v-if="criteria.price.active" class="is-size-7">({{ criteria.price.value | pounds }})</span>
        &nbsp;&nbsp;
        <span v-if="criteria.price.active && priceDifference < 0">
          <i class="fas fa-arrow-down is-size-7 has-text-success"></i>
          {{ Math.abs(priceDifference) | pence }}
        </span>
        <span v-if="criteria.price.active && priceDifference >= 0">
          <i class="fas fa-arrow-up is-size-7 has-text-danger"></i>
          {{ Math.abs(priceDifference) | pence }}
        </span>
      </li>

      <li></li>

      <li>
        <span v-if="criteria.brand.active">
          <span v-if="criteria.brand.value === data.manufacturer" class="has-text-success">
            {{ data.manufacturer }}
          </span>

          <span v-else>
            <span class="has-text-danger">{{ data.manufacturer }}</span>
            &nbsp;
            <s class="is-size-7">{{ criteria.brand.value }}</s>
          </span>
        </span>

        <span v-else>{{ data.manufacturer }}</span>
      </li>

      <li></li>
    </ul>

    <ul class="comparable-list" v-if="criteria.features.active">
      <li
        v-for="(feature, key) in criteria.features.value"
        :key="key"
      >
        <span v-if="data.features.values.includes(feature)" class="has-text-success">
          {{ feature }}
        </span>

        <span v-else>
          <s class="has-text-danger">{{ feature }}</s>
        </span>
      </li>

      <li></li>
    </ul>

    <div class="comparable-score" v-if="score">
      Scored
      <span class="has-text-weight-bold">
        <span v-if="score > 7" class="has-text-success">{{ score | point }}</span>
        <span v-else-if="score > 5" class="has-text-warning">{{ score | point }}</span>
        <span v-else-if="score > 3" class="has-text-danger">{{ score | point }}</span>
        <span v-else class="has-text-grey">{{ score | point }}</span>
      </span>
      <span class="is-size-7 has-text-grey">/10&mdash;Based on your criteria</span>
    </div>

    <div class="comparable-footer buttons">
      <a
        class="button is-primary is-outlined"
        target="_blank"
        :href="data.url"
      >Buy</a>

      <button @click="discardProduct(data)" class="button is-danger is-outlined">Discard</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    data: Object,
    criteria: Object
  },

  computed: {
    priceDifference () {
      return this.data.price - this.criteria.price.value * 100
    },

    priceScore () {
      const diff = (this.data.price / 100 - this.criteria.price.value) / this.criteria.price.value * 2
      const relu = Math.abs(diff < 0 ? diff / 1.3 : diff)

      return 20 - 20 / (1 + Math.exp(-relu))
    },

    brandScore () {
      return this.criteria.brand.value === this.data.manufacturer ? 10 : 0
    },

    featuresScore () {
      return this.criteria.features.value.filter(f => this.data.features.values.find(t => t === f) !== undefined).length /
        this.criteria.features.value.length * 10
    },

    scores () {
      return {
        price: this.priceScore,
        brand: this.brandScore,
        features: this.featuresScore
      }
    },

    score () {
      const keys = Object.keys(this.criteria)
        .filter(k => this.criteria[k].active)

      const sum = keys
        .reduce((c, i) => c + this.scores[i] * Math.pow(this.criteria[i].relevance, 1.3), 0)

      const weight = keys
        .reduce((c, i) => c + Math.pow(this.criteria[i].relevance, 1.3), 0)

      return sum / weight
    }
  },

  methods: mapActions(['discardProduct'])
}
</script>
