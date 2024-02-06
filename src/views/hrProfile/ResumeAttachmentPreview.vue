<script lang="ts" setup>
import HrProfileComponent from '@/views/hrProfile/HrProfile.vue'
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
const props = defineProps({
  id: String
});
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
  { key: 'status_id', label: 'Profile Status' },
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
    <label>Resume View</label>
  </div>
  <div v-loading="isLoading" class="row">
    <div class="col-6">
      <HrProfileComponent :id="props.id" />
    </div>
    <div class="col-6">
      <HrProfileComponent :id="props.id" />
    </div>
  </div>
</template>