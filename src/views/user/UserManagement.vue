<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { USER_TYPES, ACCOUNT_STATUS } from '@/utils/constants'
import { UserTypeId } from '@/utils/enums'
import { formatDate } from '@/utils/dateFormats'
import { getUserStatusById, getUserTypeById, bsModalHide, bsModalShow } from '@/utils/commonFunctions'
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),
      formatDate: formatDate,
      getUserStatusById: getUserStatusById,
      getUserTypeById: getUserTypeById,
      bsModalHide: bsModalHide,
      bsModalShow: bsModalShow,

      isLoading: false,
      isModalLoading: false,
      editId: null as number | null,
      editKey: null as string | null,
      editValue: null as string | null,

      modalId: '',
      user: {
        user_id: null,
        user_type_id: null,
        user_name: null,
        email_id: null,
        phone: null,
        user_status_id: null,
      },

      userList: [],
      userFields: [
        { key: 'user_id', label: 'ID' },
        { key: 'user_name', label: 'User Name', isEditable: true },
        { key: 'email_id', label: 'Email ID', isEditable: true },
        { key: 'user_type_id', label: 'User Type', isEditable: true },
        { key: 'active', label: 'Active' },
        { key: 'user_status_id', label: 'Status', isEditable: true },
        { key: 'last_updated_dt', label: 'Last Updated' },
        { key: 'actions', label: 'Action' },
      ],
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
    userTypeId() {
      const userTypeId
        = localStorage.getItem("userTypeId");
      return userTypeId ? parseInt(userTypeId) : null;
    },
    userTypeList() {
      if (this.userTypeId == UserTypeId.SAD) {
        return USER_TYPES.filter(data => data.id == UserTypeId.SAD);
      }
      else {
        return USER_TYPES.filter(data => data.id != UserTypeId.SAD);
      }
    },
    filteredUserList(): any {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.userList.slice(startIndex, endIndex);
    },
  },
  validations() {
    return {
      user: {
        user_name: { required },
        email_id: { required, email },
        user_type_id: { required },
      }
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      try {
        this.isLoading = true;
        const response: any = await axios.get('/user/list')
        this.userList = response.userList;
        this.totalRows = this.userList.length;
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    async addUser() {
      try {
        this.v$.user.$touch();
        if (!this.v$.user.$invalid) {
          this.isModalLoading = true;
          const response: any = await axios.post('/user/add', this.user);
          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            this.getUserList();
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
    async updateUser(userData: any, updateKey: string) {
      try {
        // this.v$.user.$touch();
        // if (!this.v$.user.$invalid) {
        const data: any = {}
        data.user_id = userData.user_id;
        data.user_name = userData.user_name;
        data.email_id = userData.email_id;
        data[updateKey] = userData[updateKey];
        this.isLoading = true;
        const response: any = await axios.patch('/user/update', data);
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getUserList();
          this.editId = null;
          this.editKey = null;
          this.editValue = null;
          // this.bsModalHide();
        }
        // }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    deleteUser: function (id: number) {
      this.dialogParam.id = id;
    },
    async onYesUser() {
      try {
        this.isLoading = true;
        const response: any = await axios.delete('/user/delete/' + this.dialogParam.id)
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getUserList();
        }

      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    resendActivationMail: function (id: number) {
      this.dialogParam.id = id;
    },
    async onYesConfirmation() {
      try {
        this.isLoading = true;
        const response: any = await axios.post('/user/resendactivation/' + this.dialogParam.id)
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getUserList();
        }

      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    handleTableCellClick(field: any, item: any) {
      if (field.isEditable) {
        this.editId = item.user_id;
        this.editKey = field.key;
        this.editValue = item[field.key];
      }
    },
    cancelInlineEdit(item: any, field: any) {
      item[field.key] = this.editValue;

      this.editId = null;
      this.editKey = null;
      this.editValue = null;
      this.getUserList();
    }
  }
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Manage User</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card">
    <div class="row py-2">
      <div class="col text-end">
        <button class="btn primary-btn mx-2" type="button"
          @click="bsModalShow('userAddEditModal'); modalId = 'userAddEditModal'">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New User
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-dark">
          <tr>
            <th scope="col" v-for="field in userFields" :key="field.key">{{ field.label }}</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="item in filteredUserList" :key="item">
            <td v-for="field in userFields" :key="field.key" @click="handleTableCellClick(field, item)"
              :class="{ 'clickable-cell': field.isEditable }">
              <template v-if="field.key == 'user_name'">
                <input v-if="editId == item.user_id && editKey == field.key" type="text" class="form-control"
                  v-model="item[field.key]" placeholder="Enter Name" @keyup.enter="updateUser(item, field.key)"
                  @blur="cancelInlineEdit(item, field.key)">
                <div v-else>{{ item[field.key] }}</div>
              </template>
              <template v-else-if="field.key == 'email_id'">
                <input v-if="editId == item.user_id && editKey == field.key" type="email" class="form-control"
                  v-model="item[field.key]" placeholder="Enter Email Id" @keyup.enter="updateUser(item, field.key)"
                  @blur="cancelInlineEdit(item, field.key)">
                <div v-else>{{ item[field.key] }}</div>
              </template>
              <template v-else-if="field.key == 'user_type_id'">
                <select v-if="editId == item.user_id && editKey == field.key" class="form-select form-control-sm"
                  v-model="item[field.key]" @change="updateUser(item, field.key)"
                  @blur="cancelInlineEdit(item, field.key)" :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="info in userTypeList" :key="info.id" :value="info.id">{{ info.userType }}</option>
                </select>
                <span v-else>{{ getUserTypeById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'active'">
                <div v-if="item[field.key]" class="text-success">
                  <font-awesome-icon icon="fa-solid fa-user-check" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="fa-solid fa-user-xmark" />
                </div>
              </template>
              <template v-else-if="field.key == 'user_status_id'">
                <select v-if="editId == item.user_id && editKey == field.key" class="form-select form-control-sm"
                  v-model="item[field.key]" @change="updateUser(item, field.key)"
                  @blur="cancelInlineEdit(item, field.key)" :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="info in accountStatus" :key="info.id" :value="info.id">{{ info.status }}</option>
                </select>
                <span v-else>{{ getUserStatusById(item[field.key]) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDate(item[field.key]) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div v-if="!item.active" class="icon-btn me-3" @click="resendActivationMail(item.user_id)"
                  title="Resend Activation Mail" data-bs-toggle="modal" data-bs-target="#resendConfirmation">
                  <font-awesome-icon icon="fa-solid fa-share-from-square" />
                </div>
                <div class="icon-btn me-3" @click="deleteUser(item.user_id)" title="Delete User" data-bs-toggle="modal"
                  data-bs-target="#deleteUser">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </template>
              <template v-else>{{ item[field.key] }}</template>
            </td>
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
                <label for="user_name" class="col-sm-4 col-form-label">Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="user.user_name" id="user_name"
                    :class="{ 'is-invalid': v$.user.user_name.$error }" placeholder="Enter Name">
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
          <button type="button" @click="addUser" class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <dialog-component id="deleteUser" :onYes="onYesUser" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete user?" />
  <dialog-component id="resendConfirmation" :onYes="onYesConfirmation" :returnParams="dialogParam"
    title="Mail Resend Confirmation" message="Are you sure to resend activation mail?" />
</template>