<script lang="ts" setup>
import TenantProfileModal from '@/components/modals/TenantProfileModal.vue';
import UserProfileModal from '@/components/modals/UserProfileModal.vue';
import { USER_TYPES } from '@/utils/constants';
import { UserTypeId } from '@/utils/enums';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
import { computed, ref } from 'vue';

const dark = useDark({
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light',
});
const toggleDark = () => useToggle(dark.value);
const tenantProfileModalRef = ref(null as InstanceType<typeof TenantProfileModal> | null);
const userProfileModalRef = ref(null as InstanceType<typeof UserProfileModal> | null);

const userName = computed(() => {
  return localStorage.getItem("userName") ?? '';
});

const tenantLogo = computed(() => {
  const _tenantLogo
    = localStorage.getItem("tenantLogo");
  return _tenantLogo ?? null;
});

const userTypeId = computed(() => {
  const _userTypeId
    = localStorage.getItem("userTypeId");
  return _userTypeId ? parseInt(_userTypeId) : null;
});

const userType = computed(() => {
  let result = '';
  if (userTypeId.value) {
    result = USER_TYPES.find(data => data.id === userTypeId.value)?.userType ?? '';
  }
  return result;
});

const showUserProfileModal = () => {
  userProfileModalRef.value?.showModal();
}

const showTenantProfileModal = () => {
  tenantProfileModalRef.value?.showModal();
}
</script>
<template>
  <nav class="navbar navbar-expand-md">
    <a class="navbar-brand app-logo" href="#">
      <img v-if="tenantLogo" :src="tenantLogo" class="d-inline-block align-middle" alt="">
      <img v-else src="@/assets/img/logo.png" class="d-inline-block align-middle" alt="">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
      <ul class="navbar-nav align-items-end">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <el-switch class="dark-mode-switch" v-model="dark" @change="toggleDark()" :active-action-icon="Moon"
              :inactive-action-icon="Sunny" />
          </a>
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link" href="#">
            <div class="icon-btn">
              <font-awesome-icon icon="fa-solid fa-cog" />
            </div>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            <div class="icon-btn">
              <font-awesome-icon icon="fa-solid fa-user" />
            </div>
          </a>
        </li> -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle  d-flex align-items-center" href="#" id="navbarDropdown" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="d-flex flex-column">
              <span class="fw-bold">{{ userName }}</span>
              <span class="small text-muted">{{ userType }}</span>
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li v-if="userTypeId == UserTypeId.ADM">
              <a class="dropdown-item" href="#" @click="showTenantProfileModal"><font-awesome-icon
                  icon="fa-solid fa-toolbox" class="me-2" />Tenant Profile</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="showUserProfileModal"><font-awesome-icon icon="fa-solid fa-user"
                  class="me-2" />My Account</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="$router.push({ name: 'home' })"><font-awesome-icon
                  icon="fa-solid fa-right-from-bracket" class="me-2" />Logout</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
  <TenantProfileModal ref="tenantProfileModalRef" />
  <UserProfileModal ref="userProfileModalRef" />
</template>