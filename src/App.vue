<script setup>
import { RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <component :is="$route.meta.layout || DefaultLayout">
    <RouterView></RouterView>
  </component>
</template>