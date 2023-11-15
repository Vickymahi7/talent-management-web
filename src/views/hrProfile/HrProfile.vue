<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { Modal } from 'bootstrap'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'

export default {
  props: ['id'],
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),

      elements: {
        primaryInfoEdit: false,
        personalInfoEdit: false,
        aboutInfoEdit: false,
        skillEdit: false,
        summaryEdit: false,
        tabItemEdit: false,
      },

      resumeFiles: '',

      hrProfile: {
        id: '',
        hr_profile_id: '',
        tenant_id: '',
        hr_profile_type_id: '',
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
        experience_month: '',
        experience_year: '',
        objective: '',
        summary: '',
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
        status_id: '',
        user_id: '',
        active: true,
        created_by_id: '',
        created_dt: '',
        last_updated_dt: '',
        skills: [],
        work_experience: [],
        project: [],
        education: [],
        docs: [],
      },

      workExperienceData: {
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
      },
      educationData: {
        degree: '',
        major: '',
        university: '',
        location: '',
        start_date: '',
        end_date: '',
      },
      projectData: {
        title: '',
        start_date: '',
        end_date: '',
        client: '',
        technology: '',
        description: '',
        location: '',
      },
      docsData: {
        title: '',
        path: '',
      },
    }
  },
  validations() {
    return {
      hrProfile: {
        email_id: { required, email },
      }
    }
  },
  computed: {
    getImageUrlWithTimestamp() {
      const imageUrl = this.hrProfile.photo_url;
      const timestamp = new Date().getTime();
      return `${imageUrl}?timestamp=${timestamp}`;
    },
  },
  mounted() {
    this.getHrProfile();
  },
  methods: {
    async getHrProfile() {
      try {
        const response: any = await axios.get('/hrprofile/view/' + this.id);
        this.hrProfile = response.hrProfile;
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
    async updateHrProfile(data) {
      data.id = this.hrProfile.id;
      data.hr_profile_id = this.hrProfile.hr_profile_id;
      data.user_id = this.hrProfile.user_id;

      try {
        this.v$.hrProfile.$touch();
        if (!this.v$.hrProfile.$invalid) {
          const response: any = await axios.patch('/hrprofile/update', data);
          console.log(response);

          if (response.status == HttpStatusCode.Ok) {
            this.toast.success(response.message);
            this.getHrProfile();
            this.elements.primaryInfoEdit = false;
            this.elements.personalInfoEdit = false;
            this.elements.aboutInfoEdit = false;
            this.elements.skillEdit = false;
            this.elements.summaryEdit = false;
            this.elements.tabItemEdit = false;
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
    async uploadProfilePhoto(event: any) {
      const files = event.target.files
      try {
        if (files.length > 0) {
          let formData = new FormData();


          formData.append('id', this.hrProfile.id);
          formData.append('file', files[0]);
          console.log(files);

          console.log(formData.values);
          const response: any = await axios.post('/hrprofile/photoupload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response);

          if (response.status == HttpStatusCode.Ok) {
            this.toast.success(response.message);
            this.getHrProfile();
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
    async addResume(event: any) {
      this.resumeFiles = event.target.files;
    },
    async uploadResume() {
      try {
        if (this.resumeFiles.length > 0) {
          let formData = new FormData();
          formData.append('id', this.hrProfile.id);
          formData.append('file', this.resumeFiles[0]);

          const response: any = await axios.post('/hrprofile/resumeupload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status == HttpStatusCode.Ok) {
            this.toast.success(response.message);
            this.getHrProfile();
          }
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
    updatePrimaryInfo() {
      const data = {
        email_id: this.hrProfile.email_id,
        location: this.hrProfile.location,
        ctc: this.hrProfile.ctc,
        experience_month: this.hrProfile.experience_month,
        experience_year: this.hrProfile.experience_year,
        status: this.hrProfile.status,
        mobile: this.hrProfile.mobile,
        linkedin_id: this.hrProfile.linkedin_id,
      }

      this.updateHrProfile(data);
    },
    updatePersonalInfo() {
      const data = {
        email_id: this.hrProfile.email_id,

        gender: this.hrProfile.gender,
        date_of_birth: this.hrProfile.date_of_birth,
        location: this.hrProfile.location,
        buiding_number: this.hrProfile.buiding_number,
        street_name: this.hrProfile.street_name,
        city: this.hrProfile.city,
        state: this.hrProfile.state,
        country: this.hrProfile.country,
        postal_code: this.hrProfile.postal_code,
      }

      this.updateHrProfile(data);
    },
    updateAboutInfo() {
      const data = {
        email_id: this.hrProfile.email_id,
        objective: this.hrProfile.objective,
      }

      this.updateHrProfile(data);
    },
    updateSkill() {
      const data = {
        email_id: this.hrProfile.email_id,
        skills: this.hrProfile.skills,
      }

      this.updateHrProfile(data);
    },
    updateSummary() {
      const data = {
        email_id: this.hrProfile.email_id,
        summary: this.hrProfile.summary,
      }

      this.updateHrProfile(data);
    },
    updateProfileChildItems(itemData, itemKey) {
      let itemVal = null;
      if (this.elements.tabItemEdit) {
        itemVal = this.hrProfile[itemKey];
      }
      else {
        itemVal = this.hrProfile[itemKey] ? this.hrProfile[itemKey].concat([itemData]) : [itemData];
      }

      const data = {
        email_id: this.hrProfile.email_id,
      }
      data[itemKey] = itemVal;

      this.updateHrProfile(data);
    },
    addSkills(event) {
      const skill = event.target.value;
      if (!this.hrProfile.skills.includes(skill)) {
        this.hrProfile.skills.push(skill);
        event.target.value = '';
      }
    },
    removeSkill(skill) {
      this.hrProfile.skills = this.hrProfile.skills.filter(item => item != skill);
    },
    showProfileChildItemEdit(itemKey, itemData, modalId) {
      this.elements.tabItemEdit = true;
      if (itemKey === 'work_experience') {
        this.workExperienceData = itemData;
      }
      else if (itemKey === 'education') {
        this.educationData = itemData;
      }
      else if (itemKey === 'project') {
        this.projectData = itemData;
      }
      const modal = new Modal(document.getElementById(modalId), {
        keyboard: false
      })
      modal.show();
    },
    removeProfileChildItem(key, item) {
      // remove the object with its reference
      this.hrProfile[key] = this.hrProfile[key].filter(data => data !== item);

      this.updateHrProfile(this.hrProfile);
    },
    handleIconClick() {
      const inputEl = document.getElementById("upload-input");
      inputEl?.click();
    }
  }
}
</script>
<template>
  <div class="d-flex">
    <div class="content-card content-header">
      <label>HR Profile</label>
      <!-- <nav aria-label="breadcrumb">
                          <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Manage HR Profile</a></li>
                            <li class="breadcrumb-item active" aria-current="page">HR Profile</li>
                          </ol>
                        </nav> -->
    </div>
    <button class="btn primary-btn ms-2" type="button" @click="$router.push({ name: 'resumepreview', params: { id } })">
      <font-awesome-icon class="me-2" icon="fa-solid fa-download" />
      Resume Preview
    </button>
  </div>
  <div class="content-body profile-section">
    <div class="profile-head">
      <div class="profile-media content-card">
        <div class="profile-picture-wrapper">
          <img class="profile-picture" :src="getImageUrlWithTimestamp" alt="Profile Picture" width="150" height="150" />
          <!-- <div class="upload-icon" @click="handleIconClick"> -->
          <!-- <font-awesome-icon icon="fa-solid fa-camera" />
              <input type="file" id="upload-input" class="profile-picture-input" @input="uploadProfilePhoto($event)"
                placeholder="Choose Photo">
              </div> -->
          <span class="icon-btn upload-icon" @click="handleIconClick">
            <font-awesome-icon icon="fa-solid fa-camera" />
            <input type="file" id="upload-input" class="profile-picture-input" @input="uploadProfilePhoto($event)"
              placeholder="Choose Photo">
          </span>
        </div>
        <div class="title-block">
          <p class="title-text">{{ hrProfile.first_name }} {{ hrProfile.last_name }}</p>
          <p>--position--</p>
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
              <div class="row align-items-center mb-1">
                <div class="col-lg-4">
                  <p class="label-text">Years of Experience</p>
                </div>
                <div class="col-lg-8">
                  <div v-if="elements.primaryInfoEdit" class="input-group input-group-sm">
                    <input type="text" v-model="hrProfile.experience_year" class="form-control form-control-sm"
                      placeholder="Enter Year" aria-label="experience_year">
                    <span class="input-group-text">years</span>
                    <input type="text" v-model="hrProfile.experience_month" class="form-control form-control-sm"
                      placeholder="Enter Month" aria-label="experience_month">
                    <span class="input-group-text">months</span>
                  </div>
                  <p v-else>
                    <span>{{ hrProfile.experience_year }} years </span>
                    <span>{{ hrProfile.experience_month }} months</span>
                  </p>
                </div>
              </div>
              <div class="row align-items-center mb-1">
                <div class="col-lg-4">
                  <p class="label-text">CTC</p>
                </div>
                <div class="col-lg-8">
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.ctc">
                  <p v-else>{{ hrProfile.ctc }}</p>
                </div>
              </div>
              <div class="row align-items-center mb-1">
                <div class="col-lg-4">
                  <p class="label-text">Location</p>
                </div>
                <div class="col-lg-8">
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.location">
                  <p v-else>{{ hrProfile.location }}</p>
                </div>
              </div>
              <div class="separator my-3"></div>
              <div class="row align-items-center mb-1">
                <div class="col-8">
                  <input v-if="elements.primaryInfoEdit" type="file" @input="addResume($event)"
                    class="form-control form-control-sm" id="
                                                                    resumeInput" placeholder="Choose a Resume">
                  <p v-else class="label-text">
                    <span class="icon-btn me-1">
                      <font-awesome-icon icon="fa-solid fa-paperclip" />
                    </span>
                    <span v-if="hrProfile.resume_url">{{ hrProfile.first_name }} - Resume</span>
                    <span v-else class="text-muted">-- no resume --</span>
                  </p>
                </div>
                <div class="col-4 text-end">
                  <button v-if="elements.primaryInfoEdit" @click="uploadResume" class="btn primary-btn me-2 br-0"
                    type="button">
                    Upload
                  </button>
                  <a v-if="!elements.primaryInfoEdit && hrProfile.resume_url" :href="hrProfile.resume_url" target="_blank"
                    class="btn primary-btn br-0" type="button">
                    Show
                  </a>
                </div>
              </div>
            </div>
            <div class="profile-container">
              <div class="row align-items-center mb-1">
                <div class="col-lg-4">
                  <p class="label-text">Profile Status</p>
                </div>
                <div class="col-lg-8">
                  <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                    v-model="hrProfile.status">
                  <p v-else>{{ hrProfile.status }}</p>
                </div>
              </div>
              <div class="row align-items-center mb-1">
                <div class="col-lg-4">
                  <p class="label-text">Last Updated</p>
                </div>
                <div class="col-lg-8">
                  <p>{{ hrProfile.last_updated_dt }}</p>
                </div>
              </div>
              <div class="d-flex align-items-center mb-1 ">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-solid fa-envelope" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.email_id" />
                <p v-else class="label-text d-inline-block">
                  {{ hrProfile.email_id }}
                </p>
              </div>
              <div class="d-flex align-items-center mb-1">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-solid fa-phone" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.mobile">
                <p v-else class="label-text d-inline-block">
                  {{ hrProfile.mobile }}
                </p>
              </div>
              <div class="d-flex align-items-center mb-1">
                <span>
                  <span class="icon-btn me-2">
                    <font-awesome-icon icon="fa-brands fa-linkedin" />
                  </span>
                </span>
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.linkedin_id">
                <p v-else class="label-text d-inline-block">
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
        <div class="content-card">
          <h6 class="label-text mb-2">About
            <span v-if="elements.aboutInfoEdit">
              <span class="icon-btn float-end" @click="elements.aboutInfoEdit = false">
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </span>
              <span class="icon-btn float-end me-1" @click="updateAboutInfo">
                <font-awesome-icon icon="fa-solid fa-check" />
            </span>
          </span>
          <span v-else class="icon-btn float-end" @click="elements.aboutInfoEdit = true">
            <font-awesome-icon icon="fa-solid fa-pencil-alt" />
          </span>
        </h6>
        <textarea v-if="elements.aboutInfoEdit" v-model="hrProfile.objective" name="" id="" class="form-control"
          rows="2"></textarea>
          <p v-else class="profile-short-content">
            {{ hrProfile.objective }}
          </p>
        </div>
        <div class="content-card">
          <h6 class="label-text">Skills
            <span v-if="elements.skillEdit" class="float-end">
              <span class="icon-btn me-1" @click="updateSkill">
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
              <span v-for="skill, index in   hrProfile.skills" :key="index"
                class="badge bg-green fw-normal color-light me-1">
                <span class="pe-1">{{ skill }}</span>
                <a href="#" class="d-inline-block " @click="removeSkill(skill)">
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </a>
              </span>
            </template>
            <template v-else>
              <span v-for="skill, index in   hrProfile.skills" :key="index"
                class="badge bg-green fw-normal color-light me-1">{{ skill
                }}</span>
            </template>
          </p>
        </div>
        <div class="content-card">
          <h6 class="label-text">Note
            <!-- <span class="icon-btn float-end">
                                                                                                                                      <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                                                                                                                                    </span> -->
          </h6>
          <div class="note-input-group">
            <textarea name="" id="" class="form-control" rows="2"></textarea>
            <button class="btn primary-btn d-block" type="button">
              Add Note
            </button>
          </div>
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
                  <span class="icon-btn me-1" @click="updateSummary">
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
              <template v-if="hrProfile.work_experience?.length > 0">
                <div v-for="workExperience, index in   hrProfile.work_experience" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ workExperience.company }}</p>
                    <p>{{ workExperience.position }}</p>
                    <p>{{ workExperience.start_date }} {{ workExperience.end_date }} | {{ workExperience.location }}.
                    </p>
                  </div>
                  <div class="text-end">
                    <span class="icon-btn me-2"
                      @click="showProfileChildItemEdit('work_experience', workExperience, 'workExperienceAddEditModal')">
                      <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                    </span>
                    <span class="icon-btn" @click="removeProfileChildItem('work_experience', workExperience)">
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
                  data-bs-target="#workExperienceAddEditModal">
                  Add Work Experience
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-education" role="tabpanel" aria-labelledby="nav-education-tab">
            <div class="content-list">
              <template v-if="hrProfile.education?.length > 0">
                <div v-for="education, index in   hrProfile.education" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ education.degree }} - {{ education.major }}</p>
                    <p>{{ education.university }}</p>
                    <p>{{ education.start_date }} - {{ education.end_date }} | {{ education.location }}.</p>
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
                  data-bs-target="#educationAddEditModal">
                  Add Education
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-project" role="tabpanel" aria-labelledby="nav-project-tab">
            <div class="content-list">
              <template v-if="hrProfile.project?.length > 0">
                <div v-for="project, index in   hrProfile.project" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ project.title }}</p>
                    <p>Client: {{ project.client }}</p>
                    <p>{{ project.start_date }} - {{ project.end_date }}.</p>
                    <p>Technologies: {{ project.technology }}</p>
                  </div>
                  <div class="text-end">
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
                  data-bs-target="#projectAddEditModal">
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
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Gender</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.gender">
                    <p v-else>{{ hrProfile.gender }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Date of Birth</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="date" class="form-control form-control-sm"
                      v-model="hrProfile.date_of_birth">
                    <p v-else>{{ hrProfile.date_of_birth }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Location</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.location">
                    <p v-else>{{ hrProfile.location }}</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <h6 class="mb-2">Address Info</h6>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Building Number</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.buiding_number">
                    <p v-else>{{ hrProfile.buiding_number }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Street Name</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.street_name">
                    <p v-else>{{ hrProfile.street_name }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">City</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.city">
                    <p v-else>{{ hrProfile.city }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">State</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.state">
                    <p v-else>{{ hrProfile.state }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">Country</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.country">
                    <p v-else>{{ hrProfile.country }}</p>
                  </div>
                </div>
                <div class="row align-items-center mb-2">
                  <div class="col-lg-4">
                    <p class="label-text">PIN</p>
                  </div>
                  <div class="col-lg-8">
                    <input v-if="elements.personalInfoEdit" type="text" class="form-control form-control-sm"
                      v-model="hrProfile.postal_code">
                    <p v-else>{{ hrProfile.postal_code }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-doc" role="tabpanel" aria-labelledby="nav-doc-tab">
            <div class="content-list">
              <template v-if="hrProfile.docs?.length > 0">
                <div v-for="document, index in   hrProfile.docs" :key="index" class="list-item">
                  <!-- <div v-if="elements.tabItemEdit" class="row">
                                                                                                                                            <div class="col-12">
                                                                                                                                              <input type="text" v-model="docsData.title" class="form-control form-control-sm"
                                                                                                                                                placeholder="Enter Document Title">
                                                                                                                                            </div>
                                                                                                                                            <div class="col-12">
                                                                                                                                              <input type="file" class="form-control form-control-sm" placeholder="Choose a file">
                                                                                                                                            </div>
                                                                                                                                          </div> -->
                  <p class="label-text">Adhaar Card</p>
                  <div v-if="elements.tabItemEdit" class="text-end">
                    <span class="icon-btn me-1" @click="updateProfileChildItems(educationData, 'education')">
                      <font-awesome-icon icon="fa-solid fa-check" />
                    </span>
                    <span class="icon-btn" @click="elements.tabItemEdit = false">
                      <font-awesome-icon icon="fa-solid fa-xmark" />
                    </span>
                  </div>
                  <div v-else class="text-end">
                    <span class="icon-btn" @click="elements.tabItemEdit = true">
                      <font-awesome-icon icon="fa-solid fa-pencil-alt" />
                    </span>
                    <span class="icon-btn">
                      <font-awesome-icon icon="fa-solid fa-trash" />
                    </span>
                  </div>
                </div>
              </template>
              <div v-else class="list-item">
                <p>No Document found</p>
              </div>
              <div class="py-3">
                <div v-if="elements.tabItemEdit" class="row">
                  <div class="col-12">
                    <input type="text" v-model="docsData.title" class="form-control form-control-sm"
                      placeholder="Enter Document Title">
                  </div>
                  <div class="col-12">
                    <input type="file" class="form-control form-control-sm" placeholder="Choose a file">
                  </div>
                </div>
                <button v-if="elements.tabItemEdit" class="btn primary-btn br-0" type="button"
                  @click="updateProfileChildItems(docsData, 'docs')">
                  Save
                </button>
                <button v-else class="btn primary-btn br-0" type="button" @click="elements.tabItemEdit = true">
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
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Work Experience</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="company" class="col-sm-4 col-form-label">Company</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="workExperienceData.company" id="company"
                    placeholder="Enter Company Name">
                </div>
              </div>
              <div class="row mb-3">
                <label for="position" class="col-sm-4 col-form-label">Position</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="workExperienceData.position" id="position"
                    placeholder="Enter Position">
                </div>
              </div>
              <div class="row mb-3">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="workExperienceData.start_date" id="start_date">
                </div>
              </div>
              <div class="row mb-3">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="workExperienceData.end_date" id="end_date">
                </div>
              </div>
              <div class="row mb-3">
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
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="updateProfileChildItems(workExperienceData, 'work_experience')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="educationAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Education</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="university" class="col-sm-4 col-form-label">School / College</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.university" id="university"
                    placeholder="Enter School / College Name">
                </div>
              </div>
              <div class="row mb-3">
                <label for="degree" class="col-sm-4 col-form-label">Degree</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.degree" id="degree"
                    placeholder="Enter Degree">
                </div>
              </div>
              <div class="row mb-3">
                <label for="major" class="col-sm-4 col-form-label">Field of Study</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="educationData.major" id="major"
                    placeholder="Enter Field of Study">
                </div>
              </div>
              <div class="row mb-3">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="educationData.start_date" id="start_date">
                </div>
              </div>
              <div class="row mb-3">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="educationData.end_date" id="end_date">
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="updateProfileChildItems(educationData, 'education')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="projectAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ elements.tabItemEdit ? 'Edit' : 'Add' }} Project</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="title" class="col-sm-4 col-form-label">Project Title</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.title" id="title"
                    placeholder="Enter Position">
                </div>
              </div>
              <div class="row mb-3">
                <label for="client" class="col-sm-4 col-form-label">Client</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.client" id="client"
                    placeholder="Enter Company Name">
                </div>
              </div>
              <div class="row mb-3">
                <label for="start_date" class="col-sm-4 col-form-label">Start Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="projectData.start_date" id="start_date">
                </div>
              </div>
              <div class="row mb-3">
                <label for="end_date" class="col-sm-4 col-form-label">End Date</label>
                <div class="col-sm-8">
                  <input type="date" class="form-control" v-model="projectData.end_date" id="end_date">
                </div>
              </div>
              <div class="row mb-3">
                <label for="technology" class="col-sm-4 col-form-label">Technologies</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="projectData.technology" id="technology"
                    placeholder="Enter Technologies used">
                </div>
              </div>
              <div class="row mb-3">
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
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="updateProfileChildItems(projectData, 'project')"
            class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
