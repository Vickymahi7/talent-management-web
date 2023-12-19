<script lang="ts" setup>
import axios from '@/plugins/axios';
import type HrProfile from '@/types/HrProfile';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { HttpStatusCode } from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
defineProps({
  id: { type: String, default: 'addHrProfileModal' },
  // hrProfile: { type: Object as PropType<HrProfile | undefined | null> },
});
const emit = defineEmits(['refreshParent']);

const validations = {
  hrProfile: {
    profile_title: { required },
    email_id: { required, email },
  }
}

const hrProfile = ref({} as HrProfile);

const v$ = useVuelidate(validations, { hrProfile });
const toast = useToast();

const isModalLoading = ref(false);

const addHrProfile = async () => {
  try {
    v$.value.hrProfile.$touch();
    if (!v$.value.hrProfile.$invalid) {
      isModalLoading.value = true;
      const response: any = await axios.post('/hrprofile/add', hrProfile.value);

      if (response.status == HttpStatusCode.Created) {
        toast.success(response.message);
        emit('refreshParent');
        // bsModalHide(modalId);  // close modal
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
}

const addSkills = (event: any) => {
  const skill = event.target.value as string;
  hrProfile.value.skills = hrProfile.value.skills ?? [];
  if (!hrProfile.value.skills.includes(skill)) {
    hrProfile.value.skills.push(skill);
    event.target.value = '';
  }
}

const removeSkill = (skill: string) => {
  hrProfile.value.skills = hrProfile.value.skills?.filter(item => item != skill);
}
</script>
<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="profile_title" class="col-sm-4 col-form-label">Profile Title</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.profile_title"
                    :class="{ 'is-invalid': v$.hrProfile.profile_title.$error }" id="profile_title"
                    placeholder="Enter Profile Title">
                  <div class="invalid-feedback" v-for="error of v$.hrProfile.profile_title.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="first_name" class="col-sm-4 col-form-label">First Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.first_name" id="first_name"
                    placeholder="Enter First Name">
                </div>
              </div>
              <div class="row">
                <label for="last_name" class="col-sm-4 col-form-label">Last Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.last_name" id="last_name"
                    placeholder="Enter Last Name">
                </div>
              </div>
              <div class="row">
                <label for="email_id" class="col-sm-4 col-form-label">Email Id</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="hrProfile.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.hrProfile.email_id.$error }" placeholder="Enter Email Id">
                  <div class="invalid-feedback" v-for="error of v$.hrProfile.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="mobile" class="col-sm-4 col-form-label">Contact Number</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.mobile" id="mobile"
                    placeholder="Enter Contact Number">
                </div>
              </div>
              <div class="row">
                <label for="work_experience" class="col-sm-4 col-form-label">Experience</label>
                <div class="col-sm-8">
                  <div class="input-group">
                    <input type="text" v-model="hrProfile.experience_year" class="form-control" placeholder="Enter Year"
                      aria-label="experience_year">
                    <span class="input-group-text">years</span>
                    <input type="text" v-model="hrProfile.experience_month" class="form-control" placeholder="Enter Month"
                      aria-label="experience_month">
                    <span class="input-group-text">months</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <label for="skills" class="col-sm-4 col-form-label">Skills</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" @keyup.enter.prevent="addSkills" id="skills"
                    placeholder="Enter Skills">
                  <div class="mt-2">
                    <span v-for="skill, index in hrProfile.skills" :key="index" class="badge badge-custom me-1">
                      <span class="pe-1">{{ skill }}</span>
                      <a href="#" class="d-inline-block " @click="removeSkill(skill)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <!-- <div class="row">
                                            <label for="resumeInput" class="col-sm-4 col-form-label">Resume Attachment</label>
                                            <div class="col-sm-6">
                                              <input type="file" class="form-control" id="resumeInput" placeholder="Add Resume Attachment">
                                            </div>
                                            <div class="col-sm-2">
                                              <button type="button" class="btn btn-primary">Upload</button>
                                            </div>
                                          </div> -->
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="addHrProfile" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>