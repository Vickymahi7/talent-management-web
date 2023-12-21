<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
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

      editId: null as number | null,
      editKey: null as string | null,
      editValue: null as string | null,

      modalId: '',
      tenant: {
        tenant_id: '',
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

      accountStatus: ACCOUNT_STATUS,
      tenantList: [],
      tenantFields: [
        { key: 'tenant_id', label: 'ID', },
        { key: 'name', label: 'Tenant', isEditable: true },
        { key: 'user_name', label: 'Primary User Name' },
        { key: 'email_id', label: 'Primary User Email' },
        { key: 'active', label: 'Active', },
        { key: 'tenant_status_id', label: 'Status', isEditable: true },
        { key: 'last_updated_dt', label: 'Last Updated' },
        { key: 'actions', label: 'Action', },
      ],

      dialogParam: {
        id: 0,
      },

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    filteredTenantList(): any {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.tenantList.slice(startIndex, endIndex);
    },
  },
  validations() {
    return {
      tenant: {
        name: {
          required: helpers.withMessage('Tenant Name required', required),
        },
        user_name: {
          required: helpers.withMessage('Primary User Name is required', required),
        },
        email_id: {
          required: helpers.withMessage('Email ID is required', required),
          email: helpers.withMessage('Enter a valid Email ID', email),
        },
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
          this.editId = null;
          this.editKey = null;
          this.editValue = null;
        }
        // }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false
      }
    },
    handleTableCellClick(field: any, item: any) {
      if (field.isEditable) {
        this.editId = item.tenant_id;
        this.editKey = field.key;
        this.editValue = item[field.key];
      }
    },
    cancelInlineEdit(item: any, field: any) {
      item[field.key] = this.editValue;

      this.editId = null;
      this.editKey = null;
      this.editValue = null;
      this.getTenantList();
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
  }
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Manage Tenant</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn btn-primary mx-2" type="button"
          @click="bsModalShow('tenantAddEditModal'); modalId = 'tenantAddEditModal'">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New Tenant
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-primary">
          <tr>
            <th scope="col" v-for="field in tenantFields" :key="field.key">{{ field.label }}</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="tenant in filteredTenantList" :key="tenant">
            <td v-for="field in tenantFields" :key="field.key" @click="handleTableCellClick(field, tenant)"
              :class="{ 'clickable-cell': field.isEditable }">
              <template v-if="field.key == 'name'">
                <input v-if="editId == tenant.tenant_id && editKey == field.key" type="text" class="form-control"
                  v-model="tenant[field.key]" placeholder="Enter Name"
                  @keyup.enter="updateTenant(tenant, field.key, tenant[field.key])"
                  @blur="cancelInlineEdit(tenant, field.key)">
                <div v-else>{{ tenant[field.key] }}</div>
              </template>
              <template v-else-if="field.key == 'active'">
                <div v-if="tenant.user[field.key]" class="text-success">
                  <font-awesome-icon icon="fa-solid fa-user-check" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="fa-solid fa-user-xmark" />
                </div>
              </template>
              <template v-else-if="field.key == 'tenant_status_id'">
                <select v-if="editId == tenant.tenant_id && editKey == field.key" class="form-select form-control-sm"
                  v-model="tenant[field.key]" @change="updateTenant(tenant, field.key, tenant[field.key])"
                  @blur="cancelInlineEdit(tenant, field.key)" :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="item in accountStatus" :key="item.id" :value="item.id">{{ item.status }}</option>
                </select>
                <span v-else>{{ getTenantStatusById(tenant[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDate(tenant[field.key]) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div class="icon-btn me-3" @click="deleteTenant(tenant.tenant_id)" title="Delete Tenant"
                  data-bs-toggle="modal" data-bs-target="#deleteTenant">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </template>
              <template v-else-if="field.key == 'user_name' || field.key == 'email_id'">
                {{ tenant.user[field.key] }}
              </template>
              <template v-else>{{ tenant[field.key] }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BPagination v-if="tenantList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
      size="sm" />
  </div>
  <div class="modal fade" id="tenantAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New Tenant</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="name" class="col-sm-4 col-form-label">Tenant Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="tenant.name" id="name"
                    :class="{ 'is-invalid': v$.tenant.name.$error }" placeholder="Enter Tenant Name">
                  <div class="invalid-feedback" v-for="error of v$.tenant.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="user_name" class="col-sm-4 col-form-label">Primary User Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="tenant.user_name" id="user_name"
                    :class="{ 'is-invalid': v$.tenant.user_name.$error }" placeholder="Enter User Name">
                  <div class="invalid-feedback" v-for="error of v$.tenant.user_name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="email_id" class="col-sm-4 col-form-label">Primary User Email</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="tenant.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.tenant.email_id.$error }" placeholder="Enter Email ID">
                  <div class="invalid-feedback" v-for="error of v$.tenant.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="phone" class="col-sm-4 col-form-label">Phone</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="tenant.phone" id="phone"
                    placeholder="Enter Phone Number">
                </div>
              </div>
              <div class="row">
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
          <button type="button" @click="addTenant" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
  <dialog-component id="deleteTenant" :onYes="onYesTenant" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete tenant?" />
</template>