<script setup lang="ts">
import LeftMenu from './layoutComponents/LeftMenu.vue';
import NavBar from './layoutComponents/NavBar.vue';
</script>

<template>
  <nav-bar />
  <main class="main-section">
    <left-menu />
    <div class="content-section h-100">
      <slot></slot>
    </div>
  </main>
</template>