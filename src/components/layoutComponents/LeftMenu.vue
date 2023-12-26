<script lang="ts" setup>
import axios from '@/plugins/axios';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
const isLoading = ref(false);
const userMenuList = ref([] as any);

onMounted(() => {
  getUserMenuPrivilegeList();
})

const userId = computed(() => {
  const userId
    = localStorage.getItem("userId");
  return userId ? parseInt(userId) : null;
});

const mainMenuList = computed((): any => {
  let arr = [];
  if (activeUserMenuList.value.length > 0) {
    arr = activeUserMenuList.value.reduce((result, currentObject) => {
      var keyValue = currentObject['main_menu_id'];
      result[keyValue] = result[keyValue] || [];
      result[keyValue].push(currentObject);
      return result;
    }, {});
  }
  return arr;
});

const activeUserMenuList = computed(() => {
  return userMenuList.value.filter(data => data.active);
});

const filteredUserMenuList = (mainMenuId: number) => {
  return activeUserMenuList.value.filter(data => data.main_menu_id == mainMenuId);
}

const getUserMenuPrivilegeList = async () => {
  try {
    if (userId.value) {
      isLoading.value = true;
      const response: any = await axios.get('/usermenuprivilege/list/' + userId.value)
      userMenuList.value = response.userMenuPrivilegeList;
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="left-menu content-card">
    <ul>
      <li v-for="menu in mainMenuList" :key="menu" class="mb-2">
        <p class="main-menu">{{ menu[0].main_menu }}</p>
        <ul class="sub-menu">
          <li v-for="subMenu in filteredUserMenuList(menu[0].main_menu_id)" :key="subMenu.id">
            <router-link :to="{ name: subMenu.web_url }" :class="{ 'active': $route.name == subMenu.web_url }">-
              {{ subMenu.menu }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>