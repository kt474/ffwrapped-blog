<script>
export default {
  data: () => ({
    mounted: false,
  }),
  mounted() {
    this.mounted = true;
  },
};
</script>

<template>
  <slot v-if="mounted" />
</template>
