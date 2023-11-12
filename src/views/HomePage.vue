<script lang="ts">
import { UserType } from '@/enums/UserType';
import axios from '@/plugins/axios.js'
import useVuelidate from '@vuelidate/core';
import { useToast } from 'vue-toastification';
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      error: false,
      errorMessage: "",

      loginData: {
        email_id: "",
        password: "",
      }
    }
  },
  mounted() {
    this.clearLoginDetails();
  },
  methods: {
    clearLoginDetails() {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userTypeId")
    },
    async loginUser() {
      try {
        const response = await axios.post('/login', this.loginData)

        localStorage.setItem("accessToken", response.accessToken)
        localStorage.setItem("userTypeId", response.userTypeId)

        if (response.userTypeId == UserType.SAD) {
          this.$router.push({ name: 'tenantmanagement' });
        }
        else {
          this.$router.push({ name: 'hrprofilemanagement' });
        }
      } catch (error: any) {
        this.toast.error(error);
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 5000)
        this.errorMessage = error;
      }
    },
  }
}
</script>

<template>
  <main class="login-container">
    <div class="login-section">
      <h4 class="text-center">Login</h4>
      <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <font-awesome-icon class="mx-2" :icon="['far', 'circle-xmark']" />
        <div>
          {{ errorMessage ? errorMessage : "An error occured" }}
        </div>
      </div>
      <form class="p-3">
        <div class="row gy-2">
          <div class="col-12">
            <div class="form-group">
              <label for="loginName">Email ID</label>
              <input type="text" v-model="loginData.email_id" class="form-control" id="loginName"
                placeholder="Login Email Id">
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" v-model="loginData.password" class="form-control" id="loginPassword"
                placeholder="Enter Password">
            </div>
          </div>
          <div class="col-12">
            <label class="form-check-label" for="defaultCheck1">
              <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
              Remember Me
            </label>
          </div>
        </div>
        <div class="text-center">
          <button class="btn primary-btn" type="submit" @click.prevent="loginUser()">
            Login
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
