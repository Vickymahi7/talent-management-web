<script lang="ts">
import { UserTypeId } from '@/utils/enums';
const SUPER_ADMIN_MENU = [
  {
    id: 1,
    name: "Manage",
    subMenu: [
      { id: 101, name: "User Management", routeName: "usermanagement" },
      { id: 102, name: "Manage HR Profile", routeName: "hrprofilemanagement" },
    ]
  },
  {
    id: 2,
    name: "User Activity",
    subMenu: [{ id: 201, name: "Talent Pool", routeName: "" },]
  },
];
const ADMIN_MENU = [
  {
    id: 1,
    name: "Manage",
    subMenu: [
      { id: 101, name: "Manage HR Profile", routeName: "hrprofilemanagement" },
      { id: 102, name: "User Management", routeName: "usermanagement" },
      { id: 103, name: "Manage HR Profile", routeName: "hrprofilemanagement" },
    ]
  },
  {
    id: 2,
    name: "User Activity",
    subMenu: [{ id: 201, name: "Talent Pool", routeName: "" },]
  },
  {
    id: 3,
    name: "Tenant",
    subMenu: [{ id: 301, name: "Tenant Management", routeName: "tenantmanagement" },]
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
      return this.userTypeId == UserTypeId.SAD ? ADMIN_MENU : SUPER_ADMIN_MENU;
    }
  }
}
</script>
<template>
  <div class="left-menu content-card">
    <ul>
      <li v-for="menu in getUserTypeMenu" :key="menu.id">
        <a href="#">{{ menu.name }}</a>
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