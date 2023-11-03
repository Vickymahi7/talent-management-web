<template>
  <div class="left-menu content-card">
    <ul>
      <li>
        <a href="#">Manage</a>
        <ul class="sub-menu">
          <li>
            <a href="#" @click="$router.push('/hrprofilemanagement')" class="active">- Manage HR Profile</a>
          </li>
        </ul>
      </li>
      <li>
        <a href="#">User</a>
        <ul class="sub-menu">
          <li>
            <a href="#" @click="$router.push('/usermanagement')">- User Management</a>
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
    </ul>
  </div>
</template>