<script setup lang="ts">
import axios from "@/plugins/axios";
import type { User } from "@/types/User";
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, requiredIf, sameAs } from "@vuelidate/validators";
import { HttpStatusCode } from "axios";
import { Modal } from "bootstrap";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import ModalComponent from "./ModalComponent.vue";
const toast = useToast();

const userProfileModal = ref(null as null | Modal);

const elements = ref({
  editMode: false,
  passwordEditMode: false,
});
const isLoading = ref(false);
const user = ref([] as User);

const userId = computed(() => {
  const userId
    = localStorage.getItem("userId");
  return userId ? parseInt(userId) : null;
});


const validations = computed(() => {
  return {
    user: {
      user_name: {
        required: helpers.withMessage('Display Name is required', requiredIf(elements.value.editMode)),
      },
      email_id: {
        required: helpers.withMessage('Email ID is required', requiredIf(elements.value.editMode)),
        email: helpers.withMessage('Enter a valid Email ID', email),
      },
      existing_password: {
        required: helpers.withMessage('Existing Password is required', requiredIf(elements.value.passwordEditMode)),
      },
      password: {
        required: helpers.withMessage('Password is required', requiredIf(elements.value.passwordEditMode)),
        minLength: helpers.withMessage(({ $params }) =>
          `Password must have a minimum length of ${$params.min} characters`, minLength(6)),
      },
      confirm_password: {
        required: helpers.withMessage('Confirm password is required', requiredIf(elements.value.passwordEditMode)),
        sameAsPassword: helpers.withMessage('Passwords does not match', sameAs(user.value.password)),
      },
    }
  }
});
const v$ = useVuelidate(validations, { user });

const getUserDetail = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/user/view/' + userId.value)
    user.value = response.user;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const updateUser = async () => {
  try {
    const userData: User = {}
    userData.user_id = user.value.user_id;
    userData.user_name = user.value.user_name;
    userData.email_id = user.value.email_id;
    userData.phone = user.value.phone;
    v$.value.user.$touch();
    if (!v$.value.user.$invalid) {
      isLoading.value = true;
      const response: any = await axios.patch('/user/update', userData);
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        elements.value.editMode = false;
        elements.value.passwordEditMode = false;
        getUserDetail();
        // bsModalHide();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const changeExistingPassword = async () => {
  try {
    const userData: User = {}
    userData.user_id = user.value.user_id;
    userData.password = user.value.password;
    userData.existing_password = user.value.existing_password;

    v$.value.user.$touch();
    if (!v$.value.user.$invalid) {
      isLoading.value = true;
      const response: any = await axios.post('/user/changepassword', userData);
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        elements.value.editMode = false;
        elements.value.passwordEditMode = false;
        getUserDetail();
        // bsModalHide();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const _showModal = () => {
  userProfileModal.value?.show();

  getUserDetail();
}

defineExpose({ showModal: _showModal });
</script>

<template>
  <ModalComponent v-loading="isLoading" title="My Profile" ref="userProfileModal" size="modal-lg" centered hide-footer>
    <template #body>
      <div class="container profile-setting">
        <div v-if="!elements.editMode" class="row mb-2 text-end">
          <div class="col">
            <a href="#" @click.prevent="elements.passwordEditMode = false; elements.editMode = true">
              <font-awesome-icon icon="fa-solid fa-pencil-alt" class="me-1" />Edit Profile</a>
          </div>
        </div>
        <div class="row gy-5">
          <div class="col-4">
            <div class="card shadow-sm p-3">
              <div class="py-2">
                <img class="d-block rounded-circle mx-auto" src="@/assets/img/user-icon.jpg" alt="" width="100"
                  height="100">
              </div>
              <div class="row text-center">
                <div class="col-12">
                  <h6>{{ user.user_name }}</h6>
                </div>
                <div class="col-12">
                  <p><font-awesome-icon icon="fa-solid fa-user" class="me-2" />Power User</p>
                </div>
                <!-- <div class="col-12">
                  <p><font-awesome-icon icon="fa-solid fa-envelope" class="me-2" />vickyz@text.com</p>
                </div>
                <div class="col-12">
                  <p><font-awesome-icon icon="fa-solid fa-phone" class="me-2" />9874561230</p>
                </div> -->
              </div>
            </div>
          </div>
          <div class="col-8">
            <div class="card shadow-sm p-3">
              <form v-if="elements.editMode">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" v-model="user.user_name" class="form-control border-0"
                        :class="{ 'is-invalid': v$.user.user_name.$error }" id="profile_user_name" placeholder="">
                      <label for="profile_user_name">Name</label>
                      <div class="invalid-feedback" v-for="error of v$.user.user_name.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                  <!-- <div class="col-6">
                    <div class="form-floating">
                      <input type="text" class="form-control border-0" id="floatingInput" placeholder="">
                      <label for="floatingInput">Last Name</label>
                    </div>
                  </div> -->
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="email" v-model="user.email_id" class="form-control border-0"
                        :class="{ 'is-invalid': v$.user.email_id.$error }" id="profile_email_id" placeholder="">
                      <label for="profile_email_id">Email address</label>
                      <div class="invalid-feedback" v-for="error of v$.user.email_id.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" v-model="user.phone" class="form-control border-0" id="profile_phone"
                        placeholder="">
                      <label for="profile_phone">Phone</label>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row mt-2">
                  <div class="col-12 text-end">
                    <button class="btn btn-primary me-2" @click.prevent="updateUser">Save</button>
                    <button class="btn btn-secondary" @click.prevent="elements.editMode = false">Cancel</button>
                  </div>
                </div>
              </form>
              <template v-else>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">Name</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ user.user_name }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">Email ID</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ user.email_id }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">Phone</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ user.phone }}</p>
                  </div>
                </div>
              </template>
            </div>
            <div class="card shadow-sm p-3 mt-2">
              <form v-if="elements.passwordEditMode">
                <h6>Change Password</h6>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="password" v-model="user.existing_password" class="form-control border-0"
                        :class="{ 'is-invalid': v$.user.existing_password.$error }" id="profile_existing_password"
                        placeholder="">
                      <label for="profile_existing_password">Existing Password</label>
                      <div class="invalid-feedback" v-for="error of v$.user.existing_password.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="password" v-model="user.password" class="form-control border-0"
                        :class="{ 'is-invalid': v$.user.password.$error }" id="profile_password" placeholder="">
                      <label for="profile_password">New Password</label>
                      <div class="invalid-feedback" v-for="error of v$.user.password.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                  <!-- <div class="col-6">
                    <div class="form-floating">
                      <input type="email" class="form-control border-0" :class="{ 'is-invalid': v$.user.email.$error }" id="floatingInput" placeholder="">
                      <label for="floatingInput">Last Name</label>
                    </div>
                  </div> -->
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="password" v-model="user.confirm_password" class="form-control border-0"
                        :class="{ 'is-invalid': v$.user.confirm_password.$error }" id="profile_confirm_password"
                        placeholder="">
                      <label for="profile_confirm_password">Confirm New Password</label>
                      <div class="invalid-feedback" v-for="error of v$.user.confirm_password.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row mt-2">
                  <div class="col-12 text-end">
                    <button class="btn btn-primary me-2" @click.prevent="changeExistingPassword">Save</button>
                    <button class="btn btn-secondary" @click.prevent="elements.passwordEditMode = false">Cancel</button>
                  </div>
                </div>
              </form>
              <template v-else>
                <div class="row">
                  <div class="col-12">
                    <button class="btn btn-primary"
                      @click.prevent="elements.editMode = false; elements.passwordEditMode = true">Change
                      Password</button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- <template #footer>
      <button class="btn btn-primary">Save</button>
    </template> -->
  </ModalComponent>
</template>