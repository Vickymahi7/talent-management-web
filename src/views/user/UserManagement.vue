<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      user: {
        user_id: null,
        user_type_id: null,
        user_name: null,
        email_id: null,
        phone: null,
        user_status_id: null,
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
    async getUserList() {
      try {
        const response: any = await axios.get('/user/list')
        this.userList = response.userList;
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
    async addUser() {
      try {
        this.v$.user.$touch();
        if (!this.v$.user.$invalid) {
          const response: any = await axios.post('/user/add', this.user);
          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            this.getUserList();
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
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
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
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
                <font-awesome-icon icon="fa-solid fa-paperclip" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon icon="fa-solid fa-download" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon icon="fa-solid fa-trash" />
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
                  <div class="invalid-feedback" v-for="error of v$.user.user_name.$errors" :key="error.$uid">
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
                <label for="phone" class="col-sm-4 col-form-label">Phone</label>
                <div class="col-sm-8">
                  <input type="tet" class="form-control" v-model="user.phone" id="phone" placeholder="Enter Phone Number">
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