<script lang="ts" setup>
import UserPrivilege from '@/components/modals/UserPrivilege.vue'
import axios from '@/plugins/axios'
import { bsModalHide, bsModalShow, getUserStatusById, getUserTypeById } from '@/utils/commonFunctions'
import { ACCOUNT_STATUS, USER_TYPES } from '@/utils/constants'
import { formatDate } from '@/utils/dateFormats'
import { UserTypeId } from '@/utils/enums'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { HttpStatusCode } from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast();

const userPrivilegeRef = ref(null as InstanceType<typeof UserPrivilege> | null);
const isLoading = ref(false);
const isModalLoading = ref(false);
const editId = ref(null as number | null);
const editKey = ref(null as string | null);
const editValue = ref(null as string | null);

const modalId = ref('');
const user = ref({
  user_id: null,
  user_type_id: null,
  user_name: null,
  email_id: null,
  phone: null,
  user_status_id: null,
});

const userList = ref([]);
const userFields = ref([
  { key: 'user_id', label: 'ID' },
  { key: 'user_name', label: 'Display Name', isEditable: true },
  { key: 'email_id', label: 'Email ID', isEditable: true },
  { key: 'user_type_id', label: 'User Type', isEditable: true },
  // { key: 'active', label: 'Active' },
  { key: 'user_status_id', label: 'Status', isEditable: true },
  { key: 'last_updated_dt', label: 'Last Updated' },
  { key: 'actions', label: 'Action' },
]);

const dialogParam = ref({
  id: 0,
});

const totalRows = ref(1);
const currentPage = ref(1);
const perPage = ref(10);

const userTypeId = computed(() => {
  const userTypeId
    = localStorage.getItem("userTypeId");
  return userTypeId ? parseInt(userTypeId) : null;
});
const userTypeList = computed(() => {
  if (userTypeId.value == UserTypeId.SAD) {
    return USER_TYPES.filter(data => data.id == UserTypeId.SAD);
  }
  else {
    return USER_TYPES.filter(data => data.id != UserTypeId.SAD);
  }
});
const filteredUserList = computed((): any => {
  const startIndex = (currentPage.value - 1) * perPage.value;
  const endIndex = startIndex + perPage.value;
  return userList.value.slice(startIndex, endIndex);
});

const validations = {
  user: {
    user_name: {
      required: helpers.withMessage('Display Name is required', required),
    },
    email_id: {
      required: helpers.withMessage('Email ID is required', required),
      email: helpers.withMessage('Enter a valid Email ID', email),
    },
    user_type_id: {
      required: helpers.withMessage('User Type is required', required),
    },
  }
};
const v$ = useVuelidate(validations, { user });

onMounted(() => {
  getUserList();
});

const getUserList = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/user/list')
    userList.value = response.userList;
    totalRows.value = userList.value.length;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const addUser = async () => {
  try {
    v$.value.user.$touch();
    if (!v$.value.user.$invalid) {
      isModalLoading.value = true;
      const response: any = await axios.post('/user/add', user.value);
      if (response.status == HttpStatusCode.Created) {
        toast.success(response.message);
        getUserList();
        bsModalHide(modalId.value);
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
}
const updateUser = async (userData: any) => {
  try {
    // v$.user.$touch();
    // if (!v$.user.$invalid) {
    const data: any = {}
    data.user_id = userData.user_id;
    data.user_name = userData.user_name;
    data.email_id = userData.email_id;
    data.user_name = userData.user_name;
    data.email_id = userData.email_id;
    data.user_type_id = userData.user_type_id;
    data.user_status_id = userData.user_status_id;
    isLoading.value = true;
    const response: any = await axios.patch('/user/update', data);
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUserList();
      editId.value = null;
      editKey.value = null;
      editValue.value = null;
      // bsModalHide();
    }
    // }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const deleteUser = (id: number) => {
  dialogParam.value.id = id;
}
const onYesUser = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/user/delete/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUserList();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const resendActivationMail = (id: number) => {
  dialogParam.value.id = id;
}
const onYesConfirmation = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.post('/user/resendactivation/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUserList();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const handleTableCellClick = (field: any, item: any) => {
  // if (field.isEditable) {
  editId.value = item.user_id;
  editKey.value = field.key;
  editValue.value = item[field.key];
  // }
}
const cancelInlineEdit = () => {
  // item[field.key] = editValue;

  editId.value = null;
  editKey.value = null;
  editValue.value = null;
  // getUserList();
}
const showUserPrivileges = (userId: number) => {
  userPrivilegeRef.value?.showModal(userId);
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Manage User</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn btn-primary mx-2" type="button"
          @click="bsModalShow('userAddEditModal'); modalId = 'userAddEditModal'">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New User
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-primary">
          <tr>
            <th scope="col" v-for="field in userFields" :key="field.key">{{ field.label }}</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="item in filteredUserList" :key="item">
            <td v-for="field in userFields" :key="field.key">
              <template v-if="field.key == 'user_name'">
                <input v-if="editId == item.user_id" type="text" class="form-control form-control-sm"
                  v-model="item[field.key]" placeholder="Enter Name" @keyup.enter="updateUser(item)">
                <div v-else>
                  <span v-if="item.active" class="text-success me-2" title="User Activated">
                    <font-awesome-icon icon="fa-solid fa-user-check" />
                  </span>
                  <span v-else class="text-danger me-2" title="User Not Activated">
                    <font-awesome-icon icon="fa-solid fa-user-xmark" />
                  </span>
                  {{ item[field.key] }}
                </div>
              </template>
              <template v-else-if="field.key == 'email_id'">
                <input v-if="editId == item.user_id" type="email" class="form-control form-control-sm"
                  v-model="item[field.key]" placeholder="Enter Email Id" @keyup.enter="updateUser(item)">
                <div v-else>{{ item[field.key] }}</div>
              </template>
              <template v-else-if="field.key == 'user_type_id'">
                <select v-if="editId == item.user_id" class="form-select form-control-sm" v-model="item[field.key]"
                  :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="info in userTypeList" :key="info.id" :value="info.id">{{ info.userType }}</option>
                </select>
                <span v-else>{{ getUserTypeById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'user_status_id'">
                <select v-if="editId == item.user_id" class="form-select form-control-sm" v-model="item[field.key]"
                  :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="info in ACCOUNT_STATUS" :key="info.id" :value="info.id">{{ info.status }}</option>
                </select>
                <span v-else>{{ getUserStatusById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDate(item[field.key]) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <template v-if="editId == item.user_id">
                  <span class="icon-btn mx-1" @click="updateUser(item)">
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </span>
                  <span class="icon-btn" @click="cancelInlineEdit()">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </span>
                </template>
                <template v-else>
                  <div v-if="!item.active" class="icon-btn me-2" @click="resendActivationMail(item.user_id)"
                    title="Resend Activation Mail" data-bs-toggle="modal" data-bs-target="#resendConfirmation">
                    <font-awesome-icon icon="fa-solid fa-share-from-square" />
                  </div>
                  <div class="icon-btn me-2" @click="handleTableCellClick(field, item)" title="Edit User">
                    <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                  </div>
                  <div class="icon-btn me-2" @click="deleteUser(item.user_id)" title="Delete User" data-bs-toggle="modal"
                    data-bs-target="#deleteUser">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </div>
                  <div class="icon-btn me-2" @click="showUserPrivileges(item.user_id)" title="User Privileges">
                    <font-awesome-icon icon="fa-solid fa-cog" />
                  </div>
                </template>
              </template>
              <template v-else>{{ item[field.key] }}</template>
            </td>
          </tr>
          <tr v-if="filteredUserList.length == 0">
            <td colspan="12" class="text-center"> No record found </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BPagination v-if="userList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
      size="sm" />
  </div>
  <div class="modal fade" id="userAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="user_name" class="col-sm-4 col-form-label">Display Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="user.user_name" id="user_name"
                    :class="{ 'is-invalid': v$.user.user_name.$error }" placeholder="Enter Display Name">
                  <div class="invalid-feedback" v-for="error of v$.user.user_name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="user_type_id" class="col-sm-4 col-form-label">User Type</label>
                <div class="col-sm-8">
                  <select class="form-select" v-model="user.user_type_id"
                    :class="{ 'is-invalid': v$.user.user_type_id.$error }" aria-label="User Type">
                    <option :value="null">Select</option>
                    <option v-for="info in userTypeList" :key="info.id" :value="info.id">{{ info.userType }}</option>
                  </select>
                  <div class="invalid-feedback" v-for="error of v$.user.user_type_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="email_id" class="col-sm-4 col-form-label">Email ID</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="user.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.user.email_id.$error }" placeholder="Enter Email ID">
                  <div class="invalid-feedback" v-for="error of v$.user.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="phone" class="col-sm-4 col-form-label">Phone</label>
                <div class="col-sm-8">
                  <input type="tet" class="form-control" v-model="user.phone" id="phone" placeholder="Enter Phone Number">
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="addUser" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
  <UserPrivilege ref="userPrivilegeRef" />
  <dialog-component id="deleteUser" :onYes="onYesUser" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete user?" />
  <dialog-component id="resendConfirmation" :onYes="onYesConfirmation" :returnParams="dialogParam"
    title="Mail Resend Confirmation" message="Are you sure to resend activation mail?" />
</template>