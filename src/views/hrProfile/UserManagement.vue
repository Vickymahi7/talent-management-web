<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      user: {
        user_id: null,
        user_type_id: null,
        user_name: null,
        password: null,
        email_id: null,
        user_status_id: null,
        active: true,
      },

      userList: [],
    }
  },
  validations() {
    return {
      user: {
        user_name: { required },
        email_id: { required, email },
      }
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList: function () {
      axios.get('/user/list')
        .then((response) => {
          let result = response.data;
          this.userList = result.userList;
        })
    },
    async addUser() {
      try {
        this.v$.user.$touch();
        if (!this.v$.user.$invalid) {
          const response = await axios.post('/user/add', this.user);
          // let result = response.data;
          if (response.status == 201) {
            this.getUserList();
          }
        }
      } catch (error) {
        console.log(error)
      }
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
        <button class="btn primary-btn mx-2" type="button" data-bs-toggle="modal" data-bs-target="#userAddEditModal">
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
  <div class="modal fade" id="userAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="user_name" class="col-sm-4 col-form-label">Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="user.user_name" id="user_name"
                    :class="{ 'is-invalid': v$.user.user_name.$error }" placeholder="Enter Name">
                  <div class="invalid-feedback" v-for="error of v$.user.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="email_id" class="col-sm-4 col-form-label">Email ID</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="user.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.user.email_id.$error }" placeholder="Enter Email ID">
                  <div class="invalid-feedback" v-for="error of v$.user.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="user_type_id" class="col-sm-4 col-form-label">User Type</label>
                <div class="col-sm-8">
                  <select class="form-select" v-model="user.user_type_id" aria-label="User Type">
                    <option value="">Select</option>
                    <option value="1">Super Admin</option>
                    <option value="1">Admin</option>
                    <option value="2">HR User</option>
                    <option value="3">User</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="password" class="col-sm-4 col-form-label">Default Password</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="user.password" id="password"
                    placeholder="Enter Password">
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="addUser" class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>