<script lang="ts" setup>
import axios from '@/plugins/axios'
import type { Tenant } from '@/types/Tenant'
import { ACCOUNT_STATUS } from '@/utils/constants'
import { formatDateTime } from '@/utils/dateFormats'
import { useCommonFunctions } from '@/utils/useCommonFunctions'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { HttpStatusCode } from 'axios'
import type { Modal } from 'bootstrap'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast();
const commonFunctions = useCommonFunctions();

const isLoading = ref(false);
const isModalLoading = ref(false);

const editId = ref(null as number | null);
const scrollerRef = ref(null as InstanceType<typeof HTMLElement> | null);
const tenantAddEditModalRef = ref(null as null | Modal);

const isPageEnd = ref(false);
const perPage = ref(10);
const lastRecordKey = ref(null);
const tenant = ref({} as Tenant);

const tenantList = ref([] as Tenant[]);
const tenantFields = [
  { key: 'tenant_id', label: 'ID', },
  { key: 'name', label: 'Tenant', isEditable: true },
  { key: 'user_name', label: 'Display Name' },
  { key: 'email_id', label: 'Login Email' },
  { key: 'tenant_status_id', label: 'Status', isEditable: true },
  { key: 'last_updated_dt', label: 'Last Updated' },
  { key: 'actions', label: 'Action', },
];

const dialogParam = ref({
  id: 0,
})

const validations = computed(() => {
  return {
    tenant: {
      name: {
        required: helpers.withMessage('Tenant Name is required', required),
      },
      user_name: {
        required: helpers.withMessage('Display Name is required', required),
      },
      // tenant_email_id: {
      //   required: helpers.withMessage('Tenant Email ID is required', required),
      //   email: helpers.withMessage('Enter a valid Tenant Email ID', email),
      // },
      // tenant_phone: {
      //   required: helpers.withMessage('Tenant Phone Number is required', required),
      // },
      email_id: {
        required: helpers.withMessage('Email ID is required', required),
        email: helpers.withMessage('Enter a valid Email ID', email),
      },
    }
  }
});
const v$ = useVuelidate(validations, { tenant });

onMounted(() => {
  getTenantList();
});

// onBeforeUnmount(() => {
//   _hideModal();
// });

const getUpdatedTenantList = () => {
  lastRecordKey.value = null;
  isPageEnd.value = false;
  tenantList.value = [];
  getTenantList();
};

const getTenantList = async () => {
  try {
    const queryParams = {
      lastRecordKey: lastRecordKey.value,
      perPage: perPage.value,
    };
    isLoading.value = true;
    const response: any = await axios.get('/tenant/list', { params: queryParams })
    lastRecordKey.value = response.lastRecordKey;
    if (lastRecordKey.value) {
      tenantList.value = tenantList.value.concat(response.tenantList);
    }
    else {
      isPageEnd.value = true;
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const addTenant = async () => {
  try {
    v$.value.tenant.$touch();
    if (!v$.value.tenant.$invalid) {
      isModalLoading.value = true;
      const response: any = await axios.post('/tenant/add', tenant.value);
      if (response.status == HttpStatusCode.Conflict) {
        toast.info(response.message);
      }
      else if (response.status == HttpStatusCode.Created) {
        toast.success(response.message);
        getUpdatedTenantList();
        _hideModal();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
};
const updateTenant = async (tenantData: Tenant) => {
  try {
    // v$.value.tenant.$touch();
    // if (!v$.value.tenant.$invalid) {
    const data: any = {}
    data.tenant_id = tenantData.tenant_id;
    data.name = tenantData.name;
    data.user_id = tenantData.user_id;
    data.name = tenantData.name;
    data.tenant_status_id = tenantData.tenant_status_id;
    isLoading.value = true;
    const response: any = await axios.patch('/tenant/update', data);
    if (response.status == HttpStatusCode.BadRequest) {
      toast.info(response.message);
    }
    else if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUpdatedTenantList();
      editId.value = null;
    }
    // }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false
  }
};
const cancelInlineEdit = () => {
  editId.value = null;
  getUpdatedTenantList();
};
const handleTableCellClick = (item: Tenant) => {
  editId.value = item.tenant_id!;
}
const deleteTenant = (id: number) => {
  dialogParam.value.id = id;
};
const onYesTenant = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/tenant/delete/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUpdatedTenantList();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};

const handleScroll = (refName: string, isNotLoading: boolean, callback: Function) => {
  // Trigger fetchData when scrolling near the bottom of the container
  if (scrollerRef.value && scrollerRef.value.scrollTop + scrollerRef.value.clientHeight >= scrollerRef.value.scrollHeight - 20 && isNotLoading && !isPageEnd.value) {
    callback();
  }
};
const clearData = () => {
  tenant.value = {};
  v$.value.tenant.$reset();
}

const _showModal = () => {
  tenantAddEditModalRef.value?.show();
}
const _hideModal = () => {
  tenantAddEditModalRef.value?.hide();
}

</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Manage Tenant</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card"
    @scroll="handleScroll('scrollerRef', !isLoading, getTenantList)" ref="scrollerRef">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn btn-primary mx-2" type="button" @click="_showModal">
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
          <tr v-for="tenant in tenantList" :key="tenant.tenant_id!">
            <td v-for="field in tenantFields" :key="field.key">
              <template v-if="field.key == 'name'">
                <input v-if="editId == tenant.tenant_id" type="text" class="form-control form-control-sm"
                  v-model="tenant[field.key]" placeholder="Enter Name" @keyup.enter="updateTenant(tenant)">
                <template v-else>
                  <span v-if="tenant.user?.active" class="text-success me-2" title="User Activated">
                    <font-awesome-icon icon="fa-solid fa-user-check" />
                  </span>
                  <span v-else class="text-danger me-2" title="User Not Activated">
                    <font-awesome-icon icon="fa-solid fa-user-xmark" />
                  </span>
                  {{ tenant[field.key] }}
                </template>
              </template>
              <template v-else-if="field.key == 'tenant_status_id'">
                <select v-if="editId == tenant.tenant_id" class="form-select form-control-sm" v-model="tenant[field.key]"
                  @change="updateTenant(tenant)" :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="item in ACCOUNT_STATUS" :key="item.id" :value="item.id">{{ item.status }}</option>
                </select>
                <span v-else>{{ commonFunctions.getTenantStatusById(tenant[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDateTime(tenant[field.key]) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <template v-if="editId == tenant.tenant_id">
                  <span class="icon-btn mx-1" @click="updateTenant(tenant)">
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </span>
                  <span class="icon-btn" @click="cancelInlineEdit()">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </span>
                </template>
                <template v-else>
                  <div class="icon-btn me-2" @click="handleTableCellClick(tenant)" title="Edit Tenant">
                    <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                  </div>
                  <div v-if="tenant.user && !tenant.user.active" class="icon-btn" @click="deleteTenant(tenant.tenant_id!)"
                    title="Delete Tenant" data-bs-toggle="modal" data-bs-target="#deleteTenant">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </div>
                </template>
              </template>
              <template v-else-if="field.key == 'user_name' || field.key == 'email_id'">
                {{ tenant.user![field.key] }}
              </template>
              <template v-else>{{ tenant[field.key] }}</template>
            </td>
          </tr>
          <tr v-if="tenantList.length == 0">
            <td colspan="12" class="text-center"> No record found </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ModalComponent v-loading="isModalLoading" ref="tenantAddEditModalRef" title="New Tenant" @hide="clearData" hide-cancel
    centered>
    <template #body>
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
            <label for="user_name" class="col-sm-4 col-form-label">Display Name</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="tenant.user_name" id="user_name"
                :class="{ 'is-invalid': v$.tenant.user_name.$error }" placeholder="Enter Display Name">
              <div class="invalid-feedback" v-for="error of v$.tenant.user_name.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="row">
            <label for="email_id" class="col-sm-4 col-form-label">Email ID</label>
            <div class="col-sm-8">
              <input type="email" class="form-control" v-model="tenant.email_id" id="email_id"
                :class="{ 'is-invalid': v$.tenant.email_id.$error }" placeholder="Enter Login Email ID">
              <div class="invalid-feedback" v-for="error of v$.tenant.email_id.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="row">
            <label for="phone" class="col-sm-4 col-form-label">Phone</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="tenant.phone" id="phone" placeholder="Enter Phone Number">
            </div>
          </div>
          <!-- <div class="row">
            <label for="name" class="col-sm-4 col-form-label">Email ID</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="tenant.tenant_email_id" id="tenant_email_id"
                :class="{ 'is-invalid': v$.tenant.tenant_email_id.$error }" placeholder="Enter Email ID">
              <div class="invalid-feedback" v-for="error of v$.tenant.tenant_email_id.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="row">
            <label for="name" class="col-sm-4 col-form-label">Phone</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="tenant.tenant_phone" id="tenant_phone"
                :class="{ 'is-invalid': v$.tenant.tenant_phone.$error }" placeholder="Enter Phone">
              <div class="invalid-feedback" v-for="error of v$.tenant.tenant_phone.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div> -->
          <div class="row">
            <label for="location" class="col-sm-4 col-form-label">Location</label>
            <div class="col-sm-8">
              <input type="text" v-model="tenant.location" class="form-control" id="location"
                placeholder="Enter Location">
            </div>
          </div>
          <!-- <h6 class="mt-4">Primary User Info</h6>
          <hr class="mt-0"> -->
        </form>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="addTenant">Save</button>
    </template>
  </ModalComponent>
  <dialog-component id="deleteTenant" :onYes="onYesTenant" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete tenant?" />
</template>
