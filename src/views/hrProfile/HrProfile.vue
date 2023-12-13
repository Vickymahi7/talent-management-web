<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { Modal } from 'bootstrap'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { formatDate } from '@/utils/dateFormats'
import { fileUploadBtnClick, getProfileStatusById } from '@/utils/commonFunctions'
import { PROFILE_STATUS } from '@/utils/constants'
import ResumePreviewModal from '@/components/modals/ResumePreviewModal.vue'
import type HrProfile from '@/types/HrProfile'
import type { WorkExperience } from '@/types/WorkExperience'
import type { Project } from '@/types/Project'
import type { Education } from '@/types/Education'
import type { HrProfileChilderen } from '@/types/HrProfile'
import type { Docs } from '@/types/Docs'
import { UserTypeId } from '@/utils/enums'
import { computed, onMounted, reactive, ref } from 'vue'
const props = defineProps({
  id: String
});
const elements = reactive({
  titleEdit: false,
  primaryInfoEdit: false,
  personalInfoEdit: false,
  aboutInfoEdit: false,
  skillEdit: false,
  noteEdit: false,
  summaryEdit: false,
  tabItemEdit: false,
  modalEdit: false,
});

const toast = useToast();

const isLoading = ref(false);
const isModalLoading = ref(false);

const resumeFiles = ref('');
const docFiles = ref('');
const docId = ref('');
const modalId = ref('');
const deleteChildTitle = ref('');

let hrProfile: HrProfile = reactive({
  id: '',
  hr_profile_id: '',
  tenant_id: '',
  hr_profile_type_id: '',
  profile_title: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email_id: '',
  alternate_email_id: '',
  mobile: '',
  alternate_mobile: '',
  phone: '',
  office_phone: '',
  location: '',
  ctc: '',
  experience_month: null as number | null,
  experience_year: null as number | null,
  summary: '',
  objective: '',
  note: '',
  gender: '',
  date_of_birth: '',
  resume_url: '',
  photo_url: '',
  buiding_number: '',
  street_name: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  website: '',
  facebook_id: '',
  twitter_id: '',
  linkedin_id: '',
  skype_id: '',
  status: '',
  status_id: null as number | null,
  user_id: '',
  active: true,
  created_by_id: '',
  created_dt: '',
  last_updated_dt: null as Date | null,
  skills: [] as string[],
  work_experience: [] as WorkExperience[],
  project: [] as Project[],
  education: [] as Education[],
  docs: [] as Docs[],
});

let workExperienceData = reactive({
  company: '',
  position: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
}) as WorkExperience;

let educationData = reactive({
  degree: '',
  major: '',
  university: '',
  location: '',
  start_date: '',
  end_date: '',
}) as Education;

let projectData = reactive({
  title: '',
  start_date: '',
  end_date: '',
  client: '',
  technology: '',
  description: '',
  location: '',
}) as Project;

const docsData = reactive({
  id: '',
  title: '',
  path: '',
}) as Docs;
let docsEditData = reactive({
  id: '',
  title: '',
  path: '',
}) as Docs;

let dialogParam = {
  id: null as string | number | null,
  key: null as string | number | null,
  data: null as string | number | null,
  path: null as string | number | null,
};

const rules = computed(() => {
  return {
    email_id: { required, email },
  }
})

const v$ = useVuelidate(rules, hrProfile as any);

const userTypeId = computed(() => {
  const typeId
    = localStorage.getItem("userTypeId");
  return typeId ? parseInt(typeId) : null;
})

const getImageUrlWithTimestamp = computed(() => {
  const imageUrl = hrProfile.photo_url;
  const timestamp = new Date().getTime();
  return `${imageUrl}?timestamp=${timestamp}`;
})

onMounted(() => {
  getHrProfile();
})

const getHrProfile = async () => {
  if (props.id) {
    try {
      isLoading.value = true;
      const response: any = await axios.get('/hrprofile/view/' + props.id);
      hrProfile = response.hrProfile;
    } catch (error: any) {
      toast.error(error.message);
    }
    finally {
      isLoading.value = false;
    }
  }
};
const updateHrProfile = async (data: any) => {
  data.id = hrProfile.id;

  try {
    console.log(hrProfile)
    // Validation not working
    // const result = await v$.value.$validate();
    // console.log(result)
    // if (result) {
    if (elements.modalEdit) isModalLoading.value = true;
    else isLoading.value = true;
    const response: any = await axios.patch('/hrprofile/update', data);

    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getHrProfile();
      elements.titleEdit = false;
      elements.primaryInfoEdit = false;
      elements.personalInfoEdit = false;
      elements.aboutInfoEdit = false;
      elements.skillEdit = false;
      elements.noteEdit = false;
      elements.summaryEdit = false;
      elements.tabItemEdit = false;
      elements.modalEdit = false;
      clearDocData();
      hideModal();
    }
    // }
  } catch (error: any) {
    console.log(error)
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
    isModalLoading.value = false;
  }
};
const uploadProfilePhoto = async (event: any) => {
  const files = event.target.files
  try {
    if (files.length > 0) {
      let formData = new FormData();


      formData.append('id', hrProfile.id!);
      formData.append('file', files[0]);
      console.log(files);

      console.log(formData.values);
      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/photoupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);

      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getHrProfile();
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
      formData.append('id', hrProfile.id!);
      formData.append('file', resumeFiles.value[0]);
      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/resumeupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getHrProfile();
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
      formData.append('id', hrProfile.id!);
      formData.append('title', docsData.title);
      formData.append('file', docFiles.value[0]);
      const docList = hrProfile.docs?.length ? JSON.stringify(hrProfile.docs) : '';
      formData.append('docs', docList);
      isLoading.value = true;
      const response: any = await axios.post('/hrprofile/docupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.message);
        getHrProfile();
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
  elements.tabItemEdit = true;
  docId.value = document.id;
  docsEditData = document;
};
const clearDocData = () => {
  docId.value = '';
  elements.tabItemEdit = false;
  docsData.id = '';
  docsData.title = '';
  docsData.path = '';
};
const updateTitleInfo = () => {
  const data = {
    profile_title: hrProfile.profile_title,
    first_name: hrProfile.first_name,
    last_name: hrProfile.last_name,
  }

  updateHrProfile(data);
};
const updatePrimaryInfo = () => {
  const data = {
    location: hrProfile.location,
    ctc: hrProfile.ctc,
    experience_month: hrProfile.experience_month,
    experience_year: hrProfile.experience_year,
    status_id: hrProfile.status_id,
    status: getProfileStatusById(hrProfile.status_id),
    email_id: hrProfile.email_id,
    mobile: hrProfile.mobile,
    linkedin_id: hrProfile.linkedin_id,
  }

  updateHrProfile(data);
};
const updatePersonalInfo = () => {
  const data = {

    gender: hrProfile.gender,
    date_of_birth: hrProfile.date_of_birth,
    location: hrProfile.location,
    buiding_number: hrProfile.buiding_number,
    street_name: hrProfile.street_name,
    city: hrProfile.city,
    state: hrProfile.state,
    country: hrProfile.country,
    postal_code: hrProfile.postal_code,
  }

  updateHrProfile(data);
};
const updateHrProfileItem = (key: string) => {
  const data = {}
  data[key] = hrProfile[key],

    updateHrProfile(data);
};
const updateProfileChildItems = (itemData: any, itemKey: string) => {
  let itemVal = null;
  const profileData = hrProfile as any;
  if (elements.tabItemEdit) {
    itemVal = profileData[itemKey];
  }
  else {
    itemVal = profileData[itemKey] ? profileData[itemKey].concat([itemData]) : [itemData];
  }

  const data: any = {}
  data[itemKey] = itemVal;

  updateHrProfile(data);
};
const addSkills = (event: any) => {
  const skill = event.target.value;
  hrProfile.skills = hrProfile.skills ?? [];
  if (!hrProfile.skills.includes(skill)) {
    hrProfile.skills.push(skill);
    event.target.value = '';
  }
};
const removeSkill = (skill: string) => {
  hrProfile.skills = hrProfile.skills ? hrProfile.skills.filter(item => item != skill) : [];
};
const showProfileChildItemEdit = (itemKey: string, itemData: HrProfileChilderen, modId: string) => {
  elements.tabItemEdit = true;
  elements.modalEdit = true;
  modalId.value = modId;
  if (itemKey === 'work_experience') {
    workExperienceData = itemData as WorkExperience;
  }
  else if (itemKey === 'education') {
    educationData = itemData as Education;
  }
  else if (itemKey === 'project') {
    projectData = itemData as Project;
  }
  showModal();
};
const showModal = () => {
  const modalEl = document.getElementById(modalId.value);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.show();
};
const hideModal = () => {
  const modalEl = document.getElementById(modalId.value);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.hide();
};
const removeProfileChildItem = (key: string, data: any) => {
  dialogParam.key = key;
  dialogParam.data = data;

  if (key == 'work_experience') {
    deleteChildTitle.value = 'Work Experience';
  }
  else if (key == 'education') {
    deleteChildTitle.value = 'Education';
  }
  else if (key == 'project') {
    deleteChildTitle.value = 'Project';
  }
};
const onYesProfileChildItemDelete = () => {
  const key = dialogParam.key!;
  const data = dialogParam.data;
  // remove the object with its reference
  const profileData: any = hrProfile;
  profileData[key] = profileData[key] ? profileData[key].filter((item: any) => item !== data) : [];

  updateHrProfile(profileData);
};
const deleteHrProfileResume = (id: string) => {
  dialogParam.id = id;
};
const onYesHrProfileResume = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/hrprofile/deleteresume/' + dialogParam.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getHrProfile();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
const deleteHrProfileDoc = (id: string, data: any) => {
  dialogParam = data;
};
const onYesHrProfileDoc = async () => {
  hrProfile.docs = hrProfile.docs ? hrProfile.docs.filter((item: any) => item !== dialogParam) : [];
  const data: any = {
    id: hrProfile.id,
    docs: hrProfile.docs,
    doc_id: dialogParam.id,
    path: dialogParam.path,
  }
  try {
    isLoading.value = true;
    const response: any = await axios.patch('/hrprofile/deletedoc', data);

    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getHrProfile();
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};
// }
// props: ['id'],
//   components: {
//   ResumePreviewModal,
//   },
// },
//   computed: {
//
// },
// const mounted = () => {
//   getHrProfile();
// },
//   methods:
// }
// }
</script>
<template>
  <div class="d-flex card-gap-mb">
    <div class="content-card content-header">
      <label>{{ hrProfile.first_name }} - {{ hrProfile.profile_title }}</label>
      <!-- <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'hrprofilemanagement' }">Manage HR Profile</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Profile - {{ hrProfile.first_name }}</li>
        </ol>
      </nav> -->
    </div>
    <button class="btn primary-btn ms-2" type="button" data-bs-toggle="modal" data-bs-target="#resumePreviewModal">
      <font-awesome-icon class="me-2" icon="fa-solid fa-download" />
      Resume Preview
    </button>
  </div>
  <div v-loading="isLoading" class="content-body profile-section">
    <div class="profile-head">
      <div class="profile-media content-card">
        <div class="align-self-end">
          <span v-if="elements.titleEdit">
            <span class="icon-btn float-end" @click="elements.titleEdit = false">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </span>
            <span class="icon-btn float-end me-1" @click="updateTitleInfo">
              <font-awesome-icon icon="fa-solid fa-check" />
            </span>
          </span>
          <span v-else class="icon-btn float-end" @click="elements.titleEdit = true">
            <font-awesome-icon icon="fa-solid fa-pencil-alt" />
          </span>
        </div>
        <div class="profile-picture-wrapper">
          <img class="profile-picture" :src="getImageUrlWithTimestamp" alt="Profile Picture" width="150" height="150" />
          <span class="icon-btn upload-icon" @click="fileUploadBtnClick('upload-input')">
            <font-awesome-icon icon="fa-solid fa-camera" />
            <input type="file" id="upload-input" class="icon-upload-input" @input="uploadProfilePhoto($event)"
              placeholder="Choose Photo">
          </span>
        </div>
        <div class="title-block">
          <div v-if="elements.titleEdit">
            <input type="text" class="form-control form-control-sm d-inline-block w-50" v-model="hrProfile.first_name"
              placeholder="First Name">
            <input type="text" class="form-control form-control-sm d-inline-block w-50" v-model="hrProfile.last_name"
              placeholder="Last Name">
          </div>
          <p v-else class="title-text">{{ hrProfile.first_name }} {{ hrProfile.last_name }}</p>
          <input v-if="elements.titleEdit" type="text" class="form-control form-control-sm"
            v-model="hrProfile.profile_title" placeholder="Profile Title">
          <p v-else>{{ hrProfile.profile_title }}</p>
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
                <p class="label-text">Location</p>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.location">
                <p v-else>{{ hrProfile.location }}</p>
              </div>
              <div class="separator my-3"></div>
              <div class="d-flex justify-content-between align-items-center">
                <p class="label-text">
                  <span class="icon-btn me-1">
                    <font-awesome-icon icon="fa-solid fa-paperclip" />
                  </span>
                  <span v-if="hrProfile.resume_url">{{ hrProfile.first_name }} - Resume</span>
                  <span v-else class="text-muted">-- no resume --</span>
                </p>
                <div class="text-end" :class="{ 'invisible': elements.primaryInfoEdit }">
                  <template v-if="hrProfile.resume_url">
                    <a :href="hrProfile.resume_url" target="_blank" class="btn primary-btn ms-2 br-0" type="button">
                      Show
                    </a>
                    <a href="#" class="btn primary-btn ms-2 br-0" type="button"
                      @click.prevent="deleteHrProfileResume(hrProfile.id!)" data-bs-toggle="modal"
                      data-bs-target="#deleteHrProfileResume">
                      Remove
                    </a>
                  </template>
                  <button v-else @click="fileUploadBtnClick('resume-input')" class="btn primary-btn br-0" type="button">
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
                <p v-else>{{ getProfileStatusById(hrProfile.status_id) }}</p>
              </div>
              <div class="profile-item-container">
                <p class="label-text">Last Updated</p>
                <p>{{ formatDate(hrProfile.last_updated_dt) }}</p>
              </div>
              <div class="profile-item-container">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-solid fa-envelope" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.email_id" />
                <p v-else>
                  {{ hrProfile.email_id }}
                </p>
              </div>
              <div class="profile-item-container">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-solid fa-phone" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.mobile">
                <p v-else>
                  {{ hrProfile.mobile }}
                </p>
              </div>
              <div class="profile-item-container">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-brands fa-linkedin" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.linkedin_id">
                <p v-else>
                  {{ hrProfile.linkedin_id }}
                </p>
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
              <span class="icon-btn me-1" @click="updateHrProfileItem('skills')">
                <font-awesome-icon icon="fa-solid fa-check" />
              </span>
              <span class="icon-btn" @click="elements.skillEdit = false">
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </span>
            </span>
            <span v-else class="float-end">
              <span class="icon-btn" @click="elements.skillEdit = true">
                <font-awesome-icon icon="fa-solid fa-pencil-alt" />
              </span>
            </span>
          </h6>
          <input v-if="elements.skillEdit" type="text" @keyup.enter.prevent="addSkills"
            class="form-control form-control-sm mt-2 mb-1" placeholder="Press Enter to Add Skill">
          <p class="profile-short-content">
            <template v-if="elements.skillEdit">
              <span v-for="skill, index in   hrProfile.skills" :key="index" class="badge badge-custom me-1">
                <span class="pe-1">{{ skill }}</span>
                <a href="#" class="d-inline-block " @click="removeSkill(skill)">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </a>
              </span>
            </template>
            <template v-else>
              <span v-for="skill, index in   hrProfile.skills" :key="index" class="badge badge-custom me-1">{{ skill
              }}</span>
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
            <!-- <button class="btn primary-btn d-block" type="button">
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
            <button class="nav-link tab-btn" id="nav-doc-tab" data-bs-toggle="tab" data-bs-target="#nav-doc" type="button"
              role="tab" aria-controls="nav-doc" aria-selected="false">Docs</button>
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
                <textarea v-if="elements.summaryEdit" v-model="hrProfile.summary" name="" id=""
                  class="form-control h-100"></textarea>
                <p v-else class="">
                  {{ hrProfile.summary }}
                </p>
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
                      {{ workExperience.start_date }}
                      <span v-if="workExperience.start_date && workExperience.end_date"> - </span>
                      {{ workExperience.end_date }}
                      <span v-if="(workExperience.start_date || workExperience.end_date) && workExperience.location"> |
                      </span>
                      {{ workExperience.location }}
                    </p>
                    <div class="collapse" :id="`collapse-workExp-${index}`">
                      <!-- <div class="card card-body"> -->
                      <p class="label-text">Responsibilities</p>
                      {{ workExperience.description }}
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
                <button class="btn primary-btn br-0" type="button" data-bs-toggle="modal"
                  data-bs-target="#workExperienceAddEditModal"
                  @click="modalId = 'workExperienceAddEditModal'; elements.modalEdit = true">
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
                      {{ education.start_date }}
                      <span v-if="education.start_date && education.end_date"> - </span>
                      <span v-if="education.end_date">{{ education.end_date }}</span>
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
                <button class="btn primary-btn br-0" type="button" data-bs-toggle="modal"
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
                      <span v-if="project.start_date">{{ project.start_date }}</span>
                      <span v-if="project.start_date && project.end_date"> - </span>
                      <span v-if="project.end_date">{{ project.end_date }}</span>
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
                <button class="btn primary-btn br-0" type="button" data-bs-toggle="modal"
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
                  <p class="label-text">Gender</p>
                  <select v-if="elements.personalInfoEdit" class="form-select form-control-sm" v-model="hrProfile.gender"
                    aria-label="Profile Status">
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
                  <p v-else>{{ hrProfile.date_of_birth }}</p>
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
                      <span class="icon-btn" @click="clearDocData(); getHrProfile();">
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
                    <button class="btn primary-btn br-0 me-2" type="button" @click="uploadDocument">
                      Save
                    </button>
                    <button class="btn primary-btn br-0" type="button" @click="elements.tabItemEdit = false">
                      Cancel
                    </button>
                  </div>
                </div>
                <button v-if="!elements.tabItemEdit" class="btn primary-btn br-0" type="button"
                  @click="elements.tabItemEdit = true">
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="workExperienceAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Work Experience</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="company" class="col-sm-4 col-form-label">Company</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="workExperienceData.company" id="company"
                    placeholder="Enter Company Name">
                </div>
              </div>
              <div class="row">
                <label for="position" class="col-sm-4 col-form-label">Position</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="workExperienceData.position" id="position"
                    placeholder="Enter Position">
                </div>
              </div>
              <div class="row">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="workExperienceData.start_date" id="start_date">
                </div>
              </div>
              <div class="row">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="workExperienceData.end_date" id="end_date">
                </div>
              </div>
              <div class="row">
                <label for="description" class="col-sm-4 col-form-label">Responsibilities</label>
                <div class="col-sm-8">
                  <textarea class="form-control" v-model="workExperienceData.description" rows="5" id="description"
                    placeholder="Enter Responsibilities"></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="updateProfileChildItems(workExperienceData, 'work_experience')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="educationAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Education</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="university" class="col-sm-4 col-form-label">School / College</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.university" id="university"
                    placeholder="Enter School / College Name">
                </div>
              </div>
              <div class="row">
                <label for="degree" class="col-sm-4 col-form-label">Degree</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.degree" id="degree"
                    placeholder="Enter Degree">
                </div>
              </div>
              <div class="row">
                <label for="major" class="col-sm-4 col-form-label">Field of Study</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.major" id="major"
                    placeholder="Enter Field of Study">
                </div>
              </div>
              <div class="row">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="educationData.start_date" id="start_date">
                </div>
              </div>
              <div class="row">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="educationData.end_date" id="end_date">
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="updateProfileChildItems(educationData, 'education')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="projectAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Project</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form class="form-inline">
              <div class="row">
                <label for="title" class="col-sm-4 col-form-label">Project Title</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.title" id="title"
                    placeholder="Enter Project Title">
                </div>
              </div>
              <div class="row">
                <label for="client" class="col-sm-4 col-form-label">Client</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.client" id="client"
                    placeholder="Enter Client Name">
                </div>
              </div>
              <div class="row">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="projectData.start_date" id="start_date">
                </div>
              </div>
              <div class="row">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="projectData.end_date" id="end_date">
                </div>
              </div>
              <div class="row">
                <label for="technology" class="col-sm-4 col-form-label">Technologies</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.technology" id="technology"
                    placeholder="Enter Technologies used">
                </div>
              </div>
              <div class="row">
                <label for="description" class="col-sm-4 col-form-label">Responsibilities</label>
                <div class="col-sm-8">
                  <textarea class="form-control" v-model="projectData.description" rows="5" id="description"
                    placeholder="Enter Responsibilities"></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="updateProfileChildItems(projectData, 'project')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <ResumePreviewModal :hrProfile="hrProfile" />
  <dialog-component id="removeProfileChildItem" :onYes="onYesProfileChildItemDelete" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete ${deleteChildTitle} info?`" />
  <dialog-component id="deleteHrProfileResume" :onYes="onYesHrProfileResume" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete resume`" />
  <dialog-component id="deleteHrProfileDoc" :onYes="onYesHrProfileDoc" :returnParams="dialogParam"
    title="Delete Confirmation" :message="`Are you sure to delete Document`" />
</template>
