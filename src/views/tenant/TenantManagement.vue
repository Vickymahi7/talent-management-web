<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { ACCOUNT_STATUS } from '@/utils/constants'
import { formatDate } from '@/utils/dateFormats'
import { getTenantStatusById, bsModalHide, bsModalShow } from '@/utils/commonFunctions'
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),
      formatDate: formatDate,
      getTenantStatusById: getTenantStatusById,
      bsModalHide: bsModalHide,
      bsModalShow: bsModalShow,

      isLoading: false,
      isModalLoading: false,

      tenantEdit: false,
      editRowId: 0,

      modalId: '',
      tenant: {
        name: '',
        user_id: '',
        user_name: '',
        email_id: '',
        phone: '',
        tenant_type_id: '',
        tenant_status_id: '',
        description: '',
        location: '',
      },

      tenantList: [],
      accountStatus: ACCOUNT_STATUS,

      dialogParam: {
        id: 0,
      },

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    filteredTenantList() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.tenantList.slice(startIndex, endIndex);
    },
  },
  validations() {
    return {
      tenant: {
        name: { required },
        user_name: { required },
        email_id: { required, email },
      }
    }
  },
  mounted() {
    this.getTenantList();
  },
  methods: {
    async getTenantList() {
      try {
        this.isLoading = true;
        const response: any = await axios.get('/tenant/list')
        this.tenantList = response.tenantList;
        this.totalRows = this.tenantList.length;
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    async addTenant() {
      try {
        this.v$.tenant.$touch();
        if (!this.v$.tenant.$invalid) {
          this.isModalLoading = true;
          const response: any = await axios.post('/tenant/add', this.tenant);
          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            this.getTenantList();
            this.bsModalHide(this.modalId);
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isModalLoading = false;
      }
    },
    async updateTenant(tenantData: any, updateKey: string, updateVal: string) {
      try {
        // this.v$.tenant.$touch();
        // if (!this.v$.tenant.$invalid) {
        const data: any = {}
        data.tenant_id = tenantData.tenant_id;
        data.name = tenantData.name;
        data.user_id = tenantData.user_id.toString();
        data[updateKey] = updateVal;
        this.isLoading = true;
        const response: any = await axios.patch('/tenant/update', data);
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getTenantList();
          this.cancelEdit();
        }
        // }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false
      }
    },
    cancelEdit() {
      this.tenantEdit = false;
      this.editRowId = 0;
    },
    deleteTenant: function (id: number) {
      this.dialogParam.id = id;
    },
    async onYesTenant() {
      try {
        this.isLoading = true;
        const response: any = await axios.delete('/tenant/delete/' + this.dialogParam.id)
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getTenantList();
        }

      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    // resendActivationMail: function (id: number) {
    //   this.dialogParam.id = id;
    // },
    // async onYesConfirmation() {
    //   try {
    //     const response: any = await axios.post('/user/resendactivation/' + this.dialogParam.id)
    //     if (response.status == HttpStatusCode.Ok) {
    //       this.toast.success(response.message);
    //       this.getTenantList();
    //     }

    //   } catch (error: any) {
    //     this.toast.error(error.message);
    //   }
    // },
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>Manage Tenant</label>
  </div>
  <div class="content-card h-100">
    <loading-overlay :showOverlay="isLoading">
      <div class="row py-2">
        <div class="col text-end">
          <button class="btn primary-btn mx-2" type="button"
            @click="bsModalShow('tenantAddEditModal'); modalId = 'tenantAddEditModal'">
            <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
            New Tenant
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-borderless custom-table-style">
          <thead class="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Tenant</th>
              <th scope="col">Primary User Name</th>
              <th scope="col">Primary User Email</th>
              <th scope="col">Active</th>
              <th scope="col">Status</th>
              <th scope="col">Last Updated</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody class="custom-tbody-style">
            <tr v-for="tenant in filteredTenantList" :key="tenant.id">
              <td>{{ tenant.tenant_id }}</td>
              <td>{{ tenant.name }}</td>

              <td>{{ tenant.user.user_name }}</td>
              <td>{{ tenant.user.email_id }}</td>
              <td>
                <div v-if="tenant.user.active" class="text-success">
                  <font-awesome-icon icon="fa-solid fa-user-check" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="fa-solid fa-user-xmark" />
                </div>
              </td>
              <!-- <td @click="tenantEdit=true">{{ tenant.tenant_status_id }}</td> -->
              <td @click="tenantEdit = true; editRowId = tenant.tenant_id">
                <select v-if="tenantEdit && editRowId == tenant.tenant_id" class="form-select form-control-sm"
                  v-model="tenant.tenant_status_id"
                  @change="updateTenant(tenant, 'tenant_status_id', tenant.tenant_status_id)" aria-label="Tenant Status">
                  <option :value="null">Select</option>
                  <option v-for="item in accountStatus" :key="item.id" :value="item.id">{{ item.status }}</option>
                </select>
                <span v-else>{{ getTenantStatusById(tenant.tenant_status_id) }}</span>
              </td>
              <td>{{ formatDate(tenant.last_updated_dt) }}</td>
              <td>
                <!-- <div v-if="!tenant.user.active" class="icon-btn me-3" @click="resendActivationMail(tenant.user_id)"
                                                                              title="Resend Activation Mail" data-bs-toggle="modal" data-bs-target="#resendConfirmation">
                                                                              <font-awesome-icon icon="fa-solid fa-share-from-square" />
                                                                            </div> -->
                <div class="icon-btn me-3" @click="deleteTenant(tenant.tenant_id)" title="Delete Tenant"
                  data-bs-toggle="modal" data-bs-target="#deleteTenant">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BPagination v-if="tenantList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
        size="sm" />
    </loading-overlay>
  </div>
  <div class="modal fade" id="tenantAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <loading-overlay :showOverlay="isModalLoading">
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
                  <label for="user_name" class="col-sm-4 col-form-label">Primary User Name</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" v-model="tenant.user_name" id="user_name"
                      :class="{ 'is-invalid': v$.tenant.user_name.$error }" placeholder="Enter User Name">
                    <div class="invalid-feedback" v-for="error of v$.tenant.user_name.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="email_id" class="col-sm-4 col-form-label">Primary User Email</label>
                  <div class="col-sm-8">
                    <input type="email" class="form-control" v-model="tenant.email_id" id="email_id"
                      :class="{ 'is-invalid': v$.tenant.email_id.$error }" placeholder="Enter Email ID">
                    <div class="invalid-feedback" v-for="error of v$.tenant.email_id.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="phone" class="col-sm-4 col-form-label">Phone</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" v-model="tenant.phone" id="phone"
                      placeholder="Enter Phone Number">
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="location" class="col-sm-4 col-form-label">Location</label>
                  <div class="col-sm-8">
                    <input type="text" v-model="tenant.location" class="form-control" id="location"
                      placeholder="Enter Location">
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
      </loading-overlay>
    </div>
  </div>
  <dialog-component id="deleteTenant" :onYes="onYesTenant" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete tenant?" />
  <!-- <dialog-component id="resendConfirmation" :onYes="onYesConfirmation" :returnParams="dialogParam"
                                                                                                      title="Mail Resend Confirmation" message="Are you sure to resend activation mail?" /> -->
</template>