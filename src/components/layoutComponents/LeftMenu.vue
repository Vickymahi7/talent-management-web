<script lang="ts">
import { UserTypeId } from '@/utils/enums';
const SUPER_ADMIN_MENU = [
  {
    id: 1,
    name: "Manage",
    subMenu: [
      { id: 101, name: "Tenant Management", routeName: "tenantmanagement" },
      { id: 102, name: "User Management", routeName: "usermanagement" },
    ]
  },
];
const ADMIN_MENU = [
  {
    id: 1,
    name: "Manage",
    subMenu: [
      { id: 101, name: "User Management", routeName: "usermanagement" },
      { id: 102, name: "Manage Profile", routeName: "hrprofilemanagement" },
    ]
  },
  {
    id: 2,
    name: "User Activity",
    subMenu: [{ id: 201, name: "Talent Pool", routeName: "talentpool" },]
  },
];
const USER_MENU = [
  {
    id: 1,
    name: "Manage",
    subMenu: [{ id: 101, name: "Manage Profile", routeName: "userhrprofile" },]
  },
];
export default {
  data() {
    return {
      UserTypeId,
    }
  },
  computed: {
    userTypeId() {
      const userTypeId
        = localStorage.getItem("userTypeId");
      return userTypeId ? parseInt(userTypeId) : null;
    },
    getUserTypeMenu() {
      if (this.userTypeId == UserTypeId.SAD) {
        return SUPER_ADMIN_MENU;
      }
      else if (this.userTypeId == UserTypeId.ADM) {
        return ADMIN_MENU;
      }
      else {
        return USER_MENU;
      }
    }
  }
}
</script>
<template>
  <div class="left-menu content-card">
    <ul>
      <li v-for="menu in getUserTypeMenu" :key="menu.id" class="mb-2">
        <p class="main-menu">{{ menu.name }}</p>
        <ul class="sub-menu">
          <li v-for="subMenu in menu.subMenu" :key="subMenu.id">
            <router-link :to="{ name: subMenu.routeName }" :class="{ 'active': $route.name == subMenu.routeName }">-
              {{ subMenu.name }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>