<script lang="ts">
import ResumePreviewModal from '@/components/modals/ResumePreviewModal.vue'
import axios from '@/plugins/axios'
import type HrProfile from '@/types/HrProfile'
import type { Skill } from '@/types/Skill'
import { PROFILE_STATUS } from '@/utils/constants'
import { formatDateTime } from '@/utils/dateFormats'
import { useCommonFunctions } from '@/utils/useCommonFunctions'
import { useToast } from 'vue-toastification'

export default {
  components: {
    ResumePreviewModal,
  },
  data() {
    return {
      toast: useToast(),
      commonFunctions: useCommonFunctions(),
      formatDateTime: formatDateTime,
      profileStatus: PROFILE_STATUS,

      isLoading: false,
      isModalLoading: false,
      hrProfileEdit: false,
      modalId: '',
      searchText: '',
      status_id: null as null | number,

      hrProfilePreviewData: null as null | HrProfile,
      hrProfileList: [] as HrProfile[],

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
        this.totalRows = response.total;
        this.currentPage = response.total > this.perPage ? this.currentPage : 1;
      } catch (error: any) {
        this.toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    skillsToolTip(skills?: Skill[]) {
      let tooltipText = "";
      if (skills && skills.length > 0) {
        skills.forEach((_skill, index) => {
          if (index != 0) {
            tooltipText += ", "
          }
          tooltipText += _skill.skill;
        })
      }
      return tooltipText;
    }
  }
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Talent Pool</label>
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
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-primary">
          <tr>
            <th scope="col">
              <input class="form-check-input" type="checkbox">
            </th>
            <th scope="col">ID</th>
            <th scope="col">Profile Title</th>
            <th scope="col">Resource Name</th>
            <th scope="col">Email ID</th>
            <th scope="col">Skills</th>
            <th scope="col">Profile Status</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id">
            <!-- @click="$router.push({ name: 'hrprofile', params: { id: hrProfile.id } })" -->
            <td>
              <input class="form-check-input" type="checkbox">
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ hrProfile.profile_title }}</td>
            <td>{{ hrProfile.first_name }} {{ hrProfile.last_name }}</td>
            <td>{{ hrProfile.email_id }}</td>
            <td>
              <div class="text-truncate table-th-width" :title="skillsToolTip(hrProfile.skills)">
                <span v-for="skill, index in hrProfile.skills" :key="index">{{ skill }}<span
                    v-if="hrProfile.skills && index < hrProfile.skills.length - 1">,
                  </span>
                </span>
              </div>
            </td>
            <td>{{ commonFunctions.getProfileStatusById(hrProfile.status_id) }}</td>
            <td>{{ formatDateTime(hrProfile.last_updated_dt) }}</td>
            <td>
              <div class="icon-btn" data-bs-toggle="modal" data-bs-target="#resumePreviewModal"
                @click="hrProfilePreviewData = hrProfile">
                <font-awesome-icon icon="fa-solid fa-eye" />
              </div>
            </td>
          </tr>
          <tr v-if="hrProfileList.length == 0">
            <td colspan="12" class="text-center"> No record found </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BPagination v-if="hrProfileList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
      size="sm" />
  </div>
  <ResumePreviewModal :hrProfile="hrProfilePreviewData" />
</template>