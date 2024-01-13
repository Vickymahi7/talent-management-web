<script lang="ts" setup>
import UserPrivilegeModal from '@/components/modals/UserPrivilegeModal.vue'
import axios from '@/plugins/axios'
import type { User } from '@/types/User'
import { ACCOUNT_STATUS, USER_TYPES } from '@/utils/constants'
import { formatDateTime } from '@/utils/dateFormats'
import { UserTypeId } from '@/utils/enums'
import { useCommonFunctions } from '@/utils/useCommonFunctions'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { HttpStatusCode } from 'axios'
import type { Modal } from 'bootstrap'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast();
const commonFunctions = useCommonFunctions();

const userPrivilegeRef = ref(null as InstanceType<typeof UserPrivilegeModal> | null);
const scrollerRef = ref(null as InstanceType<typeof HTMLElement> | null);
const userAddEditModalRef = ref(null as null | Modal);

const isPageEnd = ref(false);
const perPage = ref(10);
const lastRecordKey = ref(null);
const isLoading = ref(false);
const isModalLoading = ref(false);
const editId = ref(null as number | null);

const user = ref({} as User);

const userList = ref([] as User[]);
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

const validations = computed(() => {
  return {
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
  }
});
const v$ = useVuelidate(validations, { user });

onMounted(() => {
  getUserList();
});
// onBeforeUnmount(() => {
//   _hideModal();
// });

const getUpdatedUserList = () => {
  lastRecordKey.value = null;
  isPageEnd.value = false;
  userList.value = [];
  getUserList();
};
const getUserList = async () => {
  try {
    const queryParams = {
      lastRecordKey: lastRecordKey.value,
      perPage: perPage.value,
    };
    isLoading.value = true;
    const response: any = await axios.get('/user/list', { params: queryParams })
    lastRecordKey.value = response.lastRecordKey;
    if (lastRecordKey.value) {
      userList.value = userList.value.concat(response.userList);
    }
    else {
      isPageEnd.value = true;
    }
    // userList.value = response.userList;
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
        getUpdatedUserList();
        _hideModal();
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
      getUpdatedUserList();
      editId.value = null;
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
      getUpdatedUserList();
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
      getUpdatedUserList();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const handleTableCellClick = (item: any) => {
  editId.value = item.user_id;
}
const cancelInlineEdit = () => {
  editId.value = null;
  getUpdatedUserList();
}
const showUserPrivileges = (userId: number) => {
  userPrivilegeRef.value?.showModal(userId);
}

const handleScroll = (refName: string, isNotLoading: boolean, callback: Function) => {
  // Trigger fetchData when scrolling near the bottom of the container
  if (scrollerRef.value && scrollerRef.value.scrollTop + scrollerRef.value.clientHeight >= scrollerRef.value.scrollHeight - 20 && isNotLoading && !isPageEnd.value) {
    callback();
  }
};
const clearData = () => {
  user.value = {};
  v$.value.user.$reset();
}

const _showModal = () => {
  userAddEditModalRef.value?.show();
}
const _hideModal = () => {
  userAddEditModalRef.value?.hide();
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Manage User</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card"
    @scroll="handleScroll('scrollerRef', !isLoading, getUserList)" ref="scrollerRef">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn btn-primary mx-2" type="button" @click="_showModal">
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
          <tr v-for="item in userList" :key="item.user_id">
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
                <span v-else>{{ commonFunctions.getUserTypeById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'user_status_id'">
                <select v-if="editId == item.user_id" class="form-select form-control-sm" v-model="item[field.key]"
                  :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="info in ACCOUNT_STATUS" :key="info.id" :value="info.id">{{ info.status }}</option>
                </select>
                <span v-else>{{ commonFunctions.getUserStatusById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDateTime(item[field.key]) }}
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
                  <div v-if="!item.active" class="icon-btn me-2" @click="resendActivationMail(item.user_id!)"
                    title="Resend Activation Mail" data-bs-toggle="modal" data-bs-target="#resendConfirmation">
                    <font-awesome-icon icon="fa-solid fa-share-from-square" />
                  </div>
                  <div class="icon-btn me-2" @click="handleTableCellClick(item)" title="Edit User">
                    <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                  </div>
                  <div class="icon-btn me-2" @click="deleteUser(item.user_id!)" title="Delete User" data-bs-toggle="modal"
                    data-bs-target="#deleteUser">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </div>
                  <div class="icon-btn" @click="showUserPrivileges(item.user_id!)" title="User Privileges">
                    <font-awesome-icon icon="fa-solid fa-cog" />
                  </div>
                </template>
              </template>
              <template v-else>{{ item[field.key] }}</template>
            </td>
          </tr>
          <tr v-if="userList.length == 0">
            <td colspan="12" class="text-center"> No record found </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- <div class="modal fade" id="userAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body"> -->
  <ModalComponent v-loading="isModalLoading" ref="userAddEditModalRef" title="New User" @hide="clearData" hide-cancel
    centered no-close-on-backdrop no-close-on-esc>
    <template #body>
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
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="addUser">Save</button>
    </template>
  </ModalComponent>
  <UserPrivilegeModal ref="userPrivilegeRef" />
  <dialog-component id="deleteUser" :onYes="onYesUser" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete user?" />
  <dialog-component id="resendConfirmation" :onYes="onYesConfirmation" :returnParams="dialogParam"
    title="Mail Resend Confirmation" message="Are you sure to resend activation mail?" />
</template>