<script lang="ts" setup>
import AddHrProfileModal from "@/components/modals/AddHrProfileModal.vue";
import axios from '@/plugins/axios';
import type HrProfile from '@/types/HrProfile';
import type { Skill } from "@/types/Skill";
import { PROFILE_STATUS } from '@/utils/constants';
import { formatDateTime } from '@/utils/dateFormats';
import { UserTypeId } from '@/utils/enums';
import { useCommonFunctions } from '@/utils/useCommonFunctions';
import { HttpStatusCode } from 'axios';
import { Modal } from 'bootstrap';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const commonFunctions = useCommonFunctions();
const router = useRouter();

const addHrProfileModalRef = ref(null as InstanceType<typeof AddHrProfileModal> | null);
const scrollerRef = ref(null as InstanceType<typeof HTMLElement> | null);

const isLoading = ref(false);
const isModalLoading = ref(false);
const searchText = ref('');
const status_id = ref([] as number[]);

const hrProfileId = ref('');

const hrProfile = ref({} as HrProfile);
const hrProfileList = ref([] as HrProfile[]);
const hrProfileFields = [
  // { key: 'select', label: '' },
  { key: 'index', label: 'SN' },
  { key: 'profile_title', label: 'Profile Title' },
  { key: 'first_name', label: 'Resource Name' },
  { key: 'email_id', label: 'Email ID' },
  { key: 'skills', label: 'Skills' },
  { key: 'status_id', label: 'Profile Status', isEditable: true },
  { key: 'last_updated_dt', label: 'Last Updated' },
  { key: 'actions', label: 'Action' },
];

const totalRows = ref(1);
const currentPage = ref(1);
const perPage = ref(15);

const dialogParam = ref({
  id: null as string | number | null,
});

const pageStart = computed(() => {
  return (currentPage.value - 1) * perPage.value;
})
const userTypeId = computed(() => {
  const userTypeId
    = localStorage.getItem("userTypeId");
  return userTypeId ? parseInt(userTypeId) : null;
})

onMounted(() => {
  getUpdatedHrProfileList();
});

// onBeforeUnmount(() => {
//   hideModal('hrProfileModal');
// });

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
    const response: any = await axios.get('/hrprofile/list', { params: queryParams });
    hrProfileList.value = hrProfileList.value.concat(response.hrProfileList);
    totalRows.value = response.total;
    currentPage.value = response.total > perPage.value ? currentPage.value : 1;
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
const deleteHrProfile = (id: string) => {
  dialogParam.value.id = id;
}
const onYesProfile = async () => {
  try {
    isLoading.value = true;
    const response: any = await axios.delete('/hrprofile/delete/' + dialogParam.value.id)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUpdatedHrProfileList();
    }

  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}
const duplicateProfile = (_hrProfile: HrProfile) => {
  hrProfile.value = _hrProfile;
};
const onYesDuplicateProfile = async () => {
  let existingProfileTitle = hrProfile.value.profile_title;
  try {
    hrProfile.value.profile_title = commonFunctions.duplicateProfileTitle(hrProfile.value.profile_title);
    hrProfile.value.is_current_user = false;

    isModalLoading.value = true;
    const response: any = await axios.post('/hrprofile/add', hrProfile.value);

    if (response.status == HttpStatusCode.Created) {
      toast.success(response.message);
      getUpdatedHrProfileList();
    }
  } catch (error: any) {
    toast.error(error.message);
    hrProfile.value.profile_title = existingProfileTitle;
  }
  finally {
    isModalLoading.value = false;
  }
}
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
const handleTableRowClick = (modalId: string, _hrProfileId: string) => {
  if (userTypeId.value == UserTypeId.USR) {
    router.push({ name: 'hrprofile', params: { id: _hrProfileId } });
  }
  else {
    hrProfileId.value = _hrProfileId;
    // showModal(modalId);
    openHrProfileModal();
  }
}
const showResumePreview = (_hrProfile: HrProfile) => {
  hrProfile.value = _hrProfile;
  nextTick(() => {
    showModal('profileResumePreviewModal');
  })
}
const showAddProfileModal = () => {
  addHrProfileModalRef.value?.showModal();
}
const showModal = (modalId: string) => {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.show();
}

const handleScroll = (refName: string, isNotLoading: boolean, callback: Function) => {
  // Trigger fetchData when scrolling near the bottom of the container
  if (scrollerRef.value && scrollerRef.value.scrollTop + scrollerRef.value.clientHeight >= scrollerRef.value.scrollHeight - 20 && isNotLoading && hrProfileList.value.length < totalRows.value) {
    currentPage.value++;
    callback();
  }
};

function openHrProfileModal() {
  router.push({ name: 'hrprofile', params: { id: hrProfileId.value } });
  // showHrProfileModal.value = true;
  // nextTick(() => {
  //   if (hrProfileModalRef.value) {
  //     hrProfileModalRef.value.toggle();
  //   }
  // })
}
</script>
<template>
  <div class="content-card content-header card-gap-mb">
    <label>Profile Management</label>
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
        <div v-for="status in PROFILE_STATUS" :key="status.id" class="form-check form-check-inline mb-0">
          <input class="form-check-input" v-model="status_id" type="checkbox" :id="'inlineRadio' + status.id"
            :value="status.id" @change="getUpdatedHrProfileList">
          <label class="form-check-label" :for="'inlineRadio' + status.id">{{ status.status }}</label>
        </div>
        <!-- <select v-model="status_id" @change="getHrProfileList" class="form-select" aria-label="Default select example">
          <option :value="null">Profile Status</option>
          <option v-for="status in profileStatus" :key="status.id" :value="status.id">{{ status.status }}</option>
        </select> -->
      </div>
      <div class="col text-end">
        <button class="btn btn-primary" type="button" @click="showAddProfileModal">
          <font-awesome-icon class="me-2" icon="fa-solid fa-plus-circle" />
          New Profile
        </button>
        <!-- <button v-if="userTypeId != UserTypeId.USR" class="btn btn-primary ms-2" type="button">
          <font-awesome-icon class="me-2" icon="fa-solid fa-upload" />
          Profile Excel Import
        </button> -->
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
          <tr v-for="(hrProfileData, index) in hrProfileList" :key="hrProfileData.id"
            @click="handleTableRowClick('hrProfileModal', hrProfileData.id!)" role="button">
            <td v-for="field in hrProfileFields" :key="field.key">
              <template v-if="field.key == 'select'">
                <input class="form-check-input" type="checkbox">
              </template>
              <template v-else-if="field.key == 'index'">
                {{ index + 1 }}
              </template>
              <template v-else-if="field.key == 'first_name'">
                {{ hrProfileData.first_name }} {{ hrProfileData.last_name }}
              </template>
              <template v-else-if="field.key == 'skills'">
                <div class="text-truncate table-th-width" :title="skillsToolTip(hrProfileData.skills)">
                  <span v-for="_skill, index in hrProfileData.skills" :key="index">{{ _skill.skill }}<span
                      v-if="hrProfileData.skills && index < hrProfileData.skills.length - 1">,
                    </span>
                  </span>
                </div>
              </template>
              <template v-else-if="field.key == 'status_id'">
                {{ commonFunctions.getProfileStatusById(hrProfileData.status_id) }}
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDateTime(hrProfileData.last_updated_dt) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div class="icon-btn me-2" @click.stop="duplicateProfile(hrProfileData)" title="Duplicate Profile"
                  data-bs-toggle="modal" data-bs-target="#duplicateProfileConfirm">
                  <font-awesome-icon icon="fa-regular fa-copy" />
                </div>
                <div class="icon-btn me-2">
                  <font-awesome-icon icon="fa-solid fa-paperclip" />
                </div>
                <div class="icon-btn me-2" title="Preview & Download" @click.stop="showResumePreview(hrProfileData)">
                  <font-awesome-icon icon="fa-solid fa-download" />
                </div>
                <div class="icon-btn" @click.stop="deleteHrProfile(hrProfileData.id!)" title="Delete Profile"
                  data-bs-toggle="modal" data-bs-target="#deleteHrProfile">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
              </template>
              <template v-else>
                {{ hrProfileData[field.key] }}
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
  <AddHrProfileModal id="addHrProfileModal-profileManage" ref="addHrProfileModalRef"
    @refreshParent="getUpdatedHrProfileList" />
  <dialog-component id="deleteHrProfile" :onYes="onYesProfile" :returnParams="dialogParam" title="Delete Confirmation"
    message="Are you sure to delete profile?" />
  <!-- <ModalComponent v-if="showHrProfileModal" v-loading="isModalLoading" ref="hrProfileModalRef" id="hrProfileModal"
    title="New Profile" content-class="profile-modal" fullscreen hide-header>
    <template #body>
      <HrProfileComponent :id="hrProfileId" :key="hrProfileId" />
    </template>
  </ModalComponent> -->
  <ResumePreviewModal id="profileResumePreviewModal" :hrProfile="hrProfile" />
  <dialog-component id="duplicateProfileConfirm" :onYes="onYesDuplicateProfile" title="Create Duplicate Profile"
    message="Are you sure you want to create a copy of this profile?" />
</template>
