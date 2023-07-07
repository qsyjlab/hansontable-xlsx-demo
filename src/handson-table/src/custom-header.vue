<template>
  <div @click="$emit('click', $props)">{{ column.title }}</div>
</template>
<script>
export default {
  props: {
    colIndex: {
      type: Number,
      default: 0,
    },
    column: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
