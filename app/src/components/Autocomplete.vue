<template>
  <div class="autocomplete field is-expanded has-addons">
    <p class="control" v-for="(word, key) in value" :key="key">
      <a class="button is-static">
        <span class="is-size-7">{{ word }}</span>
      </a>
    </p>

    <div class="control is-expanded">
      <input
        ref="input"
        class="input"
        v-model="pattern"
        @keyup="handleKeyUp"
        @keydown.delete="handleDelete"
        @keydown.enter="handleEnter"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    dictionary: Array
  },

  data () {
    return {
      pattern: ''
    }
  },

  methods: {
    handleKeyUp (e) {
      if (this.pattern.trim() === '' || e.which < 32) {
        return
      }

      const suggestion = this.dictionary.find(w => new RegExp(`^${this.pattern}`, 'i').test(w))

      if (suggestion === undefined) {
        return
      }

      const selectionStart = this.pattern.length
      const selectionEnd = suggestion.length

      this.pattern = suggestion

      this.$nextTick(() => {
        this.$refs.input.setSelectionRange(selectionStart, selectionEnd, 'backward')
      })
    },

    handleDelete () {
      if (this.pattern !== '') {
        return
      }

      this.value.pop()
      this.$emit('input', this.value)
    },

    handleEnter () {
      if (this.pattern.trim() === '') {
        return
      }

      this.$emit('input', this.value.concat(this.pattern.split(/[^\w]/).filter(Boolean)))
      this.pattern = ''
    }
  }
}
</script>
