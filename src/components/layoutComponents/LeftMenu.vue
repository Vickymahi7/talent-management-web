<script lang="ts">
import { UserTypeId } from '@/utils/enums';

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
  }
}
</script>
<template>
  <div class="left-menu content-card">
    <ul>
      <li>
        <a href="#">Manage</a>
        <ul class="sub-menu">
          <li v-if="userTypeId != UserTypeId.SAD">
            <router-link :to="{ name: 'hrprofilemanagement' }" class="active">- Manage HR Profile</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'usermanagement' }">- User Management</router-link>
          </li>
        </ul>
      </li>
      <li>
        <a href="#">User Activity</a>
        <ul class="sub-menu">
          <li>
            <a href="#" @click.prevent="">- Talent Pool</a>
          </li>
        </ul>
      </li>
      <li v-if="userTypeId == UserTypeId.SAD">
        <a href="#">Tenant</a>
        <ul class="sub-menu">
          <li>
            <router-link :to="{ name: 'tenantmanagement' }">- Tenant Management</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>