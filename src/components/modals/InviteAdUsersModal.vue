<script lang="ts" setup>
import axios from '@/plugins/axios';
import type { AdUser } from '@/types/AdUser';
import type { User } from '@/types/User';
import { callMsGraph, msalInstance } from '@/utils/authConfig';
import { HttpStatusCode } from 'axios';
import type { Modal } from 'bootstrap';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  id: { type: String, default: 'inviteAdUsersModal' },
  accessToken: { type: String },
});
const toast = useToast();

const scroller = ref(null as HTMLElement | null);

const isModalLoading = ref(false);
const isPageEnd = ref(false);

const searchText = ref('');
const nextPageToken = ref('');
const adUsers = ref([] as AdUser[]);
const inviteUserList = ref([] as AdUser[]);
const userList = ref([] as User[]);

const inviteAdUserModalRef = ref(null as null | Modal);

const userListWithEmailId = computed(() => {
  // return adUsers.value;
  return adUsers.value.filter(data => data.mail);
})

// onBeforeMount(() => {
//   getAdUserList();
// });

const getInitAdUserList = () => {
  isPageEnd.value = false;
  nextPageToken.value = '';
  adUsers.value = [];
  inviteUserList.value = [];
  getAdUserList();
  getUserList();
}

const getUserList = async () => {
  try {
    // const queryParams = {
    //   lastRecordKey: lastRecordKey.value,
    //   perPage: perPage.value,
    // };
    isModalLoading.value = true;
    const response: any = await axios.get('/user/list')
    // lastRecordKey.value = response.lastRecordKey;
    // if (lastRecordKey.value) {
    userList.value = response.userList;
    // }
    // else {
    //   isPageEnd.value = true;
    // }
    // userList.value = response.userList;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
}

const getAdUserList = async () => {
  if (props.accessToken && !isPageEnd.value) {
    isModalLoading.value = true;
    try {
      const graphData = await callMsGraph(props.accessToken, nextPageToken.value, searchText.value);
      if (graphData.value) {
        nextPageToken.value = graphData['@odata.nextLink']
        isPageEnd.value = graphData['@odata.nextLink'] ? false : true;
        adUsers.value = adUsers.value.concat(graphData.value);
        console.log("adUsers:" + adUsers.value);
      }
    } catch (error) {
      //error
    } finally {
      isModalLoading.value = false;
    }
  }
};

const manageInviteList = (adUser: AdUser) => {
  if (inviteUserList.value.some(data => data.mail == adUser.mail)) {
    inviteUserList.value = inviteUserList.value.filter(({ mail }) => mail != adUser.mail);
  }
  else {
    inviteUserList.value.push({ displayName: adUser.displayName, mail: adUser.mail });
  }
};
const handleScroll = (refName: string, isNotLoading: boolean, callback: Function) => {
  // Trigger fetchData when scrolling near the bottom of the container
  if (scroller.value && scroller.value.scrollTop + scroller.value.clientHeight >= scroller.value.scrollHeight - 20 && isNotLoading) {
    callback();
  }
};
const inviteAdUsers = async () => {
  if (inviteUserList.value.length > 10) {
    toast.warning('Please select a maximum of 10 users');
    return;
  }
  try {
    const data = {
      users: inviteUserList.value,
    }
    isModalLoading.value = true;
    const response: any = await axios.post('/user/aduserinvite', data);

    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      // this.getHrProfileList();
      // this.bsModalHide(this.modalId);
    }
    else if (response.status == HttpStatusCode.Conflict) {
      toast.warning(response.message);
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
};

const logoutPopup = async () => {
  isModalLoading.value = true;
  try {
    await msalInstance.logoutPopup();
    inviteAdUserModalRef.value?.hide();
    isModalLoading.value = false;
  } catch (error) {
    isModalLoading.value = false;
  }
}

const checkUserInvited = (emailId: string): boolean => {
  return userList.value.some(data => data.email_id === emailId);
}

const _showModal = () => {
  inviteAdUserModalRef.value?.show();
  getInitAdUserList();
}

defineExpose({ showModal: _showModal });

</script>
<template>
  <ModalComponent :is-modal-loading="isModalLoading" ref="inviteAdUserModalRef" hide-cancel>
    <template #modal-content>
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Invite Active Directory Users</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row mb-3 align-items-center">
          <div class="col">
            <input type="search" v-model="searchText" class="form-control" @input="getInitAdUserList"
              placeholder="Search..." aria-label="Search">
          </div>
        </div>
        <div class="list-group modal-scroll" @scroll="handleScroll('scroller', !isModalLoading, getAdUserList)"
          ref="scroller">
          <label v-for="user in userListWithEmailId" :key="user.id" class="list-group-item d-flex align-items-center">
            <font-awesome-icon v-if="checkUserInvited(user.mail!)" title="Registered User" class="me-3 pe-1 text-success" icon="fa-solid fa-check" />
            <input v-else class="form-check-input checkbox-lg me-3 mt-0" type="checkbox"
              :value="inviteUserList.some(data => data.mail == user.mail)" @change="manageInviteList(user)">
            <div class="row d-inline-block">
              <div class="col card-title">{{ user.displayName }}</div>
              <div class="col">{{ user.mail }}</div>
            </div>
          </label>
          <div v-if="adUsers.length == 0" class="text-center">
            No Users found
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary me-auto" @click="logoutPopup">
          AD Log Out
        </button>
        <button type="button" class="btn btn-primary" @click="inviteAdUsers">
          Invite
          <span v-if="inviteUserList.length > 0" class="badge bg-light text-dark"> {{ inviteUserList.length
          }}</span>
        </button>
      </div>
    </template>
  </ModalComponent>
</template>