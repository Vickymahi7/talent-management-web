<script lang="ts">
export default {
  props: {
    showOverlay: Boolean,
  },
}
</script>
<template>
  <div class="spinner-wrapper">
    <div v-if="showOverlay" class="spinner-container">
      <div class="spinner"></div>
      <!-- <template v-if="!showOverlay"> -->
      <!-- </template> -->
    </div>
    <slot></slot>
  </div>
</template>
