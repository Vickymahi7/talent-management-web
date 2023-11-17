<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { USER_TYPES, ACCOUNT_STATUS } from '@/utils/constants'
import { UserTypeId } from '@/utils/enums'
import { Modal } from 'bootstrap'
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

      userEdit: false,
      isLoading: false,
      isModalLoading: false,

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
    filteredUserList() {
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
    async updateUser(userData: any, updateKey: string, updateVal: string) {
      try {
        // this.v$.user.$touch();
        // if (!this.v$.user.$invalid) {
        const data: any = {}
        data.user_id = userData.user_id;
        data.user_name = userData.user_name;
        data.email_id = userData.email_id;
        data[updateKey] = updateVal;
        this.isLoading = true;
        const response: any = await axios.patch('/user/update', data);
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getUserList();
          this.userEdit = false;
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
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>Manage User</label>
  </div>
  <div class="content-card h-100">
    <loading-overlay :showOverlay="isLoading">
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
              <th scope="col">ID</th>
              <th scope="col">User Name</th>
              <th scope="col">Email ID</th>
              <th scope="col">User Type</th>
              <th scope="col">Active</th>
              <th scope="col">Status</th>
              <th scope="col">Last Updated</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody class="custom-tbody-style">
            <tr v-for="user in filteredUserList" :key="user.id">
              <td>{{ user.user_id }}</td>
              <td>{{ user.user_name }}</td>
              <td>{{ user.email_id }}</td>
              <td>{{ getUserTypeById(user.user_type_id) }}</td>
              <td>
                <div v-if="user.active" class="text-success">
                  <font-awesome-icon icon="fa-solid fa-user-check" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="fa-solid fa-user-xmark" />
                </div>
              </td>
              <td @click="userEdit = true">
                <select v-if="userEdit" class="form-select form-control-sm" v-model="user.user_status_id"
                  @change="updateUser(user, 'user_status_id', user.user_status_id)" aria-label="User Status">
                  <option :value="null">Select</option>
                  <option v-for="item in accountStatus" :key="item.id" :value="item.id">{{ item.status }}</option>
                </select>
                <span v-else>{{ getUserStatusById(user.user_status_id) }}</span>
              </td>
              <td>{{ formatDate(user.last_updated_dt) }}</td>
              <td>
                <div v-if="!user.active" class="icon-btn me-3" @click="resendActivationMail(user.user_id)"
                  title="Resend Activation Mail" data-bs-toggle="modal" data-bs-target="#resendConfirmation">
                  <font-awesome-icon icon="fa-solid fa-share-from-square" />
                </div>
                <div class="icon-btn me-3" @click="deleteUser(user.user_id)" title="Delete User" data-bs-toggle="modal"
                  data-bs-target="#deleteUser">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BPagination v-if="userList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
        size="sm" />
    </loading-overlay>
  </div>
  <div class="modal fade" id="userAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <loading-overlay :showOverlay="isModalLoading">
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
                  <label for="user_type_id" class="col-sm-4 col-form-label">User Type</label>
                  <div class="col-sm-8">
                    <select class="form-select" v-model="user.user_type_id"
                      :class="{ 'is-invalid': v$.user.user_type_id.$error }" aria-label="User Type">
                      <option :value="null">Select</option>
                      <option v-for="item in userTypeList" :key="item.id" :value="item.id">{{ item.userType }}</option>
                    </select>
                    <div class="invalid-feedback" v-for="error of v$.user.user_type_id.$errors" :key="error.$uid">
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
                    <input type="tet" class="form-control" v-model="user.phone" id="phone"
                      placeholder="Enter Phone Number">
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
      </loading-overlay>
    </div>
  </div>
  <dialog-component id="deleteUser" :onYes="onYesUser" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete user?" />
  <dialog-component id="resendConfirmation" :onYes="onYesConfirmation" :returnParams="dialogParam"
    title="Mail Resend Confirmation" message="Are you sure to resend activation mail?" />
</template>