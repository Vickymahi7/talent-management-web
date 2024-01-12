<script lang="ts" setup>
import axios from '@/plugins/axios';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required, sameAs } from '@vuelidate/validators';
import { HttpStatusCode } from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
const props = defineProps({
  token: String,
});
const toast = useToast();
const router = useRouter();

const showActivationForm = ref(false);
const showInitilStatus = ref(true);

const isLoading = ref(false);
const user = ref({
  user_id: null,
  password: null,
  active: null,
  confirm_password: null,
  email_id: null,
  activation_token: null,
})

const validations = computed(() => {
  return {
    user: {
      password: {
        required: helpers.withMessage('Password is required', required),
        minLength: helpers.withMessage(({ $params }) =>
          `Password must have a minimum length of ${$params.min} characters`, minLength(6)),
      },
      confirm_password: {
        required: helpers.withMessage('Confirm your password', required),
        sameAsPassword: helpers.withMessage('Passwords does not match', sameAs(user.value.password)),
      }
    }
  }
})

const v$ = useVuelidate(validations, { user });

onMounted(() => {
  getUser();
});

const getUser = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/user/resetpassword/decode/' + props.token)
    user.value = response.user;
    if (user.value) {
      showActivationForm.value = user.value.email_id ? true : false;
      showInitilStatus.value = false;
    }
  } catch (error: any) {
    if (error.status == HttpStatusCode.NotFound) {
      router.push('/');
    }
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const activateUser = async () => {
  try {
    v$.value.user.$touch();
    if (!v$.value.user.$invalid) {
      isLoading.value = true;
      const response: any = await axios.post('/user/updatepassword', user.value);
      if (response.status == HttpStatusCode.Ok) {
        showActivationForm.value = false;
        toast.success(response.message);
        router.push('/');
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="login-container">
    <img src="@/assets/img/logo.png" alt="">
    <div v-loading="isLoading" class="login-section h-100 w-100">
      <template v-if="showInitilStatus">
        <div class="">
          <h6 class="text-center">Please wait...</h6>
        </div>
      </template>
      <template v-else-if="!showInitilStatus && showActivationForm">
        <h4 class="text-center">Reset Password</h4>
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
      <template v-else>
        <div class="d-flex flex-column justify-content-center align-items-center align-self-center">
          <p class="fs-6">Password Updated</p>
          <p class="fs-6">Please <router-link class="spl-link" :to="{ path: '/' }">Login</router-link> to continue</p>
        </div>
      </template>
    </div>
  </main>
</template>
