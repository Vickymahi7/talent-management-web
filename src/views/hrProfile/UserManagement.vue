<script>
import axios from '@/plugins/axios.js'
export default {
  data() {
    return {
      userList: [],
    }
  },
  mounted() {
    this.grtUserList();
  },
  methods: {
    grtUserList: function () {
      let data = {
        email_id: '',
        skills: '',
      }
      axios.get('/user/list', data)
        .then((response) => {
          let result = response.data;
          this.userList = result.userList;
        })
    },
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>Manage User</label>
  </div>
  <div class="content-card h-100">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn btn-dark mx-2" type="submit">
          <font-awesome-icon class="me-2" :icon="['fas', 'plus-circle']" />
          New User
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-dark">
          <tr>
            <th scope="col">
              <input class="form-check-input" type="checkbox">
            </th>
            <th scope="col">ID</th>
            <th scope="col">User Name</th>
            <th scope="col">Email ID</th>
            <th scope="col">User Type</th>
            <th scope="col">Tenant</th>
            <th scope="col">Status</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="user in userList" :key="user.id">
            <td>
              <input class="form-check-input" type="checkbox">
            </td>
            <td>{{ user.user_id }}</td>
            <td>{{ user.user_name }}</td>
            <td>{{ user.email_id }}</td>
            <td>{{ user.user_type }}</td>
            <td>{{ user.tenant }}</td>
            <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
            <td>{{ user.last_updated_dt }}</td>
            <td>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'paperclip']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'download']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>