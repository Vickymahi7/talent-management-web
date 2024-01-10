<script lang="ts" setup>
import AddHrProfileModal from "@/components/modals/AddHrProfileModal.vue";
import axios from '@/plugins/axios';
import type HrProfile from '@/types/HrProfile';
import type { Skill } from "@/types/Skill";
import { PROFILE_STATUS } from '@/utils/constants';
import { formatDateTime } from '@/utils/dateFormats';
import { UserTypeId } from '@/utils/enums';
import { useCommonFunctions } from '@/utils/useCommonFunctions';
import HrProfileComponent from "@/views/hrProfile/HrProfile.vue";
import { BrowserAuthError, InteractionRequiredAuthError } from '@azure/msal-browser';
import { HttpStatusCode } from 'axios';
import { Modal } from 'bootstrap';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useMsal } from "../../composables/useMsal";
import { loginRequest } from "../../utils/authConfig";

const instance = useMsal().instance;
const toast = useToast();
const commonFunctions = useCommonFunctions();
const router = useRouter();

const addHrProfileModalRef = ref(null as InstanceType<typeof AddHrProfileModal> | null);
const scrollerRef = ref(null as InstanceType<typeof HTMLElement> | null);

const isLoading = ref(false);
const isModalLoading = ref(false);
const showInviteUserModal = ref(false);
const searchText = ref('');
const status_id = ref([] as number[]);

const editId = ref(null as string | null);
const editKey = ref(null as string | null);
const editValue = ref(null as string | null);

const accessToken = ref(null as string | null);
const hrProfileId = ref('');

const hrProfileList = ref([] as HrProfile[]);
const hrProfileFields = [
  { key: 'select', label: '' },
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
const perPage = ref(10);

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

onBeforeUnmount(() => {
  hideModal('hrProfileModal');
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
const updateHrProfile = async (hrProfileData: any, updateKey: string, updateVal: any) => {
  const data: any = {};
  data.id = hrProfileData.id;
  data.hr_profile_id = hrProfileData.hr_profile_id;
  data.user_id = hrProfileData.user_id;
  data.email_id = hrProfileData.email_id;
  data[updateKey] = updateVal;

  try {
    isLoading.value = true;
    const response: any = await axios.patch('/hrprofile/update', data);
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getUpdatedHrProfileList();
      editId.value = null;
      editKey.value = null;
      editValue.value = null;
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
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
    showModal(modalId);
  }
}
const handleTableCellClick = (field: any, item: any, event: Event) => {
  if (field.isEditable) {
    event.stopPropagation();
    editId.value = item.id;
    editKey.value = field.key;
    editValue.value = item[field.key];
  }
}
const cancelInlineEdit = (item: any, field: any) => {
  item[field.key] = editValue;

  editId.value = null;
  editKey.value = null;
  editValue.value = null;
  getUpdatedHrProfileList();
}
const adLoginPopup = async () => {
  await instance.loginPopup(loginRequest);
  getGraphData()
}
const getGraphData = async () => {
  isLoading.value = true;
  const response = await instance.acquireTokenSilent({
    ...loginRequest
  }).catch(async (e) => {
    if (e instanceof InteractionRequiredAuthError || e instanceof BrowserAuthError) {
      // await instance.acquireTokenRedirect(loginRequest);
      await instance.loginPopup(loginRequest);
      adLoginPopup();
    }
    else {
      throw e;
    }
  }).finally(() => {
    isLoading.value = false;
  });
  if (response?.accessToken) {
    accessToken.value = response.accessToken;
    showInviteUserModal.value = true;
    nextTick(() => {
      showModal('inviteAdUsersModal');
    })
  }
};
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
const hideModal = (modalId: string) => {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;
  const modal = Modal.getOrCreateInstance(modalEl!, {
    keyboard: false
  })
  modal.hide();
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
        <button v-if="userTypeId != UserTypeId.USR" class="btn btn-primary ms-2" type="button" @click="adLoginPopup">
          <font-awesome-icon class="me-2" icon="fa-solid fa-upload" />
          Invite AD Users
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
                  <span v-for="_skill, index in hrProfile.skills" :key="index">{{ _skill.skill }}<span
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
                  <option v-for="status in PROFILE_STATUS" :key="status.id" :value="status.id">{{ status.status }}
                  </option>
                </select>
                <span v-else>{{ commonFunctions.getProfileStatusById(hrProfile.status_id) }}</span>
              </template>
              <template v-else-if="field.key == 'last_updated_dt'">
                {{ formatDateTime(hrProfile.last_updated_dt) }}
              </template>
              <template v-else-if="field.key == 'actions'">
                <div class="icon-btn me-2">
                  <font-awesome-icon icon="fa-solid fa-paperclip" />
                </div>
                <div class="icon-btn me-2">
                  <font-awesome-icon icon="fa-solid fa-download" />
                </div>
                <div class="icon-btn me-2" @click.stop="deleteHrProfile(hrProfile.id!)" title="Delete Profile"
                  data-bs-toggle="modal" data-bs-target="#deleteHrProfile">
                  <font-awesome-icon icon="fa-solid fa-trash" />
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
    <!-- <BPagination v-if="hrProfileList.length > 0" v-model="currentPage" pills :total-rows="totalRows" :per-page="perPage"
      size="sm" /> -->
  </div>
  <AddHrProfileModal id="addHrProfileModal-profileManage" ref="addHrProfileModalRef"
    @refreshParent="getUpdatedHrProfileList" />
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
          <HrProfileComponent :id="hrProfileId" :key="hrProfileId" @close-modal="hideModal('hrProfileModal')" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>