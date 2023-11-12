<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      tenant: {
        name: '',
        user_name: '',
        email_id: '',
        password: '',
        tenant_type_id: '',
        description: '',
        location: '',
      },

      tenantList: [],
    }
  },
  validations() {
    return {
      tenant: {
        name: { required },
        user_name: { required },
        email_id: { required, email },
        password: { required, minLength: minLength(6), },
      }
    }
  },
  mounted() {
    this.getTenantList();
  },
  methods: {
    async getTenantList() {
      try {
        const response: any = await axios.get('/tenant/list')
        this.tenantList = response.tenantList;
      } catch (error: any) {
        this.toast.error(error);
      }
    },
    async addTenant() {
      try {
        this.v$.tenant.$touch();
        if (!this.v$.tenant.$invalid) {
          const response: any = await axios.post('/tenant/add', this.tenant);
          if (response.status == 201) {
            this.toast.success(response.message);
            this.getTenantList();
          }
        }
      } catch (error: any) {
        this.toast.error(error);
      }
    },
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>Manage Tenant</label>
  </div>
  <div class="content-card h-100">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn primary-btn mx-2" type="button" data-bs-toggle="modal" data-bs-target="#tenantAddEditModal">
          <font-awesome-icon class="me-2" :icon="['fas', 'plus-circle']" />
          New Tenant
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
          <th scope="col">Tenant</th>
          <th scope="col">Email ID</th>
          <th scope="col">Tenant Type</th>
            <th scope="col">User</th>
            <th scope="col">Status</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="tenant in tenantList" :key="tenant.id">
            <td>
              <input class="form-check-input" type="checkbox">
            </td>
            <td>{{ tenant.tenant_id }}</td>
            <td>{{ tenant.name }}</td>
            <td>{{ tenant.email_id }}</td>
            <td>{{ tenant.tenant_type }}</td>
            <td>{{ tenant.user_name }}</td>
            <td>{{ tenant.active ? 'Active' : 'Inactive' }}</td>
            <td>{{ tenant.last_updated_dt }}</td>
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
  <div class="modal fade" id="tenantAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New Tenant</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="name" class="col-sm-4 col-form-label">Tenant Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="tenant.name" id="name"
                    :class="{ 'is-invalid': v$.tenant.name.$error }" placeholder="Enter Tenant Name">
                  <div class="invalid-feedback" v-for="error of v$.tenant.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="tenant_type_id" class="col-sm-4 col-form-label">Tenant Type</label>
                <div class="col-sm-8">
                  <select class="form-select" v-model="tenant.tenant_type_id" aria-label="Tenant Type">
                    <option value="">Select</option>
                    <!-- <option value="1">Super Admin</option>
                                      <option value="1">Admin</option>
                                      <option value="2">HR Tenant</option>
                                      <option value="3">Tenant</option> -->
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="location" class="col-sm-4 col-form-label">Location</label>
                <div class="col-sm-8">
                  <input type="text" v-model="tenant.location" class="form-control" id="location">
                </div>
              </div>
              <div class="row mb-3">
                <label for="description" class="col-sm-4 col-form-label">Description</label>
                <div class="col-sm-8">
                  <textarea v-model="tenant.description" name="description" class="form-control" id="description"
                    rows="5"></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <label for="user_name" class="col-sm-4 col-form-label">Admin User Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="tenant.user_name" id="user_name"
                    :class="{ 'is-invalid': v$.tenant.user_name.$error }" placeholder="Enter User Name">
                  <div class="invalid-feedback" v-for="error of v$.tenant.user_name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="email_id" class="col-sm-4 col-form-label">Email ID</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="tenant.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.tenant.email_id.$error }" placeholder="Enter Email ID">
                  <div class="invalid-feedback" v-for="error of v$.tenant.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="password" class="col-sm-4 col-form-label">Default Password</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="tenant.password" id="password"
                    :class="{ 'is-invalid': v$.tenant.password.$error }" placeholder="Enter Password">
                  <div class="invalid-feedback" v-for="error of v$.tenant.password.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="addTenant" class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>