<template>
  <div>
    <ul class="criteria">
      <li>
        <div class="criterion" :class="{ 'is-active': criteria.price.active }">
          <div class="criterion-title" @click="toggleCriterion('price')">
            <span class="has-text-weight-bold">Price</span>

            <div class="select" @click.stop>
              <select :value="criteria.price.relevance" @input="updateRelevance({ field: 'price', relevance: Number($event.target.value) })">
                <option value="3">A lot</option>
                <option value="2">Moderately</option>
                <option value="1">Tiny bit</option>
              </select>
            </div>
          </div>

          <div class="criterion-body">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Around</label>
              </div>

              <div class="field-body">
                <div class="field is-expaneded has-addons">
                  <p class="control">
                    <a class="button is-static">
                      &pound;
                    </a>
                  </p>

                  <p class="control is-expanded">
                    <input
                      class="input"
                      type="number"
                      :value="criteria.price.value"
                      @input="updateValue({ field: 'price', value: Number($event.target.value) })"
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>

      <li>
        <div class="criterion" :class="{ 'is-active': criteria.brand.active }">
          <div class="criterion-title" @click="toggleCriterion('brand')">
            <span class="has-text-weight-bold">Brand</span>

            <div class="select" @click.stop>
              <select :value="criteria.brand.relevance" @input="updateRelevance({ field: 'brand', relevance: Number($event.target.value) })">
                <option value="3">A lot</option>
                <option value="2">Moderately</option>
                <option value="1">Tiny bit</option>
              </select>
            </div>
          </div>

          <div class="criterion-body">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Specifically</label>
              </div>

              <div class="field-body">
                <div class="field">
                  <div class="select">
                    <select :value="criteria.brand.value" @input="updateValue({ field: 'brand', value: $event.target.value })">
                      <option v-for="(brand, key) in allBrands" :key="key" :value="brand">
                        {{ brand }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>

      <li>
        <div class="criterion" :class="{ 'is-active': criteria.features.active }">
          <div class="criterion-title" @click="toggleCriterion('features')">
            <span class="has-text-weight-bold">Features</span>

            <div class="select" @click.stop>
              <select :value="criteria.features.relevance" @input="updateRelevance({ field: 'features', relevance: Number($event.target.value) })">
                <option value="3">A lot</option>
                <option value="2">Moderately</option>
                <option value="1">Tiny bit</option>
              </select>
            </div>
          </div>

          <div class="criterion-body">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">I want</label>
              </div>

              <div class="field-body">
                <Autocomplete
                  :dictionary="allFeatures"
                  :value="criteria.features.value"
                  @input="updateValue({ field: 'features', value: $event })"
                ></Autocomplete>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <hr>

    <div class="buttons is-centered">
      <span class="button is-primary" @click="$emit('filter', criteria)">Apply</span>
      <span class="button is-danger" @click="$emit('reset')">Reset Filters</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Autocomplete from '@/components/Autocomplete'

export default {
  components: { Autocomplete },

  computed: mapGetters({
    allFeatures: 'allFeatures',
    allBrands: 'allBrands',
    criteria: 'criteria/all'
  }),

  methods: mapMutations({
    updateRelevance: 'criteria/updateRelevance',
    updateValue: 'criteria/updateValue',
    toggleCriterion: 'criteria/toggle'
  })
}
</script>
