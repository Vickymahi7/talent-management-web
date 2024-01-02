<script setup lang="ts">
import axios from "@/plugins/axios";
import type { Tenant } from "@/types/Tenant";
import { fileUploadBtnClick } from "@/utils/commonFunctions";
import { USER_TYPES } from "@/utils/constants";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { HttpStatusCode } from "axios";
import { Modal } from "bootstrap";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import ModalComponent from "./ModalComponent.vue";
const toast = useToast();
const tenentProfileModalref = ref(null as null | Modal);

const elements = ref({
  editMode: false,
});
const isLoading = ref(false);
const tenant = ref([] as Tenant);

const userType = computed(() => {
  let result = '';
  if (tenant.value.user?.user_type_id) {
    result = USER_TYPES.find(data => data.id == tenant.value.user?.user_type_id)?.userType ?? '';
  }
  return result;
});

const getImageUrlWithTimestamp = computed(() => {
  const imageUrl = tenant.value.logo_url;
  const timestamp = new Date().getTime();
  return `${imageUrl}?timestamp=${timestamp}`;
})

const validations = computed(() => {
  return {
    tenant: {
      name: {
        required: helpers.withMessage('Name is required', required),
      },
      // user_id: {
      //   required: helpers.withMessage('Please select a Primary User', required),
      // },
    }
  }
});
const v$ = useVuelidate(validations, { tenant });

const _showModal = () => {
  tenentProfileModalref.value?.show();

  getTenantDetail();
}

defineExpose({ showModal: _showModal });

const getTenantDetail = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/tenant/view/' + 0)
    tenant.value = response.tenant;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const updateTenant = async () => {
  try {
    const tenantData: Tenant = {}
    tenantData.tenant_id = tenant.value.tenant_id;
    tenantData.name = tenant.value.name;
    tenantData.location = tenant.value.location;
    v$.value.tenant.$touch();
    if (!v$.value.tenant.$invalid) {
      isLoading.value = true;
      const response: any = await axios.patch('/tenant/update', tenantData);
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        elements.value.editMode = false;
        getTenantDetail();
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

const uploadTenantLogo = async (event: any) => {
  const files = event.target.files
  try {
    if (files.length > 0 && tenant.value.tenant_id) {
      let formData = new FormData();

      formData.append('id', tenant.value.tenant_id!.toString());
      formData.append('file', files[0]);

      isLoading.value = true;
      const response: any = await axios.post('/tenant/logoupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getTenantDetail();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <ModalComponent v-loading="isLoading" title="Tenant Profile" ref="tenentProfileModalref" size="modal-lg" centered
    hide-footer>
    <template #body>
      <div class="container profile-setting mb-5">
        <div v-if="!elements.editMode" class="row mb-2 text-end">
          <div class="col">
            <a href="#" @click.prevent="elements.editMode = true">
              <font-awesome-icon icon="fa-solid fa-pencil-alt" class="me-1" />Edit Profile</a>
          </div>
        </div>
        <div class="row gy-2">
          <div class="col-12">
            <!-- <div class="card shadow-sm p-3"> -->
            <div class="py-2 d-inline-block position-relative">
              <img v-if="tenant.logo_url" class="d-block rounded" :src="getImageUrlWithTimestamp" alt="" height="70" />
              <img v-else class="d-block rounded" src="@/assets/img/logo.png" alt="" height="70">
              <span class="icon-btn upload-icon" @click="fileUploadBtnClick('upload-input')">
                <font-awesome-icon icon="fa-solid fa-camera" />
                <input type="file" id="upload-input" class="icon-upload-input" @input="uploadTenantLogo($event)"
                  placeholder="Choose Photo">
              </span>
            </div>
            <div class="card shadow-sm p-3 mt-2">
              <template v-if="!elements.editMode">
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">Tenant Name</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ tenant.name }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="location" class="label-text m-0">Location</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ tenant.location }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">Primary User</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ tenant.user?.user_name }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">User Type</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ userType }}</p>
                  </div>
                </div>
                <hr>
                <div class="row g-3 align-items-center">
                  <div class="col-sm-4">
                    <label for="firstName" class="label-text m-0">User Email</label>
                  </div>
                  <div class="col-sm-8">
                    <p>{{ tenant.user?.email_id }}</p>
                  </div>
                </div>
              </template>
              <form v-if="elements.editMode">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" v-model="tenant.name" class="form-control border-0"
                        :class="{ 'is-invalid': v$.tenant.name.$error }" id="profile_name" placeholder="">
                      <label for="profile_name">Name</label>
                      <div class="invalid-feedback" v-for="error of v$.tenant.name.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" v-model="tenant.location" class="form-control border-0" id="profile_location"
                        placeholder="">
                      <label for="profile_location">Location</label>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" :value="tenant.user?.user_name" disabled class="form-control border-0"
                        id="profile_userType" placeholder="">
                      <label for="profile_userType">Primary User</label>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" v-model="userType" disabled class="form-control border-0" id="profile_userType"
                        placeholder="">
                      <label for="profile_userType">User Type</label>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row g-3 align-items-center">
                  <div class="col-12">
                    <div class="form-floating">
                      <input type="text" :value="tenant.user?.email_id" disabled class="form-control border-0"
                        id="profile_userType" placeholder="">
                      <label for="profile_userType">User Email</label>
                    </div>
                  </div>
                </div>
                <hr class="m-0">
                <div class="row mt-3">
                  <div class="col-12 text-end">
                    <button class="btn btn-primary me-2" @click.prevent="updateTenant">Save</button>
                    <button class="btn btn-secondary" @click.prevent="elements.editMode = false">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </template>
    <!-- <template #footer>
      <button class="btn btn-primary">Save</button>
    </template> -->
  </ModalComponent>
</template>