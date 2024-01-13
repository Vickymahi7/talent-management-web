<script lang="ts" setup>
import AddHrProfileModal from "@/components/modals/AddHrProfileModal.vue";
import ResumePreviewModal from '@/components/modals/ResumePreviewModal.vue';
import axios from '@/plugins/axios';
import type { Docs } from '@/types/Docs';
import type { Education } from '@/types/Education';
import type HrProfile from '@/types/HrProfile';
import type { HrProfileChilderen } from '@/types/HrProfile';
import type { Project } from '@/types/Project';
import type { Skill } from "@/types/Skill";
import type { Tenant } from "@/types/Tenant";
import type { WorkExperience } from '@/types/WorkExperience';
import { PROFILE_STATUS } from '@/utils/constants';
import { formatDate, formatDateTime } from '@/utils/dateFormats';
import { UserTypeId } from '@/utils/enums';
import { useCommonFunctions } from '@/utils/useCommonFunctions';
import Editor from '@tinymce/tinymce-vue';
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { HttpStatusCode } from 'axios';
import { Modal } from 'bootstrap';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import { useToast } from 'vue-toastification';
const props = defineProps({
  id: String
});
const toast = useToast();
const commonFunctions = useCommonFunctions();
const route = useRoute();

const editorInitObject = {
  selector: 'textarea',
  menubar: false,
  statusbar: false,
  skin: (document.documentElement.dataset.bsTheme === "dark" ? 'oxide-dark' : 'oxide'),
  content_css: (document.documentElement.dataset.bsTheme === "dark" ? 'dark' : 'default'),
  height: 220,
  paste_as_text: true,
  plugins: 'paste, lists',
  toolbar: 'bold italic | bullist numlist',
  setup: (editor) => {
    editor.on('init', () => {
      if (!editor.getContent()) {
        editor.setContent('<ul><li></li></ul>');
      }
    });
  },
};

const elements = ref({
  titleEdit: false,
  nameEdit: false,
  primaryInfoEdit: false,
  personalInfoEdit: false,
  aboutInfoEdit: false,
  skillEdit: false,
  noteEdit: false,
  summaryEdit: false,
  tabItemEdit: false,
  modalEdit: false,
});

const profileTitleRef = ref<HTMLInputElement | null>(null);
const addHrProfileModalRef = ref(null as InstanceType<typeof AddHrProfileModal> | null);

const isLoading = ref(false);
const isModalLoading = ref(false);
const isUserHrProfile = ref(false);

const resumeFiles = ref('');
const docFiles = ref('');
const docId = ref('');
const modalId = ref('');
const deleteChildTitle = ref('');
const profileCount = ref(0);

const hrProfileList = ref([] as HrProfile[]);

const hrProfile = ref({} as HrProfile);
const tenant = ref({} as Tenant);

const skillData = ref({} as Skill);

const workExperienceData = ref({} as WorkExperience);

const educationData = ref({} as Education);

const projectData = ref({} as Project);

const docsData = ref({
  id: '',
  title: '',
  path: '',
} as Docs);
const docsEditData = ref({
  id: '',
  title: '',
  path: '',
} as Docs);

const dialogParam = ref({
  id: null as string | number | null,
  key: null as string | number | null,
  data: null as string | number | null,
  path: null as string | number | null,
});

const validations = computed(() => {
  return {
    hrProfile: {
      email_id: {
        required: helpers.withMessage('Email ID is required', required),
        email: helpers.withMessage('Enter a valid Email ID', email),
      },
    }
  }
});

const v$ = useVuelidate(validations, { hrProfile });

const isEmptyProfile = computed(() => {
  return !(profileCount.value > 0) && !props.id;
})

const officialEmailId = computed(() => {
  let _emailId = hrProfile.value.email_id;
  if (tenant.value.is_official_contact_info) {
    _emailId = tenant.value.tenant_email_id;
  }
  return _emailId;
})

const officialPhone = computed(() => {
  let _phone = hrProfile.value.mobile;
  if (tenant.value.is_official_contact_info) {
    _phone = tenant.value.tenant_phone;
  }
  return _phone;
})

const showSkillExp = computed(() => {
  return tenant.value.is_skill_experience;
})

const userTypeId = computed(() => {
  const typeId = localStorage.getItem("userTypeId");
  return typeId ? parseInt(typeId) : null;
})

const getImageUrlWithTimestamp = computed(() => {
  const imageUrl = hrProfile.value.photo_url;
  const timestamp = new Date().getTime();
  return `${imageUrl}?timestamp=${timestamp}`;
})

onMounted(() => {
  getPageData();
  getTenantSettings();
})

const getPageData = async () => {
  if (route.name === 'userhrprofile') {
    console.log(route.name)
    isUserHrProfile.value = true;
    getHrProfileList();
  }
  else {
    getHrProfileDetail();
  }
};

const getHrProfileDetail = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/hrprofile/view/' + props.id);
    hrProfile.value = response.hrProfile as HrProfile;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const getTenantSettings = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/tenantsetting/view');
    tenant.value = response.tenant as Tenant;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const getHrProfileList = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/hrprofile/list');
    hrProfileList.value = response.hrProfileList as HrProfile[];
    profileCount.value = response.total;
    if (profileCount.value == 0) {
      // showAddProfileModal();
      hrProfile.value = {};
    } else {
      hrProfile.value = hrProfileList.value[0];
    }
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
const updateHrProfile = async (data: any) => {
  data.id = hrProfile.value.id;

  try {
    v$.value.hrProfile.$touch();
    if (!v$.value.hrProfile.$invalid) {
      if (elements.value.modalEdit) isModalLoading.value = true;
      else isLoading.value = true;
      const response: any = await axios.patch('/hrprofile/update', data);

      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getPageData();
        elements.value.titleEdit = false;
        elements.value.nameEdit = false;
        elements.value.primaryInfoEdit = false;
        elements.value.personalInfoEdit = false;
        elements.value.aboutInfoEdit = false;
        elements.value.skillEdit = false;
        elements.value.noteEdit = false;
        elements.value.summaryEdit = false;
        elements.value.tabItemEdit = false;
        elements.value.modalEdit = false;
        clearDocData();
        clearWorkExperienceData();
        clearEducationData();
        clearProjectData();
        // workExperienceData.value = {} as WorkExperience;
        // educationData.value = {} as Education;
        // projectData.value = {} as Project;
        hideModal(modalId.value);
        console.log('end')
      }
    }
  } catch (error: any) {
    console.log(error)
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
    isModalLoading.value = false;
  }
};
const onYesDuplicateProfile = async () => {
  let existingProfileTitle = hrProfile.value.profile_title;
  try {
    hrProfile.value.profile_title = commonFunctions.duplicateProfileTitle(hrProfile.value.profile_title);

    isModalLoading.value = true;
    const response: any = await axios.post('/hrprofile/add', hrProfile.value);

    if (response.status == HttpStatusCode.Created) {
      toast.success(response.message);
      getHrProfileList();
    }
  } catch (error: any) {
    toast.error(error.message);
    hrProfile.value.profile_title = existingProfileTitle;
  }
  finally {
    isModalLoading.value = false;
  }
}
const uploadProfilePhoto = async (event: any) => {
  const files = event.target.files
  try {
    if (files.length > 0) {
      let formData = new FormData();


      formData.append('id', hrProfile.value.id!);
      formData.append('file', files[0]);

      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/photoupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getPageData();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const uploadResume = async (event: any) => {
  resumeFiles.value = event.target.files;
  try {
    if (resumeFiles.value.length > 0) {
      let formData = new FormData();
      formData.append('id', hrProfile.value.id!);
      formData.append('file', resumeFiles.value[0]);
      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/resumeupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getPageData();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const addDocumentFile = (event: any) => {
  docFiles.value = event.target.files;
};
const uploadDocument = async () => {
  try {
    if (docFiles.value.length > 0) {
      let formData = new FormData();
      formData.append('id', hrProfile.value.id!);
      formData.append('title', docsData.value.title);
      formData.append('file', docFiles.value[0]);
      const docList = hrProfile.value.docs?.length ? JSON.stringify(hrProfile.value.docs) : '';
      formData.append('docs', docList);
      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/docupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getPageData();
        clearDocData();
      }
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const editDoc = (document: Docs) => {
  elements.value.tabItemEdit = true;
  docId.value = document.id;
  docsEditData.value = document;
};
const clearWorkExperienceData = () => {
  elements.value.tabItemEdit = false;
  workExperienceData.value.company = '';
  workExperienceData.value.position = '';
  workExperienceData.value.location = '';
  workExperienceData.value.start_date = null;
  workExperienceData.value.end_date = null;
  workExperienceData.value.description = '';
};
const clearEducationData = () => {
  elements.value.tabItemEdit = false;
  educationData.value.degree = '';
  educationData.value.major = '';
  educationData.value.university = '';
  educationData.value.location = '';
  educationData.value.start_date = null;
  educationData.value.end_date = null;
};
const clearProjectData = () => {
  elements.value.tabItemEdit = false;
  projectData.value.title = '';
  projectData.value.start_date = null;
  projectData.value.end_date = null;
  projectData.value.client = '';
  projectData.value.technology = '';
  projectData.value.description = '';
  projectData.value.location = '';
};
const clearDocData = () => {
  docId.value = '';
  elements.value.tabItemEdit = false;
  docsData.value.id = '';
  docsData.value.title = '';
  docsData.value.path = '';
};
const updateTitleInfo = () => {
  const data = {
    profile_title: hrProfile.value.profile_title,
    position: hrProfile.value.position,
    first_name: hrProfile.value.first_name,
    last_name: hrProfile.value.last_name,
  }

  updateHrProfile(data);
};
const updatePrimaryInfo = () => {
  const data = {
    location: hrProfile.value.location,
    ctc: hrProfile.value.ctc,
    experience_month: hrProfile.value.experience_month,
    experience_year: hrProfile.value.experience_year,
    status_id: hrProfile.value.status_id,
    status: commonFunctions.getProfileStatusById(hrProfile.value.status_id),
    email_id: hrProfile.value.email_id,
    mobile: hrProfile.value.mobile,
    linkedin_id: hrProfile.value.linkedin_id,
  }

  updateHrProfile(data);
};
const updatePersonalInfo = () => {
  const data = {

    email_id: hrProfile.value.email_id,
    mobile: hrProfile.value.mobile,
    gender: hrProfile.value.gender,
    date_of_birth: hrProfile.value.date_of_birth,
    location: hrProfile.value.location,
    buiding_number: hrProfile.value.buiding_number,
    street_name: hrProfile.value.street_name,
    city: hrProfile.value.city,
    state: hrProfile.value.state,
    country: hrProfile.value.country,
    postal_code: hrProfile.value.postal_code,
  }

  updateHrProfile(data);
};
const updateHrProfileItem = (key: string) => {
  const data = {};
  data[key] = hrProfile.value[key];

  updateHrProfile(data);
};
const updateProfileChildItems = (itemData: any, itemKey: string) => {
  let itemVal = null as any;
  const profileData = hrProfile.value as any;
  if (elements.value.tabItemEdit) {
    itemVal = profileData[itemKey];
  }
  else {
    itemVal = profileData[itemKey] ? [itemData].concat(profileData[itemKey]) : [itemData];
  }

  const data: any = {}
  data[itemKey] = itemVal;

  updateHrProfile(data);
};
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

      updateHrProfileItem('skills');
      skillData.value = {};
    }
  }
};

const editSkill = (_skill: Skill) => {
  skillData.value = _skill;
  hrProfile.value.skills = hrProfile.value.skills!.filter(item => item.skill != _skill.skill);
};

const removeSkill = (skill: Skill) => {
  hrProfile.value.skills = hrProfile.value.skills ? hrProfile.value.skills.filter(item => item.skill != skill.skill) : [];
  updateHrProfileItem('skills');
};

const showProfileChildItemEdit = (itemKey: string, itemData: HrProfileChilderen, modId: string) => {
  elements.value.tabItemEdit = true;
  elements.value.modalEdit = true;
  modalId.value = modId;
  if (itemKey === 'work_experience') {
    workExperienceData.value = itemData as WorkExperience;
  }
  else if (itemKey === 'education') {
    educationData.value = itemData as Education;
  }
  else if (itemKey === 'project') {
    projectData.value = itemData as Project;
  }
  showModal(modalId.value);
};

const showAddProfileModal = async () => {
  // if (props.id) {
  //   // emit('closeModal');
  //   const _modal = document.getElementById('hrProfileModal')!;
  //   const modal = Modal.getOrCreateInstance(_modal, {
  //     keyboard: false
  //   })
  //   modal.toggle();
  //   // modal.dispose();
  // }

  nextTick(() => {
    console.log(addHrProfileModalRef.value)
    addHrProfileModalRef.value?.showModal();
  })
}

const showModal = (modId: string) => {
  const modalEl = document.getElementById(modId);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.show();
};
const hideModal = (modId: string) => {
  const modalEl = document.getElementById(modId);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.hide();
};
const deleteHrProfile = (id: string) => {
  dialogParam.value.id = id;
};
const onYesProfile = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/hrprofile/delete/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getPageData();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const removeProfileChildItem = (key: string, data: any) => {
  dialogParam.value.key = key;
  dialogParam.value.data = data;

  if (key == 'work_experience') {
    deleteChildTitle.value = 'Work Experience';
  }
  else if (key == 'education') {
    deleteChildTitle.value = 'Education';
  }
  else if (key == 'project') {
    deleteChildTitle.value = 'Project';
  }
}

const onYesProfileChildItemDelete = () => {
  const key = dialogParam.value.key!;
  const data = dialogParam.value.data;
  // remove the object with its reference
  const profileData: any = hrProfile.value;
  profileData[key] = profileData[key] ? profileData[key].filter((item: any) => item !== data) : [];

  updateHrProfile(profileData);
}

const deleteHrProfileResume = (id: string) => {
  dialogParam.value.id = id;
}

const onYesHrProfileResume = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/hrprofile/deleteresume/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getPageData();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const deleteHrProfileDoc = (id: string, data: any) => {
  dialogParam.value = data;
};
const onYesHrProfileDoc = async () => {
  hrProfile.value.docs = hrProfile.value.docs ? hrProfile.value.docs.filter((item: any) => item !== dialogParam.value) : [];
  const data: any = {
    id: hrProfile.value.id,
    docs: hrProfile.value.docs,
    doc_id: dialogParam.value.id,
    path: dialogParam.value.path,
  }
  try {
    isLoading.value = true;
    const response: any = await axios.patch('/hrprofile/deletedoc', data);

    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getPageData();
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};

const showProfileTitleEdit = () => {
  elements.value.titleEdit = true;
  nextTick(() => {
    profileTitleRef.value?.focus();
  })
}
</script>
<template>
  <div v-if="!isUserHrProfile" class="mt-5"></div>
  <div v-if="!isEmptyProfile" class="d-flex card-gap-mb">
    <div v-show="elements.titleEdit" class="content-card content-header justify-content-start">
      <input type="text" ref="profileTitleRef" class="form-control py-1 d-inline-block w-25"
        v-model="hrProfile.profile_title" placeholder="Profile Title">
      <div class="d-inline-flex">
        <span class="icon-btn mx-1" @click="updateTitleInfo">
          <font-awesome-icon icon="fa-solid fa-check" />
        </span>
        <span class="icon-btn" @click="elements.titleEdit = false">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </span>
      </div>
    </div>
    <div v-if="!elements.titleEdit" class="content-card content-header">
      <span>
        <label class="d-inline-block me-2">Profile - {{ hrProfile.profile_title }} </label>
        <font-awesome-icon icon="fa-solid fa-pencil-alt" @click="showProfileTitleEdit" />
      </span>
      <div v-if="isUserHrProfile" class="d-flex">
        <div v-if="profileCount > 1" class="dropdown">
          <span class="badge bg-primary hide-caret dropdown-toggle me-3" role="button" id="dropdownMenuProfileSwitch"
            data-bs-toggle="dropdown" aria-expanded="false">
            Switch Profiles
          </span>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuProfileSwitch">
            <li v-for="profileItem in hrProfileList" :key="profileItem.id">
              <a class="dropdown-item" href="#" @click="hrProfile = profileItem">
                {{ profileItem.profile_title }}
              </a>
            </li>
          </ul>
        </div>
        <div class="dropdown">
          <a class="me-3" href="#" title="Duplicate Profile" data-bs-toggle="modal"
            data-bs-target="#duplicateProfileConfirmation">
            <font-awesome-icon icon="fa-regular fa-copy" />
          </a>
          <a class="" href="#" @click="deleteHrProfile(hrProfile.id!)" data-bs-toggle="modal"
            data-bs-target="#deleteHrProfile" title="Delete Profile">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </a>
        </div>
      </div>
    </div>
    <button v-if="isUserHrProfile" class="btn btn-primary ms-2" type="button" @click="showAddProfileModal();">
      <font-awesome-icon icon="fa-solid fa-plus-circle" class="me-2" />
      Add New Profile
    </button>
    <button class="btn btn-primary ms-2" type="button" data-bs-toggle="modal" data-bs-target="#resumePreviewModal">
      <font-awesome-icon class="me-2" icon="fa-solid fa-download" />
      Resume Preview
    </button>
    <button v-if="!isUserHrProfile" class="btn btn-secondary ms-2" type="button" @click="$router.back()">
      <font-awesome-icon icon="fa-solid fa-times" class="me-2" />
      Close
    </button>
  </div>
  <div v-loading="isLoading" class="content-body profile-section">
    <template v-if="isEmptyProfile">
      <div class="card h-100 d-flex justify-content-center align-items-center">
        <div class="mb-3">
          No Profile Found
        </div>
        <button class="btn btn-primary ms-2" type="button" @click="showAddProfileModal">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          Add New Profile
        </button>
      </div>
    </template>
    <template v-else>
      <div class="profile-head">
        <div class="profile-media content-card">
          <div class="align-self-end">
            <span v-if="elements.nameEdit">
              <span class="icon-btn float-end" @click="elements.nameEdit = false">
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </span>
              <span class="icon-btn float-end me-1" @click="updateTitleInfo">
                <font-awesome-icon icon="fa-solid fa-check" />
              </span>
            </span>
            <span v-else class="icon-btn float-end" @click="elements.nameEdit = true">
              <font-awesome-icon icon="fa-solid fa-pencil-alt" />
            </span>
          </div>
          <div class="profile-picture-wrapper">
            <img v-if="hrProfile.photo_url" class="profile-picture" :src="getImageUrlWithTimestamp" alt="Profile Picture"
              width="150" height="150" />
            <img v-else class="profile-picture" src="@/assets/img/user-icon.jpg" alt="Profile Picture" width="150"
              height="150" />
            <span class="icon-btn upload-icon" @click="commonFunctions.fileUploadBtnClick('profileUploadInput')">
              <font-awesome-icon icon="fa-solid fa-camera" />
              <input type="file" id="profileUploadInput" class="icon-upload-input" @input="uploadProfilePhoto($event)"
                placeholder="Choose Photo">
            </span>
          </div>
          <div class="title-block">
            <div v-if="elements.nameEdit">
              <input type="text" class="form-control form-control-sm d-inline-block w-50" v-model="hrProfile.first_name"
                placeholder="First Name">
              <input type="text" class="form-control form-control-sm d-inline-block w-50" v-model="hrProfile.last_name"
                placeholder="Last Name">
            </div>
            <p v-else class="title-text">{{ hrProfile.first_name }} {{ hrProfile.last_name }}</p>
            <input v-if="elements.nameEdit" type="text" class="form-control form-control-sm" v-model="hrProfile.position"
              placeholder="Position">
            <p v-else>{{ hrProfile.position }}</p>
          </div>
        </div>
        <div class="profile-prime-info content-card">
          <div class="d-flex flex-column">
            <h6 class="label-text mb-2 w-100">Primary Info
              <span v-if="elements.primaryInfoEdit">
                <span class="icon-btn float-end" @click="elements.primaryInfoEdit = false">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </span>
                <span class="icon-btn float-end me-1" @click="updatePrimaryInfo">
                  <font-awesome-icon icon="fa-solid fa-check" />
                </span>
              </span>
              <span v-else class="icon-btn float-end" @click="elements.primaryInfoEdit = true">
                <font-awesome-icon icon="fa-solid fa-pencil-alt" />
              </span>
            </h6>
            <div class="primary-info">
              <div class="profile-container">
                <div class="profile-item-container">
                  <p class="label-text">Years of Experience</p>
                  <div v-if="elements.primaryInfoEdit" class="input-group input-group-sm">
                    <input type="text" v-model="hrProfile.experience_year" class="form-control form-control-sm"
                      placeholder="Enter Year" aria-label="experience_year">
                    <span class="input-group-text">years</span>
                    <input type="text" v-model="hrProfile.experience_month" class="form-control form-control-sm"
                      placeholder="Enter Month" aria-label="experience_month">
                    <span class="input-group-text">months</span>
                  </div>
                  <p v-else>
                    <span v-if="hrProfile.experience_year">{{ hrProfile.experience_year }} years </span>
                    <span v-if="hrProfile.experience_month">{{ hrProfile.experience_month }} months</span>
                  </p>
                </div>
                <div class="profile-item-container">
                  <p class="label-text">CTC</p>
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.ctc">
                  <p v-else>{{ hrProfile.ctc }}</p>
                </div>
                <div class="profile-item-container">
                  <p class="label-text">Preferred Location</p>
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.location">
                  <p v-else>{{ hrProfile.location }}</p>
                </div>
                <div class="profile-item-container">
                  <span>
                    <span class="icon-btn me-2" title="LinkedIn">
                      <font-awesome-icon icon="fa-brands fa-linkedin" />
                    </span>
                  </span>
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.linkedin_id">
                  <p v-else>
                    {{ hrProfile.linkedin_id }}
                  </p>
                </div>
                <!-- <div class="separator my-3"></div> -->
                <div class="d-flex justify-content-between align-items-center">
                  <p class="label-text">
                    <span class="icon-btn me-2" title="Resume Attachment">
                      <font-awesome-icon icon="fa-solid fa-paperclip" />
                    </span>
                    <span v-if="hrProfile.resume_url">{{ hrProfile.first_name }} - Resume</span>
                    <span v-else class="text-muted">-- no resume --</span>
                  </p>
                  <div class="text-end" :class="{ 'invisible': elements.primaryInfoEdit }">
                    <template v-if="hrProfile.resume_url">
                      <a :href="hrProfile.resume_url" target="_blank" class="btn btn-primary ms-2 br-0" type="button">
                        Show
                      </a>
                      <a href="#" class="btn btn-primary ms-2 br-0" type="button"
                        @click.prevent="deleteHrProfileResume(hrProfile.id!)" data-bs-toggle="modal"
                        data-bs-target="#deleteHrProfileResume">
                        Remove
                      </a>
                    </template>
                    <button v-else @click="commonFunctions.fileUploadBtnClick('resume-input')"
                      class="btn btn-primary br-0" type="button">
                      Upload
                      <input type="file" id="resume-input" class="icon-upload-input" @input="uploadResume"
                        placeholder="Choose File">
                    </button>
                  </div>
                </div>
              </div>
              <div class="profile-container">
                <div class="profile-item-container">
                  <p class="label-text">Profile Status</p>
                  <select v-if="elements.primaryInfoEdit && userTypeId != UserTypeId.USR"
                    class="form-select form-control-sm" v-model="hrProfile.status_id" aria-label="Profile Status">
                    <option value="">Select</option>
                    <option v-for="status in PROFILE_STATUS" :key="status.id" :value="status.id">{{ status.status }}
                    </option>
                  </select>
                  <p v-else>{{ commonFunctions.getProfileStatusById(hrProfile.status_id) }}</p>
                </div>
                <div class="profile-item-container">
                  <p class="label-text">Last Updated</p>
                  <p>{{ formatDateTime(hrProfile.last_updated_dt) }}</p>
                </div>
                <h6 class="label-text my-2 w-100">{{ tenant.is_official_contact_info ? 'Official ' : '' }}Contact Info
                </h6>
                <div class="profile-item-container">
                  <span>
                    <span class="icon-btn me-2">
                      <font-awesome-icon icon="fa-solid fa-envelope" />
                    </span>
                  </span>
                  <p>{{ officialEmailId }}</p>
                </div>
                <div class="profile-item-container">
                  <span>
                    <span class="icon-btn me-2">
                      <font-awesome-icon icon="fa-solid fa-phone" />
                    </span>
                  </span>
                  <p>{{ officialPhone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-body">
        <div class="profile-description">
          <div class="content-card h-100 card-gap-mb">
            <h6 class="label-text mb-2">About
              <span v-if="elements.aboutInfoEdit">
                <span class="icon-btn float-end" @click="elements.aboutInfoEdit = false">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </span>
                <span class="icon-btn float-end me-1" @click="updateHrProfileItem('objective')">
                  <font-awesome-icon icon="fa-solid fa-check" />
                </span>
              </span>
              <span v-else class="icon-btn float-end" @click="elements.aboutInfoEdit = true">
                <font-awesome-icon icon="fa-solid fa-pencil-alt" />
              </span>
            </h6>
            <div v-if="elements.aboutInfoEdit" class="note-input-group">
              <textarea v-model="hrProfile.objective" name="" id="" class="form-control" rows="2"></textarea>
            </div>
            <p v-else class="profile-short-content">
              {{ hrProfile.objective }}
            </p>
          </div>
          <div class="content-card  h-100 card-gap-mb">
            <h6 class="label-text">Skills
              <span v-if="elements.skillEdit" class="float-end">
                <span class="icon-btn me-1" @click="addSkill">
                  <font-awesome-icon icon="fa-solid fa-check" />
                </span>
                <span class="icon-btn" @click="getPageData(); elements.skillEdit = false;">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </span>
              </span>
              <span v-else class="float-end">
                <span class="icon-btn" @click="elements.skillEdit = true; skillData = {}">
                  <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                </span>
              </span>
            </h6>
            <div v-if="elements.skillEdit" class="row gx-1 gy-1 mt-2 mb-1">
              <div class="col">
                <input type="text" v-model.trim="skillData.skill" @keyup.enter.prevent="addSkill"
                  class="form-control form-control-sm" placeholder="Skill">
              </div>
              <div v-if="showSkillExp" class="col-8 d-flex">
                <input type="number" min="0" v-model.trim="skillData.experience_year" @keyup.enter.prevent="addSkill"
                  class="form-control form-control-sm" placeholder="Year" aria-label="experience_year">
                <input type="number" min="0" v-model.trim="skillData.experience_month" @keyup.enter.prevent="addSkill"
                  class="form-control form-control-sm" placeholder="Month" aria-label="experience_month">
              </div>
            </div>
            <p class="profile-short-content">
              <template v-if="elements.skillEdit">
                <span v-for="_skill, index in hrProfile.skills" :key="index" class="badge badge-custom me-1"
                  @click="editSkill(_skill)" role="button">
                  <span class="pe-1">{{ _skill.skill }}
                    <span v-if="showSkillExp && (_skill.experience_year || _skill.experience_month)">({{
                      commonFunctions.getExperienceString(_skill.experience_year,
                        _skill.experience_month) }})</span>
                  </span>
                  <a href="#" class="d-inline-block " @click="removeSkill(_skill)">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </a>
                </span>
              </template>
              <template v-else>
                <span v-for="_skill, index in hrProfile.skills" :key="index" class="badge badge-custom me-1">
                  {{ _skill.skill }}
                  <span v-if="showSkillExp && (_skill.experience_year || _skill.experience_month)">({{
                    commonFunctions.getExperienceString(_skill.experience_year, _skill.experience_month) }})</span>
                </span>
              </template>
            </p>
          </div>
          <div class="content-card  h-100">
            <h6 class="label-text">Note
              <span v-if="elements.noteEdit" class="float-end">
                <span class="icon-btn me-1" @click="updateHrProfileItem('note')">
                  <font-awesome-icon icon="fa-solid fa-check" />
                </span>
                <span class="icon-btn" @click="elements.noteEdit = false">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </span>
              </span>
              <span v-else class="float-end">
                <span class="icon-btn" @click="elements.noteEdit = true">
                  <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                </span>
              </span>
            </h6>
            <div v-if="elements.noteEdit" class="note-input-group">
              <textarea name="" id="" v-model="hrProfile.note" class="form-control" rows="2"></textarea>
              <!-- <button class="btn btn-primary d-block" type="button">
                        Add Note
                      </button> -->
            </div>
            <p v-else class="profile-short-content">
              {{ hrProfile.note }}
            </p>
          </div>
        </div>
        <div class="profile-details content-card">
          <nav class="mt-2">
            <div class="nav nav-tabs nav-fill w-100" id="nav-tab" role="tablist">
              <button class="nav-link card-gap-me tab-btn active" id="nav-summary-tab" data-bs-toggle="tab"
                data-bs-target="#nav-summary" type="button" role="tab" aria-controls="nav-summary"
                aria-selected="true">Summary</button>
              <button class="nav-link card-gap-me tab-btn" id="nav-experience-tab" data-bs-toggle="tab"
                data-bs-target="#nav-experience" type="button" role="tab" aria-controls="nav-experience"
                aria-selected="false">Work Experience</button>
              <button class="nav-link card-gap-me tab-btn" id="nav-education-tab" data-bs-toggle="tab"
                data-bs-target="#nav-education" type="button" role="tab" aria-controls="nav-education"
                aria-selected="false">Education</button>
              <button class="nav-link card-gap-me tab-btn" id="nav-project-tab" data-bs-toggle="tab"
                data-bs-target="#nav-project" type="button" role="tab" aria-controls="nav-project"
                aria-selected="false">Projects</button>
              <button class="nav-link card-gap-me tab-btn" id="nav-personal-tab" data-bs-toggle="tab"
                data-bs-target="#nav-personal" type="button" role="tab" aria-controls="nav-personal"
                aria-selected="false">Personal</button>
              <button class="nav-link tab-btn" id="nav-doc-tab" data-bs-toggle="tab" data-bs-target="#nav-doc"
                type="button" role="tab" aria-controls="nav-doc" aria-selected="false">Docs</button>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-summary" role="tabpanel" aria-labelledby="nav-summary-tab">
              <div class="content-list">
                <div class="d-block text-end mb-2">
                  <span v-if="elements.summaryEdit">
                    <span class="icon-btn me-1" @click="updateHrProfileItem('summary')">
                      <font-awesome-icon icon="fa-solid fa-check" />
                    </span>
                    <span class="icon-btn" @click="elements.summaryEdit = false">
                      <font-awesome-icon icon="fa-solid fa-xmark" />
                    </span>
                  </span>
                  <span v-else class="icon-btn" @click="elements.summaryEdit = true">
                    <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                  </span>
                </div>
                <div class="summary-content">
                  <!-- <textarea v-if="elements.summaryEdit" v-model="hrProfile.summary" name="" id=""
                    class="form-control h-100"></textarea> -->
                  <div v-show="elements.summaryEdit">
                    <editor v-model="hrProfile.summary" api-key="cef8afeordxmk3br8qxqww6h6sxtwvvu4hnmxsmc55740o0d"
                      :init="editorInitObject" />
                  </div>
                  <p v-if="!elements.summaryEdit" class="" v-html="hrProfile.summary"></p>
                  <!-- <p v-else class="" v-html="hrProfile.summary"></p> -->
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="nav-experience" role="tabpanel" aria-labelledby="nav-experience-tab">
              <div class="content-list">
                <template v-if="hrProfile.work_experience && hrProfile.work_experience.length > 0">
                  <div v-for="workExperience, index in   hrProfile.work_experience" :key="index" class="list-item">
                    <div class="flex-fill">
                      <p class="label-text">{{ workExperience.company }}</p>
                      <p v-if="workExperience.position">{{ workExperience.position }}</p>
                      <p v-if="workExperience.start_date || workExperience.end_date || workExperience.location">
                        {{ formatDate(workExperience.start_date) }}
                        <span v-if="workExperience.start_date && workExperience.end_date"> - </span>
                        {{ formatDate(workExperience.end_date) }}
                        <span v-if="(workExperience.start_date || workExperience.end_date) && workExperience.location"> |
                        </span>
                        {{ workExperience.location }}
                      </p>
                      <div class="collapse" :id="`collapse-workExp-${index}`">
                        <!-- <div class="card card-body"> -->
                        <p class="label-text">Responsibilities</p>
                        <span v-html="workExperience.description"></span>
                        <!-- </div> -->
                      </div>
                      <p v-if="workExperience.description">
                        <a data-bs-toggle="collapse" :href="`#collapse-workExp-${index}`" role="button"
                          aria-expanded="false" aria-controls="collapse-workExp">
                          more...
                        </a>
                      </p>
                    </div>
                    <div class="text-nowrap text-end ms-2">
                      <span class="icon-btn me-2"
                        @click="showProfileChildItemEdit('work_experience', workExperience, 'workExperienceAddEditModal')">
                        <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                      </span>
                      <span class="icon-btn" @click="removeProfileChildItem('work_experience', workExperience)"
                        data-bs-toggle="modal" data-bs-target="#removeProfileChildItem">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                      </span>
                    </div>
                  </div>
                </template>
                <div v-else class="list-item">
                  <p>No record found</p>
                </div>
                <div class="py-3">
                  <button class="btn btn-primary br-0" type="button" data-bs-toggle="modal"
                    data-bs-target="#workExperienceAddEditModal"
                    @click="modalId = 'workExperienceAddEditModal'; elements.modalEdit = true;">
                    Add Work Experience
                  </button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="nav-education" role="tabpanel" aria-labelledby="nav-education-tab">
              <div class="content-list">
                <template v-if="hrProfile.education && hrProfile.education.length > 0">
                  <div v-for="education, index in   hrProfile.education" :key="index" class="list-item">
                    <div>
                      <p v-if="education.degree || education.major" class="label-text">
                        <span v-if="education.degree">{{ education.degree }}</span>
                        <span v-if="education.degree && education.major"> - </span>
                        <span v-if="education.major">{{ education.major }}</span>
                      </p>
                      <p v-if="education.university">{{ education.university }}</p>
                      <p>
                        {{ formatDate(education.start_date) }}
                        <span v-if="education.start_date && education.end_date"> - </span>
                        <span v-if="education.end_date">{{ formatDate(education.end_date) }}</span>
                        <span v-if="(education.start_date || education.end_date) && education.location"> | </span>
                        <span v-if="education.location">{{ education.location }}</span>
                      </p>
                    </div>
                    <div class="text-end">
                      <span class="icon-btn me-2"
                        @click="showProfileChildItemEdit('education', education, 'educationAddEditModal')">
                        <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                      </span>
                      <span class="icon-btn" @click="removeProfileChildItem('education', education)">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                      </span>
                    </div>
                  </div>
                </template>
                <div v-else class="list-item">
                  <p>No record found</p>
                </div>
                <div class="py-3">
                  <button class="btn btn-primary br-0" type="button" data-bs-toggle="modal"
                    data-bs-target="#educationAddEditModal"
                    @click="modalId = 'educationAddEditModal'; elements.modalEdit = true">
                    Add Education
                  </button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="nav-project" role="tabpanel" aria-labelledby="nav-project-tab">
              <div class="content-list">
                <template v-if="hrProfile.project && hrProfile.project.length > 0">
                  <div v-for="project, index in   hrProfile.project" :key="index" class="list-item">
                    <div class="flex-fill">
                      <p class="label-text">{{ project.title }}</p>
                      <p v-if="project.client">Client: {{ project.client }}</p>
                      <p v-if="project.start_date || project.end_date">
                        <span v-if="project.start_date">{{ formatDate(project.start_date) }}</span>
                        <span v-if="project.start_date && project.end_date"> - </span>
                        <span v-if="project.end_date">{{ formatDate(project.end_date) }}</span>
                      </p>
                      <p v-if="project.technology">Technologies: {{ project.technology }}</p>
                      <p v-if="project.description">
                        <a data-bs-toggle="collapse" :href="`#collapse-project-${index}`" role="button"
                          aria-expanded="false" aria-controls="collapse-project">
                          more...
                        </a>
                      </p>
                      <div class="collapse" :id="`collapse-project-${index}`">
                        <!-- <div class="card card-body"> -->
                        <p class="label-text">Responsibilities</p>
                        {{ project.description }}
                        <!-- </div> -->
                      </div>
                    </div>
                    <div class="text-nowrap text-end ms-2">
                      <span class="icon-btn me-2"
                        @click="showProfileChildItemEdit('project', project, 'projectAddEditModal')">
                        <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                      </span>
                      <span class="icon-btn" @click="removeProfileChildItem('project', project)">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                      </span>
                    </div>
                  </div>
                </template>
                <div v-else class="list-item">
                  <p>No Projects found</p>
                </div>
                <div class="py-3">
                  <button class="btn btn-primary br-0" type="button" data-bs-toggle="modal"
                    data-bs-target="#projectAddEditModal"
                    @click="modalId = 'projectAddEditModal'; elements.modalEdit = true">
                    Add Project
                  </button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="nav-personal" role="tabpanel" aria-labelledby="nav-profile-tab">
              <div class="d-block text-end mb-2">
                <span v-if="elements.personalInfoEdit">
                  <span class="icon-btn me-1" @click="updatePersonalInfo">
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </span>
                  <span class="icon-btn" @click="elements.personalInfoEdit = false">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </span>
                </span>
                <span v-else class="icon-btn" @click="elements.personalInfoEdit = true">
                  <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                </span>
              </div>
              <div class="row">
                <div class="col">
                  <h6 class="mb-2">Personal Info</h6>
                  <div class="profile-item-container">
                    <p class="label-text">Mobile</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.mobile">
                    <p v-else>{{ hrProfile.mobile }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">Email ID</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.email_id">
                    <p v-else>{{ hrProfile.email_id }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">Gender</p>
                    <select v-if="elements.personalInfoEdit" class="form-select form-control-sm"
                      v-model="hrProfile.gender" aria-label="Profile Status">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                    <p v-else>{{ hrProfile.gender }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">Date of Birth</p>
                    <input v-if="elements.personalInfoEdit" type="date" class="form-control form-control-sm"
                      v-model="hrProfile.date_of_birth">
                    <p v-else>{{ formatDate(hrProfile.date_of_birth) }}</p>
                  </div>
                </div>
                <div class="col">
                  <h6 class="mb-2">Address Info</h6>
                  <div class="profile-item-container">
                    <p class="label-text">Building Number</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.buiding_number">
                    <p v-else>{{ hrProfile.buiding_number }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">Street Name</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.street_name">
                    <p v-else>{{ hrProfile.street_name }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">City</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.city">
                    <p v-else>{{ hrProfile.city }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">State</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.state">
                    <p v-else>{{ hrProfile.state }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">Country</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.country">
                    <p v-else>{{ hrProfile.country }}</p>
                  </div>
                  <div class="profile-item-container">
                    <p class="label-text">PIN</p>
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.postal_code">
                    <p v-else>{{ hrProfile.postal_code }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="nav-doc" role="tabpanel" aria-labelledby="nav-doc-tab">
              <div class="content-list">
                <template v-if="hrProfile.docs && hrProfile.docs.length > 0">
                  <div v-for="document, index in hrProfile.docs" :key="index" class="list-item">
                    <div class="flex-fill">
                      <div v-if="elements.tabItemEdit && docId == document.id" class="row">
                        <div class="col-4">
                          <input type="text" v-model="docsEditData.title" class="form-control form-control-sm"
                            placeholder="Enter Document Title">
                        </div>
                      </div>
                      <a v-else-if="document.title" :href="document.path" target="_blank">{{
                        document.title }}.{{ document.path.split(".").pop() }}</a>
                    </div>
                    <div class="text-nowrap text-end ms-2">
                      <template v-if="elements.tabItemEdit && document.id == docId">
                        <span class="icon-btn me-2" @click="updateProfileChildItems(docsEditData, 'docs')">
                          <font-awesome-icon icon="fa-solid fa-check" />
                        </span>
                        <span class="icon-btn" @click="clearDocData(); getPageData();">
                          <font-awesome-icon icon="fa-solid fa-xmark" />
                        </span>
                      </template>
                      <template v-else>
                        <span class="icon-btn me-2" @click="editDoc(document)">
                          <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                        </span>
                        <span class="icon-btn" @click.prevent="deleteHrProfileDoc(document.id!, document)"
                          data-bs-toggle="modal" data-bs-target="#deleteHrProfileDoc">
                          <font-awesome-icon icon="fa-solid fa-trash" />
                        </span>
                      </template>
                    </div>
                  </div>
                </template>
                <div v-else class="list-item">
                  <p>No Document found</p>
                </div>
                <div class="py-3">
                  <div v-if="elements.tabItemEdit && !docId" class="row">
                    <div class="col-4">
                      <input type="text" v-model="docsData.title" class="form-control form-control-sm"
                        placeholder="Enter Document Title">
                    </div>
                    <div class="col-4">
                      <input type="file" @change="addDocumentFile" @click="docFiles = ''"
                        class="form-control form-control-sm" placeholder="Choose a file">
                    </div>
                    <div class="col-4">
                      <button class="btn btn-primary br-0 me-2" type="button" @click="uploadDocument">
                        Save
                      </button>
                      <button class="btn btn-primary br-0" type="button" @click="elements.tabItemEdit = false">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <button v-if="!elements.tabItemEdit" class="btn btn-primary br-0" type="button"
                    @click="elements.tabItemEdit = true">
                    Add Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- <div class="modal fade" id="workExperienceAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Work Experience</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body"> -->

  <ModalComponent id="workExperienceAddEditModal" v-loading="isModalLoading" ref="addHrProfileModalRef"
    :title="`${elements.tabItemEdit ? 'Edit' : 'Add'} Work Experience`" @hide="clearWorkExperienceData(); getPageData();"
    hide-cancel centered no-close-on-backdrop no-close-on-esc>
    <template #body>
      <div class="container">
        <form class="form-inline">
          <div class="row">
            <div class="col-12">
              <div class="form-floating mb-1">
                <input type="text" v-model="workExperienceData.company"
                  class="form-control border-top-0 border-end-0 border-start-0" id="company" placeholder="">
                <label for="company">Company</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="workExperienceData.location"
                  class="form-control border-top-0 border-end-0 border-start-0" id="location" placeholder="">
                <label for="location">Location</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="workExperienceData.position"
                  class="form-control border-top-0 border-end-0 border-start-0" id="position" placeholder="">
                <label for="position">Position</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="workExperienceData.start_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="start_date" placeholder="">
                <label for="start_date">Start Date</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="workExperienceData.end_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="end_date" placeholder="">
                <label for="end_date">End Date</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group mt-2">
                <label for="description">Responsibilities</label>
                <editor v-model="workExperienceData.description"
                  class="form-control border-top-0 border-end-0 border-start-0" id="description"
                  api-key="cef8afeordxmk3br8qxqww6h6sxtwvvu4hnmxsmc55740o0d" :init="editorInitObject" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary"
        @click="updateProfileChildItems(workExperienceData, 'work_experience')">Save</button>
    </template>
  </ModalComponent>

  <ModalComponent id="educationAddEditModal" v-loading="isModalLoading" ref="addHrProfileModalRef"
    :title="`${elements.tabItemEdit ? 'Edit' : 'Add'} Education`" @hide="clearEducationData(); getPageData();" hide-cancel
    centered no-close-on-backdrop no-close-on-esc>
    <template #body>
      <div class="container">
        <form class="form-inline">
          <div class="row">
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="educationData.university"
                  class="form-control border-top-0 border-end-0 border-start-0" id="university" placeholder="">
                <label for="university">School / College</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="educationData.location"
                  class="form-control border-top-0 border-end-0 border-start-0" id="location" placeholder="">
                <label for="location">Location</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="educationData.degree"
                  class="form-control border-top-0 border-end-0 border-start-0" id="degree" placeholder="">
                <label for="degree">Degree</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="educationData.major"
                  class="form-control border-top-0 border-end-0 border-start-0" id="major" placeholder="">
                <label for="major">Field of Study</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="educationData.start_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="start_date" placeholder="">
                <label for="start_date">Start Date</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="educationData.end_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="end_date" placeholder="">
                <label for="end_date">End Date</label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="updateProfileChildItems(educationData, 'education')">Save</button>
    </template>
  </ModalComponent>

  <ModalComponent id="projectAddEditModal" v-loading="isModalLoading" ref="addHrProfileModalRef"
    :title="`${elements.tabItemEdit ? 'Edit' : 'Add'} Project`" @hide="clearProjectData(); getPageData();" hide-cancel
    centered no-close-on-backdrop no-close-on-esc>
    <template #body>
      <div class="container">
        <form class="form-inline">
          <div class="row">
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="projectData.title"
                  class="form-control border-top-0 border-end-0 border-start-0" id="title" placeholder="">
                <label for="title">Project Title</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="text" v-model="projectData.client"
                  class="form-control border-top-0 border-end-0 border-start-0" id="client" placeholder="">
                <label for="client">Client</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="projectData.start_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="start_date" placeholder="">
                <label for="start_date">Start Date</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-1">
                <input type="date" v-model="projectData.end_date"
                  class="form-control border-top-0 border-end-0 border-start-0" id="end_date" placeholder="">
                <label for="end_date">End Date</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-1">
                <input type="text" v-model="projectData.technology"
                  class="form-control border-top-0 border-end-0 border-start-0" id="technology" placeholder="">
                <label for="technology">Technologies</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group mt-2">
                <label for="description">Responsibilities</label>
                <editor v-model="projectData.description" api-key="cef8afeordxmk3br8qxqww6h6sxtwvvu4hnmxsmc55740o0d"
                  :init="editorInitObject" placeholder="Enter Responsibilities" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" @click="updateProfileChildItems(projectData, 'project')">Save</button>
    </template>
  </ModalComponent>
  <ResumePreviewModal :hrProfile="hrProfile" :tenantSettings="tenant" />
  <AddHrProfileModal id="addHrProfileModal-hrProfile" ref="addHrProfileModalRef" @refreshParent="getHrProfileList" />
  <dialog-component id="removeProfileChildItem" :onYes="onYesProfileChildItemDelete" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete ${deleteChildTitle} info?`" />
  <dialog-component id="deleteHrProfileResume" :onYes="onYesHrProfileResume" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete resume`" />
  <dialog-component id="deleteHrProfileDoc" :onYes="onYesHrProfileDoc" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete Document`" />
  <dialog-component id="deleteHrProfile" :onYes="onYesProfile" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete profile?" />
  <dialog-component id="duplicateProfileConfirmation" :onYes="onYesDuplicateProfile" title="Create Duplicate Profile"
    message="Are you sure you want to create a copy of this profile?" />
</template>
<style lang="scss">
.mce-content-body {
  background: #df2c2c
}
</style>