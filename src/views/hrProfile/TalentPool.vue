<script lang="ts" setup>
import ResumePreviewModal from '@/components/modals/ResumePreviewModal.vue'
import axios from '@/plugins/axios'
import type HrProfile from '@/types/HrProfile'
import type { Skill } from '@/types/Skill'
import type { Tenant } from '@/types/Tenant'
import { PROFILE_STATUS } from '@/utils/constants'
import { formatDateTime } from '@/utils/dateFormats'
import { ProfileStatus } from '@/utils/enums'
import { useCommonFunctions } from '@/utils/useCommonFunctions'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast();
const commonFunctions = useCommonFunctions();

const scrollerRef = ref(null as InstanceType<typeof HTMLElement> | null);
const isLoading = ref(false);
const searchText = ref('');
const status_id = ref([] as number[]);

const hrProfilePreviewData = ref(null as null | HrProfile);
const hrProfileList = ref([] as HrProfile[]);
const tenant = ref({} as Tenant);

const totalRows = ref(1);
const currentPage = ref(1);
const perPage = ref(15);

const hrProfileFields = [
  { key: 'index', label: 'SN' },
  { key: 'profile_title', label: 'Profile Title' },
  { key: 'first_name', label: 'Resource Name' },
  { key: 'email_id', label: 'Email ID' },
  { key: 'skills', label: 'Skills' },
  { key: 'status_id', label: 'Profile Status', isEditable: true },
  { key: 'last_updated_dt', label: 'Last Updated' },
  { key: 'actions', label: 'Action' },
];

const pageStart = computed(() => {
  return (currentPage.value - 1) * perPage.value;
});

const filteredProfileStatus = computed(() => {
  return PROFILE_STATUS.filter(data => data.id != ProfileStatus.DRAFT);
});

// watch: {
//   currentPage() {
//     this.getHrProfileList();
//   },
// };
onMounted(() => {
  getUpdatedHrProfileList();
  getTenantSettings();
});

const getUpdatedHrProfileList = () => {
  totalRows.value = 1;
  currentPage.value = 1;
  hrProfileList.value = [];
  getHrProfileList();
};

const getHrProfileList = async () => {
  try {
    const queryParams = {
      searchText: searchText.value,
      status_id: status_id.value,
      rows: perPage.value,
      start: pageStart.value,
    };
    isLoading.value = true;
    const response: any = await axios.get('/hrprofile/talentpool/list', { params: queryParams });
    hrProfileList.value = hrProfileList.value.concat(response.hrProfileList);
    totalRows.value = response.total;
    currentPage.value = response.total > perPage.value ? currentPage.value : 1;
  } catch (error: any) {
    toast.error(error.message);
  } finally {
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

const skillsToolTip = (skills?: Skill[]) => {
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

const handleScroll = (refName: string, isNotLoading: boolean, callback: Function) => {
  // Trigger fetchData when scrolling near the bottom of the container
  if (scrollerRef.value && scrollerRef.value.scrollTop + scrollerRef.value.clientHeight >= scrollerRef.value.scrollHeight - 20 && isNotLoading && hrProfileList.value.length < totalRows.value) {
    currentPage.value++;
    callback();
  }
};
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Talent Pool</label>
  </div>
  <div v-loading="isLoading" class="content-body content-card"
    @scroll="handleScroll('scrollerRef', !isLoading, getHrProfileList)" ref="scrollerRef">
    <div class="row filter-group py-2 align-items-center">
      <div class="col-3">
        <input type="text" v-model="searchText" class="form-control" @keyup.enter="getUpdatedHrProfileList"
          placeholder="Search Profile Title, Email, Skill, Summary" aria-label="Search">
      </div>
      <div class="col">
        <!-- <div class="form-check form-check-inline mb-0">``
          <input class="form-check-input" v-model="status_id" type="checkbox" name="profileStatusOptions"
            id="inlineRadioStatusAll" :value="null" @change="getHrProfileList">
          <label class="form-check-label" for="inlineRadioStatusAll">All</label>
        </div> -->
        <div v-for="status in filteredProfileStatus" :key="status.id" class="form-check form-check-inline mb-0">
          <input class="form-check-input" v-model="status_id" type="checkbox" :id="'inlineRadio' + status.id"
            :value="status.id" @change="getUpdatedHrProfileList">
          <label class="form-check-label" :for="'inlineRadio' + status.id">{{ status.status }}</label>
        </div>
        <!-- <select v-model="status_id" @change="getHrProfileList" class="form-select" aria-label="Default select example">
          <option :value="null">Profile Status</option>
          <option v-for="status in profileStatus" :key="status.id" :value="status.id">{{ status.status }}</option>
        </select> -->
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
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id">
            <td v-for="field in hrProfileFields" :key="field.key">
              <template v-if="field.key == 'index'">
                {{ index + 1 }}
              </template>
              <template v-else-if="field.key == 'first_name'">
                {{ hrProfile.first_name }} {{ hrProfile.last_name }}
              </template>
              <template v-else-if="field.key == 'skills'">
                <div class="text-truncate table-th-width" :title="skillsToolTip(hrProfile.skills)">
                  <span v-for="_skill, index in hrProfile.skills" :key="index">{{ _skill.skill }}<span
                      v-if="hrProfile.skills && index < hrProfile.skills.length - 1">,
                    </span>
                  </span>
                </div>
              </template>
              <template v-else-if="field.key == 'status_id'">
                <span>{{ commonFunctions.getProfileStatusById(hrProfile.status_id) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDateTime(hrProfile.last_updated_dt) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div class="icon-btn" data-bs-toggle="modal" data-bs-target="#resumePreviewModal"
                  @click="hrProfilePreviewData = hrProfile">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </div>
              </template>
              <template v-else>
                {{ hrProfile[field.key] }}
              </template>
            </td>
          </tr>
          <tr v-if="hrProfileList.length == 0">
            <td colspan="12" class="text-center"> No record found </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResumePreviewModal :hrProfile="hrProfilePreviewData!" :tenantSettings="tenant" />
</template>