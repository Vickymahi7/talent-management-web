<script setup lang="ts">
import axios from "@/plugins/axios";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { HttpStatusCode } from "axios";
import { Modal } from "bootstrap";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import ModalComponent from "./ModalComponent.vue";
const toast = useToast();

const forgotPasswordModal = ref(null as null | Modal);
const isLoading = ref(false);
const email_id = ref('');

const validations = computed(() => {
  return {
    email_id: { required, email }
  }
});

const v$ = useVuelidate(validations, { email_id });

const forgotPassword = async () => {
  try {
    v$.value.email_id.$touch();
    if (!v$.value.email_id.$invalid) {
      const data = {
        email_id: email_id.value,
      }
      isLoading.value = true;
      const response: any = await axios.post('/user/forgotpassword', data);

      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        // bsModalHide(modalId);  // close modal
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
  forgotPasswordModal.value?.show();
}

defineExpose({ showModal: _showModal });
</script>

<template>
  <ModalComponent v-loading="isLoading" title="Forgot Password ?" ref="forgotPasswordModal" @hide="email_id = '';v$.email_id.$reset();"
    hide-cancel centered no-close-on-backdrop no-close-on-esc>
    <template #body>
      <div class="container">
        <div class="row">
          <label for="email_id" class="col-sm-4 col-form-label">Email ID</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="email_id" :class="{ 'is-invalid': v$.email_id.$error }"
              id="email_id" placeholder="Enter Your Email ID">
            <div class="invalid-feedback" v-for="error of v$.email_id.$errors" :key="error.$uid">
              {{ error.$message }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="forgotPassword">Submit</button>
    </template>
  </ModalComponent>
</template>