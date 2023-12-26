<script setup lang="ts">
import { RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted } from 'vue';

onMounted(() => {
  document.body.classList.add('default-theme');
})
</script>

<template>
  <div bs-theme="dark">
    <component :is="$route.meta.layout || DefaultLayout">
      <RouterView></RouterView>
    </component>
  </div>
</template>