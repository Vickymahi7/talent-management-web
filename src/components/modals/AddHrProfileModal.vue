<script lang="ts" setup>
import axios from '@/plugins/axios';
import type HrProfile from '@/types/HrProfile';
import type { Skill } from '@/types/Skill';
import type { Tenant } from '@/types/Tenant';
import type { User } from '@/types/User';
import { useCommonFunctions } from '@/utils/useCommonFunctions';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { HttpStatusCode } from 'axios';
import type { Modal } from 'bootstrap';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
defineProps({
  id: { type: String, default: 'addHrProfileModal' },
});
const emit = defineEmits(['refreshParent']);

const commonFunctions = useCommonFunctions();

const addHrProfileModalRef = ref(null as null | Modal);

const validations = computed(() => {
  return {
    hrProfile: {
      profile_title: {
        required: helpers.withMessage('Profile Title is required', required),
      },
      email_id: {
        required: helpers.withMessage('Email ID is required', required),
        email: helpers.withMessage('Enter a valid Email ID', email),
      },
    }
  }
});
const tenant = ref({} as Tenant);
const hrProfile = ref({} as HrProfile);

const skillData = ref({} as Skill);
const v$ = useVuelidate(validations, { hrProfile });
const toast = useToast();

const isModalLoading = ref(false);
const isMyProfile = ref(false);

const showSkillExp = computed(() => {
  return tenant.value.is_skill_experience;
})

onMounted(() => {
  getTenantSettings();
})
// onBeforeUnmount(() => {
//   _hideModal();
// });
const _showModal = (_user?: User) => {
  if (_user) {
    console.log(_user)
    isMyProfile.value = true;
    hrProfile.value.first_name = _user.user_name;
    hrProfile.value.email_id = _user.email_id;
    hrProfile.value.mobile = _user.phone;
  }
  addHrProfileModalRef.value?.show();
}
const _hideModal = () => {
  addHrProfileModalRef.value?.hide();
}

defineExpose({ showModal: _showModal });

const getTenantSettings = async () => {
  try {
    isModalLoading.value = true;
    const response: any = await axios.get('/tenantsetting/view');
    tenant.value = response.tenant as Tenant;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
};

const addHrProfile = async () => {
  try {
    v$.value.hrProfile.$touch();
    if (!v$.value.hrProfile.$invalid) {
      isModalLoading.value = true;
      hrProfile.value.is_current_user = isMyProfile.value;

      const response: any = await axios.post('/hrprofile/add', hrProfile.value);

      if (response.status == HttpStatusCode.Created) {
        toast.success(response.message);
        emit('refreshParent');
        _hideModal();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
}

const addSkill = () => {
  if (skillData.value.skill) {
    const _skill: Skill = {
      skill: skillData.value.skill,
      experience_month: skillData.value.experience_month,
      experience_year: skillData.value.experience_year,
    };
    hrProfile.value.skills = hrProfile.value.skills ?? [];
    if (!hrProfile.value.skills.some((data) => data.skill?.toLocaleLowerCase() === _skill.skill?.toLocaleLowerCase())) {
      hrProfile.value.skills.push(_skill);

      skillData.value = {};
    }
  }
};

const editSkill = (_skill: Skill) => {
  skillData.value = _skill;
  hrProfile.value.skills = hrProfile.value.skills!.filter(item => item.skill != _skill.skill);
};

const removeSkill = (_skill: Skill) => {
  hrProfile.value.skills = hrProfile.value.skills?.filter(item => item.skill != _skill.skill);
}

const clearData = () => {
  hrProfile.value = {};
  skillData.value = {};
  v$.value.hrProfile.$reset();
}
</script>
<template>
  <ModalComponent :id="id" :is-modal-loading="isModalLoading" ref="addHrProfileModalRef" title="New Profile" @hide="clearData"
    hide-cancel centered no-close-on-backdrop no-close-on-esc>
    <template #body>
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
              <input type="email" class="form-control" v-model="hrProfile.email_id" :disabled="isMyProfile" id="email_id"
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
            <label for="skills" class="col-sm-4 col-form-label align-self-start">{{ showSkillExp ? 'Skill & Experience' :
              'Skills' }}</label>
            <div class="col-sm-8">
              <!-- <input type="text" class="form-control" @keyup.enter.prevent="addSkill" id="skills"
                placeholder="Enter Skills">
               -->
              <div class="row g-">
                <div class="col">
                  <input type="text" v-model.trim="skillData.skill" @keyup.enter.prevent="addSkill" class="form-control"
                    placeholder="Skill">
                </div>
                <div v-if="showSkillExp" class="col-7">
                  <div class="row mb-0">
                    <input type="number" min="0" v-model.trim="skillData.experience_year" @keyup.enter.prevent="addSkill"
                      class="form-control col" placeholder="Year" aria-label="experience_year">
                    <input type="number" min="0" v-model.trim="skillData.experience_month" @keyup.enter.prevent="addSkill"
                      class="form-control col" placeholder="Month" aria-label="experience_month">
                    <!-- <button class="btn btn-primary ms-1" @click.prevent="addSkill">Add</button> -->
                    <div class="col-3 align-self-center ps-1">
                      <span class="icon-btn" @click="addSkill" title="Add Skill">
                        <font-awesome-icon icon="fa-solid fa-plus" />
                      </span>
                    </div>
                  </div>
                </div>
                <!-- <div v-if="showSkillExp" class="col d-flex">
                  <div class="input-group">
                    <input type="number" min="0" v-model.trim="skillData.experience_year" class="form-control"
                      placeholder="Enter Year" aria-label="experience_year">
                    <span class="input-group-text">years</span>
                    <input type="number" min="0" v-model.trim="skillData.experience_month" class="form-control"
                      placeholder="Enter Month" aria-label="experience_month">
                    <span class="input-group-text">months</span>
                  </div>
                  <button class="btn btn-primary ms-1" @click.prevent="addSkill">Add</button>
                </div> -->
              </div>
              <div v-if="hrProfile.skills && hrProfile.skills.length > 0" class="mt-2 skill-section">
                <span v-for="_skill, index in hrProfile.skills" :key="index" class="badge badge-custom me-1"
                  @click="editSkill(_skill)" role="button">
                  <span class="pe-1">{{ _skill.skill }}
                    <span v-if="_skill.experience_year || _skill.experience_month">({{
                      commonFunctions.getExperienceString(_skill.experience_year,
                        _skill.experience_month) }})</span>
                  </span>
                  <a href="#" class="d-inline-block " @click="removeSkill(_skill)">
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
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="addHrProfile">Save</button>
    </template>
  </ModalComponent>
</template>