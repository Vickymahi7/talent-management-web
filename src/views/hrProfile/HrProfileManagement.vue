<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { formatDate } from '@/utils/dateFormats'
import { PROFILE_STATUS } from '@/utils/constants'
import { getProfileStatusById, bsModalHide, bsModalShow } from '@/utils/commonFunctions'
import type HrProfile from '@/types/HrProfile'
import type { WorkExperience } from '@/types/WorkExperience'
import type { Project } from '@/types/Project'
import type { Education } from '@/types/Education'

export default {
  data() {
    return {
      v$: useVuelidate(),
      toast: useToast(),
      formatDate: formatDate,
      profileStatus: PROFILE_STATUS,
      getProfileStatusById: getProfileStatusById,
      bsModalHide: bsModalHide,
      bsModalShow: bsModalShow,

      isLoading: false,
      isModalLoading: false,
      modalId: '',
      searchText: '',
      status_id: null as null | number,

      editId: null as string | null,
      editKey: null as string | null,
      editValue: null as string | null,

      hrProfile: {
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
        skills: [] as string[],
        work_experience: [] as WorkExperience[],
        project: [] as Project[],
        education: [] as Education[],
      },

      hrProfileList: [] as HrProfile[],
      hrProfileFields: [
        { key: 'select', label: '' },
        { key: 'index', label: 'SN' },
        { key: 'profile_title', label: 'Profile Title' },
        { key: 'first_name', label: 'Resource Name' },
        { key: 'email_id', label: 'Email ID' },
        { key: 'skills', label: 'Skills' },
        { key: 'status_id', label: 'Profile Status', isEditable: true },
        { key: 'last_updated_dt', label: 'Last Updated' },
        { key: 'actions', label: 'Action' },
      ],

      totalRows: 1,
      currentPage: 1,
      perPage: 10,

      dialogParam: {
        id: null as string | number | null,
      },
    }
  },
  computed: {
    pageStart() {
      return (this.currentPage - 1) * this.perPage;
    }
  },
  watch: {
    currentPage() {
      this.getHrProfileList();
    },
  },
  validations() {
    return {
      hrProfile: {
        profile_title: { required },
        email_id: { required, email },
      }
    }
  },
  mounted() {
    this.getHrProfileList();
  },
  methods: {
    async getHrProfileList() {
      try {
        const queryParams = {
          searchText: this.searchText,
          status_id: this.status_id,
          rows: this.perPage,
          start: this.pageStart,
        };
        this.isLoading = true;
        const response: any = await axios.get('/hrprofile/list', { params: queryParams });
        this.hrProfileList = response.hrProfileList;
        this.totalRows = response.numFound;
        this.currentPage = response.numFound > this.perPage ? this.currentPage : 1;
      } catch (error: any) {
        this.toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async addHrProfile() {
      try {
        this.v$.hrProfile.$touch();
        if (!this.v$.hrProfile.$invalid) {
          this.isModalLoading = true;
          const response: any = await axios.post('/hrprofile/add', this.hrProfile);

          console.log(response)
          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            this.getHrProfileList();
            this.bsModalHide(this.modalId);
          }
        }
      } catch (error: any) {
        console.log(error)
        this.toast.error(error.message);
      }
      finally {
        this.isModalLoading = false;
      }
    },
    async updateHrProfile(hrProfileData: any, updateKey: string, updateVal: any) {
      const data: any = {};
      data.id = hrProfileData.id;
      data.hr_profile_id = hrProfileData.hr_profile_id;
      data.user_id = hrProfileData.user_id;
      data.email_id = hrProfileData.email_id;
      data[updateKey] = updateVal;

      try {
        this.isLoading = true;
        const response: any = await axios.patch('/hrprofile/update', data);
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getHrProfileList();
          this.editId = null;
          this.editKey = null;
          this.editValue = null;
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    addSkills(event: any) {
      const skill = event.target.value as string;
      if (!this.hrProfile.skills.includes(skill)) {
        this.hrProfile.skills.push(skill);
        event.target.value = '';
      }
    },
    removeSkill(skill: string) {
      this.hrProfile.skills = this.hrProfile.skills.filter(item => item != skill);
    },
    deleteHrProfile: function (id: string) {
      this.dialogParam.id = id;
    },
    async onYesProfile() {
      try {
        this.isLoading = true;
        const response: any = await axios.delete('/hrprofile/delete/' + this.dialogParam.id)
        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          this.getHrProfileList();
        }

      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isLoading = false;
      }
    },
    skillsToolTip(skills?: string[]) {
      let tooltipText = "";
      if (skills && skills.length > 0) {
        skills.forEach((skill, index) => {
          if (index != 0) {
            tooltipText += ", "
          }
          tooltipText += skill;
        })
      }
      return tooltipText;
    },
    handleTableCellClick(field: any, item: any, event: Event) {
      if (field.isEditable) {
        event.stopPropagation();
        this.editId = item.id;
        this.editKey = field.key;
        this.editValue = item[field.key];
      }
    },
    cancelInlineEdit(item: any, field: any) {
      item[field.key] = this.editValue;

      this.editId = null;
      this.editKey = null;
      this.editValue = null;
      this.getHrProfileList();
    }
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>HR Profile Management</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card">
    <div class="row filter-group py-2">
      <div class="col-3">
        <input type="text" v-model="searchText" class="form-control" @keyup.enter="getHrProfileList"
          placeholder="Search Profile Title, Email, Skill, Summary" aria-label="Search">
      </div>
      <div class="col-2">
        <select v-model="status_id" @change="getHrProfileList" class="form-select" aria-label="Default select example">
          <option :value="null">Profile Status</option>
          <option v-for="status in profileStatus" :key="status.id" :value="status.id">{{ status.status }}</option>
        </select>
      </div>
      <div class="col text-end">
        <button class="btn primary-btn mx-2" type="button"
          @click="bsModalShow('hrProfileAddEditModal'); modalId = 'hrProfileAddEditModal'">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New Resource
        </button>
        <button class="btn primary-btn" type="button">
          <font-awesome-icon class="me-2" icon="fa-solid fa-upload" />
          Resource Excel Import
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-dark">
          <tr>
            <th scope="col" v-for="field in hrProfileFields" :key="field.key">{{ field.label }}</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id"
            @click="$router.push({ name: 'hrprofile', params: { id: hrProfile.id } })">
            <td v-for="field in hrProfileFields" :key="field.key" @click="handleTableCellClick(field, hrProfile, $event)"
              :class="{ 'clickable-cell': field.isEditable }">
              <!-- @click.stop=" -->
              <template v-if="field.key == 'select'">
                <input class="form-check-input" type="checkbox">
              </template>
              <template v-else-if="field.key == 'index'">
                {{ index + 1 }}
              </template>
              <template v-else-if="field.key == 'first_name'">
                {{ hrProfile.first_name }} {{ hrProfile.last_name }}
              </template>
              <template v-else-if="field.key == 'skills'">
                <div class="text-truncate table-th-width" :title="skillsToolTip(hrProfile.skills)">
                  <span v-for="skill, index in hrProfile.skills" :key="index">{{ skill }}<span
                      v-if="hrProfile.skills && index < hrProfile.skills.length - 1">,
                    </span>
                  </span>
                </div>
              </template>
              <template v-else-if="field.key == 'status_id'">

                <select v-if="editId == hrProfile.id && editKey == field.key" class="form-select form-control-sm"
                  v-model="hrProfile[field.key]" @change="updateHrProfile(hrProfile, field.key, hrProfile[field.key])"
                  @blur="cancelInlineEdit(hrProfile, field.key)" :aria-label="field.label">
                  <option :value="null">Select</option>
                  <option v-for="status in profileStatus" :key="status.id" :value="status.id">{{ status.status }}
                  </option>
                </select>
                <span v-else>{{ getProfileStatusById(hrProfile.status_id) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDate(hrProfile.last_updated_dt) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div class="icon-btn me-3">
                  <font-awesome-icon icon="fa-solid fa-paperclip" />
                </div>
                <div class="icon-btn me-3">
                  <font-awesome-icon icon="fa-solid fa-download" />
                </div>
                <div class="icon-btn me-3" @click.stop="deleteHrProfile(hrProfile.id!)" title="Delete Profile"
                  data-bs-toggle="modal" data-bs-target="#deleteHrProfile">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </template>
              <template v-else>
                {{ hrProfile[field.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BPagination v-if="hrProfileList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
      size="sm" />
  </div>
  <div class="modal fade" id="hrProfileAddEditModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
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
          <button type="button" @click="addHrProfile" class="btn primary-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
  <dialog-component id="deleteHrProfile" :onYes="onYesProfile" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete profile?" />
</template>