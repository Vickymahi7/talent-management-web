<script setup lang="ts">
import NavBar from './layoutComponents/NavBar.vue';
</script>

<template>
  <nav-bar />
  <main class="main-section">
    <div class="content-section h-100">
      <slot></slot>
    </div>
  </main>
</template>