<script lang="ts" setup>
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue';
import axios from '@/plugins/axios';
import { UserTypeId } from '@/utils/enums';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
const toast = useToast();
const router = useRouter();

const forgotPasswordModalRef = ref(null as InstanceType<typeof ForgotPasswordModal> | null);
const isLoading = ref(false);
const loginData = ref({
  email_id: "",
  password: "",
})

onMounted(() => {
  clearLoginDetails();
});

const clearLoginDetails = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("userId")
  localStorage.removeItem("userTypeId")
  localStorage.removeItem("userName")
  localStorage.removeItem("tenantLogo")
  localStorage.removeItem("isPrimaryUser")
}

const loginUser = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.post('/login', loginData.value)
    isLoading.value = false;

    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("userId", response.userId)
    localStorage.setItem("userTypeId", response.userTypeId)
    localStorage.setItem("isPrimaryUser", response.isPrimaryUser)
    localStorage.setItem("userName", response.userName)
    localStorage.setItem("tenantLogo", response.tenantLogo)

    if (response.userTypeId == UserTypeId.SAD) {
      router.push({ name: 'tenantmanagement' });
    }
    else if (response.userTypeId == UserTypeId.USR) {
      router.push({ name: 'userhrprofile' });
    }
    else {
      router.push({ name: 'hrprofilemanagement' });
    }
  } catch (error: any) {
    isLoading.value = false;
    toast.error(error.message);
  }
}

const showForgotPasswordModal = () => {
  forgotPasswordModalRef.value?.showModal();
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
            <div class="col-6">
              <label class="form-check-label" for="defaultCheck1">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                Remember Me
              </label>
            </div>
            <div class="col-6 text-end">
              <a href="#" @click="showForgotPasswordModal">Forgot Password ?</a>
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
  <ForgotPasswordModal ref="forgotPasswordModalRef" />
</template>
