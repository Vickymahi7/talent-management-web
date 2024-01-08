<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { RouterView } from 'vue-router';
</script>
<template>
  <div>
    <component :is="$route.meta.layout || DefaultLayout">
      <RouterView></RouterView>
    </component>
  </div>
</template>