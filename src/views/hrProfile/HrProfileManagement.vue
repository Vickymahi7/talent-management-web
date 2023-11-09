<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
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

      hrProfileList: [],
    }
  },
  validations() {
    return {
      hrProfile: {
        email_id: { required, email }
      }
    }
  },
  mounted() {
    this.getHrProfileList();
  },
  methods: {
    async getHrProfileList() {
      try {
        const response = await axios.get('/hrprofile/list');
        let result = response.data;
        this.hrProfileList = result.hrProfileList;
      } catch (error) {
        console.log(error);
      }
    },
    async addHrProfile() {
      try {
        this.v$.hrProfile.$touch();
        if (!this.v$.hrProfile.$invalid) {
          const response = await axios.post('/hrprofile/add', this.hrProfile);
          let result = response.data;
          console.log(result);

          if (response.status == 201) {
            this.getHrProfileList();
          }
        }
      } catch (error) {
        console.log(error)
      }
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
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>HR Profile Management</label>
  </div>
  <div class="content-body content-card">
    <div class="row py-2">
      <div class="col-3">
        <input type="text" class="form-control" placeholder="Type Something" aria-label="Search">
      </div>
      <div class="col-2">
        <select class="form-select" aria-label="Default select example">
          <option value="">Resource Type</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="col-2">
        <select class="form-select" aria-label="Default select example">
          <option value="">Resource Type</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="col text-end">
        <button class="btn primary-btn mx-2" type="button" data-bs-toggle="modal" data-bs-target="#hrProfileAddEditModal">
          <font-awesome-icon class="me-2" :icon="['fas', 'plus-circle']" />
          New Resource
        </button>
        <button class="btn primary-btn" type="button">
          <font-awesome-icon class="me-2" :icon="['fas', 'upload']" />
          Resource Excel Import
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-dark">
          <tr>
            <th scope="col">
              <input class="form-check-input" type="checkbox">
            </th>
            <th scope="col">ID</th>
            <th scope="col">Resource Name</th>
            <th scope="col">Position</th>
            <th scope="col">Resource Type</th>
            <th scope="col">Email ID</th>
            <th scope="col">Profile Status</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id"
            @click="$router.push({ name: 'hrprofile', params: { id: hrProfile.id } })">
            <td>
              <input class="form-check-input" type="checkbox">
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ hrProfile.first_name }} {{ hrProfile.last_name }}</td>
            <td>{{ hrProfile.position }}</td>
            <td>{{ hrProfile.resource_type }}</td>
            <td>{{ hrProfile.email_id }}</td>
            <td>{{ hrProfile.active ? 'Active' : 'Inactive' }}</td>
            <td>{{ hrProfile.last_updated_dt }}</td>
            <td>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'paperclip']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'download']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="modal fade" id="hrProfileAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New Resource</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <form>
              <div class="row mb-3">
                <label for="first_name" class="col-sm-4 col-form-label">First Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.first_name" id="first_name"
                    placeholder="Enter First Name">
                </div>
              </div>
              <div class="row mb-3">
                <label for="last_name" class="col-sm-4 col-form-label">Last Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.last_name" id="last_name"
                    placeholder="Enter Last Name">
                </div>
              </div>
              <div class="row mb-3">
                <label for="email_id" class="col-sm-4 col-form-label">Email Id</label>
                <div class="col-sm-8">
                  <input type="email" class="form-control" v-model="hrProfile.email_id" id="email_id"
                    :class="{ 'is-invalid': v$.hrProfile.email_id.$error }" placeholder="Enter Email Id">
                  <div class="invalid-feedback" v-for="error of v$.hrProfile.email_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="mobile" class="col-sm-4 col-form-label">Contact Number</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="hrProfile.mobile" id="mobile"
                    placeholder="Enter Contact Number">
                </div>
              </div>
              <div class="row mb-3">
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
              <div class="row mb-3">
                <label for="skills" class="col-sm-4 col-form-label">Skills</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" @keyup.enter.prevent="addSkills" id="skills"
                    placeholder="Enter Skills">
                  <div class="mt-2">
                    <span v-for="skill, index in hrProfile.skills" :key="index" class="badge bg-primary me-1 py-2">
                      <span class="pr-2">{{ skill }}</span>
                      <a href="#" class="p-2" @click="removeSkill(skill)">x</a></span>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="resumeInput" class="col-sm-4 col-form-label">Resume Attachment</label>
                <div class="col-sm-6">
                  <input type="file" class="form-control" id="resumeInput" placeholder="Add Resume Attachment">
                </div>
                <div class="col-sm-2">
                  <button type="button" class="btn btn-primary">Upload</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button> -->
          <button type="button" @click="addHrProfile" class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>