<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { HttpStatusCode } from 'axios'
import { UserTypeId } from '@/utils/enums';
import { formatDate } from '@/utils/dateFormats'
import { PROFILE_STATUS } from '@/utils/constants'
import { getProfileStatusById, bsModalHide, bsModalShow } from '@/utils/commonFunctions'
import type HrProfile from '@/types/HrProfile'
import type { WorkExperience } from '@/types/WorkExperience'
import type { Project } from '@/types/Project'
import type { Education } from '@/types/Education'
import HrProfileComponent from "@/views/hrProfile/HrProfile.vue";
import AddHrProfileModal from "@/components/modals/AddHrProfileModal.vue";
import { useMsal } from "../../composables/useMsal";
import { loginRequest } from "../../utils/authConfig";
import { BrowserAuthError, InteractionRequiredAuthError } from '@azure/msal-browser'
import { Modal } from 'bootstrap'

export default {
  components: {
    HrProfileComponent,
    AddHrProfileModal,
  },
  setup() {
  },
  data() {
    return {
      instance: useMsal().instance,
      v$: useVuelidate(),
      toast: useToast(),
      formatDate: formatDate,
      profileStatus: PROFILE_STATUS,
      getProfileStatusById: getProfileStatusById,
      bsModalHide: bsModalHide,
      bsModalShow: bsModalShow,
      UserTypeId: UserTypeId,

      isLoading: false,
      isModalLoading: false,
      showInviteUserModal: false,
      modalId: '',
      searchText: '',
      status_id: null as null | number,

      editId: null as string | null,
      editKey: null as string | null,
      editValue: null as string | null,

      accessToken: null as string | null,
      hrProfileId: '',

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
    },
    userTypeId() {
      const userTypeId
        = localStorage.getItem("userTypeId");
      return userTypeId ? parseInt(userTypeId) : null;
    },
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
  beforeUnmount() {
    this.hideModal('hrProfileModal');
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

          if (response.status == HttpStatusCode.Created) {
            this.toast.success(response.message);
            this.getHrProfileList();
            this.bsModalHide(this.modalId);
          }
        }
      } catch (error: any) {
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
    handleTableRowClick(modalId: string, hrProfileId: string) {
      if (this.userTypeId == UserTypeId.USR) {
        this.$router.push({ name: 'hrprofile', params: { id: hrProfileId } });
      }
      else {
        this.hrProfileId = hrProfileId;
        this.showModal(modalId);
      }
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
    },
    async loginPopup() {
      // await this.instance.loginPopup(loginRequest);
      this.getGraphData()
    },
    async getGraphData() {
      this.isLoading = true;
      const response = await this.instance.acquireTokenSilent({
        ...loginRequest
      }).catch(async (e) => {
        if (e instanceof InteractionRequiredAuthError || e instanceof BrowserAuthError) {
          // await this.instance.acquireTokenRedirect(loginRequest);
          await this.instance.loginPopup(loginRequest);
          this.loginPopup();
        }
        else {
          throw e;
        }
      }).finally(() => {
        this.isLoading = false;
      });
      if (response?.accessToken) {
        this.accessToken = response.accessToken;
        this.showInviteUserModal = true;
        this.$nextTick(() => {
          this.showModal('inviteAdUsersModal');
        })
      }
    },
    showModal(modalId: string) {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) return;
      const modal = Modal.getOrCreateInstance(modalEl!, {
        keyboard: false
      })
      modal.show();
    },
    hideModal(modalId: string) {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) return;
      const modal = Modal.getOrCreateInstance(modalEl!, {
        keyboard: false
      })
      modal.hide();
    },
  }
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
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
        <button class="btn btn-primary" type="button"
          @click="bsModalShow('addHrProfileModal-profileManage'); modalId = 'addHrProfileModal-profileManage'">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New Profile
        </button>
        <button v-if="userTypeId != UserTypeId.USR" class="btn btn-primary ms-2" type="button" @click="loginPopup">
          <font-awesome-icon class="me-2" icon="fa-solid fa-upload" />
          Profile Excel Import
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-primary">
          <tr>
            <th scope="col" v-for="field in hrProfileFields" :key="field.key">{{ field.label }}</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id"
            @click="handleTableRowClick('hrProfileModal', hrProfile.id!)">
            <!-- @click="$router.push({ name: 'hrprofile', params: { id: hrProfile.id } })"> -->
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
  <AddHrProfileModal id="addHrProfileModal-profileManage" />
  <dialog-component id="deleteHrProfile" :onYes="onYesProfile" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete profile?" />
  <InviteAdUsersModal v-if="showInviteUserModal" :accessToken="accessToken!" />
  <div class="modal fade" id="hrProfileModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div v-loading="isModalLoading" class="modal-content">
        <!-- <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div> -->
        <div class="modal-body profile-modal">
          <HrProfileComponent :id="hrProfileId" :key="hrProfileId" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>