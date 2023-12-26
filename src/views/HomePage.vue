<script lang="ts">
import axios from '@/plugins/axios';
import { UserTypeId } from '@/utils/enums';
import useVuelidate from '@vuelidate/core';
import { useToast } from 'vue-toastification';
export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      isLoading: false,
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
      localStorage.removeItem("userId")
      localStorage.removeItem("userTypeId")
      localStorage.removeItem("userName")
    },
    async loginUser() {
      try {
        this.isLoading = true;
        const response: any = await axios.post('/login', this.loginData)

        localStorage.setItem("accessToken", response.accessToken)
        localStorage.setItem("userId", response.userId)
        localStorage.setItem("userTypeId", response.userTypeId)
        localStorage.setItem("userName", response.userName)

        if (response.userTypeId == UserTypeId.SAD) {
          this.$router.push({ name: 'tenantmanagement' });
        }
        else if (response.userTypeId == UserTypeId.USR) {
          this.$router.push({ name: 'userhrprofile' });
        }
        else {
          this.$router.push({ name: 'hrprofilemanagement' });
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
    <img src="@/assets/img/logo.png" alt="">
    <div class="login-section">
      <h4 class="text-center">Login</h4>
      <form v-loading="isLoading" class="p-3">
        <div class="container">
          <div class="row">
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
            <button class="btn btn-primary" type="submit" @click.prevent="loginUser()">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
