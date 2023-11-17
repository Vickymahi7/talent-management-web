<script lang="ts">
import axios from '@/plugins/axios'
import useVuelidate from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators'
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
        password: { required, minLength: minLength(6), },
        confirm_password: {
          required,
          minLength: minLength(6),
          sameAsPassword: sameAs(this.user.password),
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
        this.user = response.user;
        console.log(this.user)
        if (this.user) {
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
    <div class="login-section h-100 w-100">
      <loading-overlay :showOverlay="isLoading">
        <template v-if="!showActivationForm && !isActiveUser">
          <div class="">
            <h6 class="text-center">Please wait...</h6>
          </div>
        </template>
        <template v-else-if="showActivationForm && !isActiveUser">
          <h4 class="text-center">User Activation</h4>
          <form class="p-3">
            <div class="row gy-2">
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
              <button class="btn primary-btn" type="submit" @click.prevent="activateUser">
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
      </loading-overlay>
    </div>
  </main>
</template>
