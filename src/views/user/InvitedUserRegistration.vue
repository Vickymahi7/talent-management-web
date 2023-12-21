<script lang="ts">
import axios from '@/plugins/axios'
import type { User } from '@/types/User';
import useVuelidate from '@vuelidate/core';
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'
import { HttpStatusCode } from 'axios';
import { useToast } from 'vue-toastification';
export default {
  props: {
    token: String,
  },
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      showActivationForm: false,
      isActiveUser: false,

      isLoading: false,
      email_id: '',

      user: {
        user_id: null as number | null,
        email_id: '',
        user_name: '',
        phone: '',
        password: '',
        confirm_password: '',
        active: false,
      } as User
    }
  },
  validations() {
    return {
      user: {
        user_name: {
          required: helpers.withMessage('Display Name is required', required),
        },
        password: {
          required: helpers.withMessage('Password is required', required),
          minLength: helpers.withMessage(({ $params }) =>
            `Password must have a minimum length of ${$params.min} characters`, minLength(6)),
        },
        confirm_password: {
          required: helpers.withMessage('Please confirm your password', required),
          sameAsPassword: helpers.withMessage('Passwords does not match', sameAs(this.user.password)),
        },
      }
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        const data = {
          key: this.token,
        }
        this.isLoading = true;
        const response: any = await axios.post('/user/inviteduser/decode', data)
        this.user = response.user;
        console.log(this.user)
        if (this.user) {
          this.email_id = this.user.email_id ?? '';
          this.showActivationForm = this.user.active ? false : true;
          this.isActiveUser = this.user.active ?? false;
        }
      } catch (error: any) {
        if (error.status == HttpStatusCode.NotFound) {
          this.$router.push('/');
        }
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    async registerInvitedUser() {
      try {
        this.v$.user.$touch();
        if (!this.v$.user.$invalid) {
          this.isLoading = true;
          const response: any = await axios.post('/user/inviteduser/register', this.user);
          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            setTimeout(() => {
              this.$router.push('/');
            }, 3000);
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    async activateUser() {
      try {
        this.v$.user.$touch();
        if (!this.v$.user.$invalid) {
          this.isLoading = true;
          const response: any = await axios.post('/user/activate', this.user);
          if (response.status == HttpStatusCode.Ok) {
            this.showActivationForm = false;
            this.toast.success(response.message);
            setTimeout(() => {
              this.$router.push('/');
            }, 3000);
          }
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
  <main class="login-container mt-3">
    <img src="@/assets/img/logo.png" alt="">
    <div v-loading="isLoading" class="login-section h-100 w-100">
      <!-- <template v-if="!showActivationForm && !isActiveUser">
                <div class="">
                    <h6 class="text-center">Please wait...</h6>
                </div>
            </template> -->
      <!-- <template v-else-if="showActivationForm && !isActiveUser"> -->
      <h4 class="text-center">User Registration</h4>
      <form class="p-3">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="user_name">Name</label>
              <input type="text" class="form-control" v-model="user.user_name" id="user_name"
                :class="{ 'is-invalid': v$.user.user_name.$error }" placeholder="Enter Name">
              <div class="invalid-feedback" v-for="error of v$.user.user_name.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="email_id">Email ID</label>
              <input type="email" class="form-control" v-model="email_id" disabled id="email_id"
                placeholder="Enter Email ID">
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tet" class="form-control" v-model="user.phone" id="phone" placeholder="Enter Phone Number">
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" v-model="user.password" class="form-control"
                :class="{ 'is-invalid': v$.user.password.$error }" id="password">
              <div class="invalid-feedback" v-for="error of v$.user.password.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input type="password" v-model="user.confirm_password" class="form-control"
                :class="{ 'is-invalid': v$.user.confirm_password.$error }" id="confirmPassword">
              <div class="invalid-feedback" v-for="error of v$.user.confirm_password.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-3">
          <button class="btn btn-primary" type="submit" @click.prevent="registerInvitedUser">
            Save
          </button>
        </div>
      </form>
      <!-- </template> -->
      <!-- <template v-else-if="showActivationForm && isActiveUser">
                <div class="d-flex flex-column justify-content-center align-items-center align-self-center">
                    <p class="fs-6">User Already Activated</p>
                    <p class="fs-6">Please <router-link class="spl-link" :to="{ path: '/' }">Login</router-link> to continue
                    </p>
                </div>
            </template> -->
    </div>
  </main>
</template>
