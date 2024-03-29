<script lang="ts">
import axios from '@/plugins/axios';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required, sameAs } from '@vuelidate/validators';
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
      user: {
        user_id: null,
        password: null,
        active: null,
        confirm_password: null,
        email_id: null,
        activation_token: null,
      }
    }
  },
  validations() {
    return {
      user: {
        password: {
          required: helpers.withMessage('Password is required', required),
          minLength: helpers.withMessage(({ $params }) =>
            `Password must have a minimum length of ${$params.min} characters`, minLength(6)),
        },
        confirm_password: {
          required: helpers.withMessage('Confirm your password', required),
          sameAsPassword: helpers.withMessage('Passwords does not match', sameAs(this.user.password)),
        }
      }
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        this.isLoading = true;
        const response: any = await axios.get('/user/activationdetail/' + this.token)
        if (response.status == HttpStatusCode.NotFound) {
          this.toast.warning(response.message);
          this.$router.push('/');
        }
        this.user = response.user;
        if (this.user) {
          this.showActivationForm = this.user.active ? false : true;
          this.isActiveUser = this.user.active ?? false;
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
  <main class="login-container">
    <img src="@/assets/img/tm-name-logo.png" alt="">
    <div v-loading="isLoading" class="login-section h-100 w-100">
      <template v-if="!showActivationForm && !isActiveUser">
        <div class="">
          <h6 class="text-center">Please wait...</h6>
        </div>
      </template>
      <template v-else-if="showActivationForm && !isActiveUser">
        <h4 class="text-center">User Activation</h4>
        <form class="p-3">
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" v-model="user.password" class="form-control"
                  :class="{ 'is-invalid': v$.user.password.$error }" id="password" placeholder="Enter New Password">
                <div class="invalid-feedback" v-for="error of v$.user.password.$errors" :key="error.$uid">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" v-model="user.confirm_password" class="form-control"
                  :class="{ 'is-invalid': v$.user.confirm_password.$error }" id="confirmPassword"
                  placeholder="Enter Confirm Password">
                <div class="invalid-feedback" v-for="error of v$.user.confirm_password.$errors" :key="error.$uid">
                  {{ error.$message }}
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <button class="btn btn-primary" type="submit" @click.prevent="activateUser">
              Save
            </button>
          </div>
        </form>
      </template>
      <template v-else-if="showActivationForm && isActiveUser">
        <div class="d-flex flex-column justify-content-center align-items-center align-self-center">
          <p class="fs-6">User Already Activated</p>
          <p class="fs-6">Please <router-link class="spl-link" :to="{ path: '/' }">Login</router-link> to continue</p>
        </div>
      </template>
    </div>
  </main>
</template>
