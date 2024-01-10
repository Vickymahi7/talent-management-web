<script lang="ts" setup>
import axios from '@/plugins/axios';
import type { AdUser } from '@/types/AdUser';
import { callMsGraph } from '@/utils/authConfig';
import { HttpStatusCode } from 'axios';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  id: { type: String, default: 'inviteAdUsersModal' },
  accessToken: { type: String },
});
const toast = useToast();

const scroller = ref(null as HTMLElement | null);

const isModalLoading = ref(false);
const isPageEnd = ref(false);

const nextPageToken = ref('');
const users = ref([] as AdUser[]);
const inviteUserList = ref([] as AdUser[]);

onBeforeMount(() => {
  getAdUserList();
});

onMounted(() => {
  getNextUser();
});

const getAdUserList = async () => {
  // this.showModal('inviteAdUsersModal');
  if (props.accessToken && !isPageEnd.value) {
    isModalLoading.value = true;
    try {
      const graphData = await callMsGraph(props.accessToken, nextPageToken.value);
      if (graphData.value) {
        nextPageToken.value = graphData['@odata.nextLink']
        isPageEnd.value = graphData['@odata.nextLink'] ? false : true;
        users.value = users.value.concat(graphData.value);
      }
    } catch (error) {
      //error
    } finally {
      isModalLoading.value = false;
    }
  }
};
const getNextUser = () => {
  window.onscroll = () => {
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (bottomOfWindow) {
      getAdUserList();
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
    toast.error('Please select a maximum of 10 users');
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
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isModalLoading.value = false;
  }
};

</script>
<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Invite Active Directory Users</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" @scroll="handleScroll('scroller', !isModalLoading, getAdUserList)" ref="scroller">
          <!-- <div class="text-end mb-3">
            <button type="button" class="btn btn-primary">
              Invite
              <span v-if="inviteUserList.length > 0" class="badge bg-light text-dark"> {{ inviteUserList.length
              }}</span>
            </button>
          </div> -->
          <div class="list-group">
            <label v-for="user in users" :key="user.id" class="list-group-item d-flex align-items-center">
              <input class="form-check-input checkbox-lg me-3 mt-0" type="checkbox"
                :value="inviteUserList.some(data => data.mail == user.mail)" @change="manageInviteList(user)">
              <div class="row d-inline-block">
                <div class="col card-title">{{ user.displayName }}</div>
                <div class="col">{{ user.mail }}</div>
              </div>
            </label>
            <div v-if="users.length == 0" class="text-center">
              No Users found
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="inviteAdUsers">
            Invite
            <span v-if="inviteUserList.length > 0" class="badge bg-light text-dark"> {{ inviteUserList.length
            }}</span>
          </button>
          <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>