<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: ['id'],
  data() {
    return {
      elements: {
        primaryInfoEdit: false,
        contactInfoEdit: false,
        aboutInfoEdit: false,
      },

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
  mounted() {
    this.getHrProfile();
  },
  methods: {
    async getHrProfile() {
      try {
        const response = await axios.get('/hrprofile/view/' + this.id);
        let result = response.data;
        this.hrProfile = result.hrProfile;
      } catch (error) {
        console.log(error);
      }
    },
    async updateHrProfile(data) {
      data.id = this.hrProfile.id;
      data.hr_profile_id = this.hrProfile.hr_profile_id;
      data.user_id = this.hrProfile.user_id;

      try {
        this.v$.hrProfile.$touch();
        if (!this.v$.hrProfile.$invalid) {
          const response = await axios.put('/hrprofile/update', data);
          let result = response.data;
          console.log(result);

          if (response.status == 200) {
            this.getHrProfile();
            this.elements.primaryInfoEdit = false;
            this.elements.contactInfoEdit = false;
            this.elements.aboutInfoEdit = false;
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    primaryInfoUpdate() {
      const data = {
        email_id: this.hrProfile.email_id,

        location: this.hrProfile.location,
        ctc: this.hrProfile.ctc,
      }

      this.updateHrProfile(data);
    },
    contactInfoUpdate() {
      const data = {
        email_id: this.hrProfile.email_id,
        status: this.hrProfile.status,
        mobile: this.hrProfile.mobile,
        linkedin_id: this.hrProfile.linkedin_id,
      }

      this.updateHrProfile(data);
    },
    aboutInfoUpdate() {
      const data = {
        email_id: this.hrProfile.email_id,
        objective: this.hrProfile.objective,
      }

      this.updateHrProfile(data);
    }
  }
}
</script>
<template>
  <div class="d-flex">
    <div class="content-card content-header">
      <label>Manage HR Profile</label>
    </div>
    <button class="btn primary-btn ms-2" type="button">
      <font-awesome-icon class="me-2" :icon="['fas', 'download']" />
      Resume Preview
    </button>
  </div>
  <div class="content-body profile-section">
    <div class="profile-head">
      <div class="profile-media content-card">
        <img class="profile-picture" src="@/assets/img/user-icon.jpg" alt="Profile Picture" width="150" height="150" />
        <div class="title-block">
          <p class="title-text">{{ hrProfile.first_name }} {{ hrProfile.last_name }}</p>
          <p>--position--</p>
        </div>
      </div>
      <div class="profile-prime-info content-card">
        <div class="profile-container">
          <div class="profile-edit-icon">
            <span v-if="elements.primaryInfoEdit" class="icon-btn" @click="primaryInfoUpdate">
              <font-awesome-icon :icon="['fas', 'check']" />
            </span>
            <span v-else class="icon-btn" @click="elements.primaryInfoEdit = true" title="Update">
              <font-awesome-icon :icon="['fas', 'pencil-alt']" />
            </span>
          </div>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <p class="label-text">Years of Experience</p>
              </div>
              <div class="col-lg-6">
                <p>--experience--</p>
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col-lg-6">
                <p class="label-text">CTC</p>
              </div>
              <div class="col-lg-6">
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.ctc">
                <p v-else>{{ hrProfile.ctc }}</p>
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col-lg-6">
                <p class="label-text">Location</p>
              </div>
              <div class="col-lg-6">
                <input v-if="elements.primaryInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.location">
                <p v-else>{{ hrProfile.location }}</p>
              </div>
            </div>
            <div class="separator my-3"></div>
            <div class="row align-items-center g-0">
              <div class="col-6">
                <p class="label-text">
                  <span class="icon-btn me-1">
                    <font-awesome-icon :icon="['fas', 'paperclip']" />
                  </span>
                  --resume name--
                </p>
              </div>
              <div class="col-6 text-end">
                <button class="btn primary-btn me-2 br-0" type="button">
                  Upload
                </button>
                <button class="btn primary-btn br-0" type="button">
                  Show
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-container">
          <div class="profile-edit-icon">
            <span v-if="elements.contactInfoEdit" class="icon-btn" @click="contactInfoUpdate">
              <font-awesome-icon :icon="['fas', 'check']" />
            </span>
            <span v-else class="icon-btn" @click="elements.contactInfoEdit = true">
              <font-awesome-icon :icon="['fas', 'pencil-alt']" />
            </span>
          </div>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <p class="label-text">Profile Status</p>
              </div>
              <div class="col-lg-6">
                <input v-if="elements.contactInfoEdit" type="text" class="form-control form-control-sm"
                  v-model="hrProfile.status">
                <p v-else>{{ hrProfile.status }}</p>
              </div>
            </div>
            <div class="row align-items-center mb-2">
              <div class="col-lg-6">
                <p class="label-text">Last Updated</p>
              </div>
              <div class="col-lg-6">
                <p>{{ hrProfile.last_updated_dt }}</p>
              </div>
            </div>
            <div class="d-flex align-items-center mb-1 ">
              <span>
                <span class="icon-btn me-2">
                  <font-awesome-icon :icon="['fas', 'envelope']" />
                </span>
              </span>
              <input v-if="elements.contactInfoEdit" type="text" class="form-control form-control-sm"
                v-model="hrProfile.email_id" />
              <p v-else class="label-text d-inline-block">
                {{ hrProfile.email_id }}
              </p>
            </div>
            <div class="d-flex align-items-center mb-1">
              <span>
                <span class="icon-btn me-2">
                  <font-awesome-icon :icon="['fas', 'phone']" />
                </span>
              </span>
              <input v-if="elements.contactInfoEdit" type="text" class="form-control form-control-sm"
                v-model="hrProfile.mobile">
              <p v-else class="label-text d-inline-block">
                {{ hrProfile.mobile }}
              </p>
            </div>
            <div class="d-flex align-items-center mb-1">
              <span>
                <span class="icon-btn me-2">
                  <font-awesome-icon :icon="['fab', 'linkedin']" />
                </span>
              </span>
              <input v-if="elements.contactInfoEdit" type="text" class="form-control form-control-sm"
                v-model="hrProfile.linkedin_id">
              <p v-else class="label-text d-inline-block">
                {{ hrProfile.linkedin_id }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-body">
      <div class="profile-description">
        <div class="content-card flex-fill">
          <h6 class="label-text mb-2">About
            <span v-if="elements.aboutInfoEdit" class="icon-btn float-end" @click="aboutInfoUpdate">
              <font-awesome-icon :icon="['fas', 'check']" />
            </span>
            <span v-else class="icon-btn float-end" @click="elements.aboutInfoEdit = true">
              <font-awesome-icon :icon="['fas', 'pencil-alt']" />
            </span>
          </h6>
          <textarea v-if="elements.aboutInfoEdit" v-model="hrProfile.objective" name="" id="" class="form-control"
            rows="2"></textarea>
          <p v-else class="profile-short-content">
            {{ hrProfile.objective }}
          </p>
        </div>
        <div class="content-card flex-fill">
          <h6 class="label-text">Skills
            <span class="icon-btn float-end">
              <font-awesome-icon :icon="['fas', 'pencil-alt']" />
            </span>
          </h6>
          <p class="profile-short-content">
            <span v-for="skill, index in hrProfile.skills" :key="index"
              class="badge bg-green fw-normal color-light me-1">{{ skill
              }}</span>
          </p>
        </div>
        <div class="content-card flex-fill">
          <h6 class="label-text">Note
            <!-- <span class="icon-btn float-end">
              <font-awesome-icon :icon="['fas', 'pencil-alt']" />
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
              <div class="list-item">
                <p>Summary</p>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-experience" role="tabpanel" aria-labelledby="nav-experience-tab">
            <div class="content-list">
              <template v-if="hrProfile.work_experience.length > 0">
                <div v-for="work_experience, index in hrProfile.work_experience" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ work_experience.company }}</p>
                    <p>{{ work_experience.position }}</p>
                    <p>{{ work_experience.start_date }} {{ work_experience.end_date }} | {{ work_experience.location }}.
                    </p>
                  </div>
                  <div class="text-end">
                    <span class="icon-btn me-2">
                      <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                    </span>
                    <span class="icon-btn">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </span>
                  </div>
                </div>
              </template>
              <div v-else class="list-item">
                <p>No record found</p>
              </div>
              <div class="py-3">
                <button class="btn primary-btn br-0" type="button">
                  Add Work Experience
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-education" role="tabpanel" aria-labelledby="nav-education-tab">
            <div class="content-list">
              <template v-if="hrProfile.education.length > 0">
                <div v-for="education, index in hrProfile.education" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ education.degree }} - {{ education.major }}</p>
                    <p>{{ education.university }}</p>
                    <p>{{ education.start_date }} - {{ education.end_date }} | {{ education.location }}.</p>
                  </div>
                  <div class="text-end">
                    <span class="icon-btn me-2">
                      <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                    </span>
                    <span class="icon-btn">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </span>
                  </div>
                </div>
              </template>
              <div v-else class="list-item">
                <p>No record found</p>
              </div>
              <div class="py-3">
                <button class="btn primary-btn br-0" type="button">
                  Add Education
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-project" role="tabpanel" aria-labelledby="nav-project-tab">
            <div class="content-list">
              <template v-if="hrProfile.project.length > 0">
                <div v-for="project, index in hrProfile.project" :key="index" class="list-item">
                  <div>
                    <p class="label-text">{{ project.title }}</p>
                    <p>Client: {{ project.client }}</p>
                    <p>{{ project.start_date }} - {{ project.end_date }}.</p>
                    <p>Technologies: {{ project.technology }}</p>
                  </div>
                  <div class="text-end">
                    <span class="icon-btn me-2">
                      <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                    </span>
                    <span class="icon-btn">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </span>
                  </div>
                </div>
              </template>
              <div v-else class="list-item">
                <p>No Projects found</p>
              </div>
              <div class="py-3">
                <button class="btn primary-btn br-0" type="button">
                  Add Project
                </button>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-personal" role="tabpanel" aria-labelledby="nav-profile-tab">
            <div class="content-list">
              <div class="list-item">
                <p>Personal Details</p>
              </div>
              <!-- <div class="list-item">
                <div>
                  <p class="label-text">TCS</p>
                  <p>Graphic Designer</p>
                  <p>Oct 2014 - July 2015 | Bangalore, India.</p>
                </div>
                <div class="text-end">
                  <span class="icon-btn me-2">
                    <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                  </span>
                  <span class="icon-btn">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </span>
                </div>
              </div> -->
            </div>
          </div>
          <div class="tab-pane fade" id="nav-doc" role="tabpanel" aria-labelledby="nav-doc-tab">
            <div class="content-list">
              <!-- <div class="list-item">
                <div>
                  <p class="label-text">Adhaar Card</p>
                </div>
                <div class="text-end">
                  <span class="icon-btn me-2">
                    <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                  </span>
                  <span class="icon-btn">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </span>
                </div>
              </div> -->
              <div class="list-item">
                <p>No Document found</p>
              </div>
              <div class="py-3">
                <button class="btn primary-btn br-0" type="button">
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
