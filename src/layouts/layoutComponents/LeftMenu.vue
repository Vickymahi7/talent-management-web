<script lang="ts" setup>
import { useUserMenuPrivilegeStore } from '@/stores/userMenuPrivilege';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
const userMenuPrivilege = useUserMenuPrivilegeStore();

const { userMenuList } = storeToRefs(userMenuPrivilege);

const isLoading = ref(false);
// const userMenuList = ref([] as any);

onMounted(() => {
  getUserMenuPrivilegeList();
})

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
  return userMenuList.value.filter(data => data.active == true);
});

const filteredUserMenuList = (mainMenuId: number) => {
  return activeUserMenuList.value.filter(data => data.main_menu_id == mainMenuId);
}

const getUserMenuPrivilegeList = async () => {
  try {
    isLoading.value = true;
    await userMenuPrivilege.getUserMenuPrivilegeList();
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
            <div class="d-flex justify-content-between px-2">
              <router-link :to="{ name: subMenu.web_url }" :class="{ 'active': $route.name == subMenu.web_url }">
                {{ subMenu.menu }}
              </router-link>
              <font-awesome-icon v-if="$route.name == subMenu.web_url" icon="fa-solid fa-caret-right"
                class="align-self-center" />
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>