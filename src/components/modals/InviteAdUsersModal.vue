<script lang="ts">
import axios from '@/plugins/axios';
import type { AdUser } from '@/types/AdUser';
import { callMsGraph } from '@/utils/authConfig';
import { HttpStatusCode } from 'axios';
import { Modal } from 'bootstrap';
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';

export default defineComponent({
  props: {
    id: { type: String, default: 'inviteAdUsersModal' },
    accessToken: { type: String },
  },
  data() {
    return {
      toast: useToast(),

      isModalLoading: false,
      isPageEnd: false,

      nextPageToken: '',
      users: [] as AdUser[],
      inviteUserList: [] as AdUser[],
    }
  },
  beforeMount() {
    this.getAdUserList();
  },
  mounted() {
    this.getNextUser();
  },
  methods: {
    async getAdUserList() {
      console.log(this.accessToken)
      // this.showModal('inviteAdUsersModal');
      if (this.accessToken && !this.isPageEnd) {
        const el = document.getElementsByClassName('modal-body')[0];
        console.log(el.scrollTop)

        this.isModalLoading = true;
        try {
          const graphData = await callMsGraph(this.accessToken, this.nextPageToken);
          if (graphData.value) {
            this.nextPageToken = graphData['@odata.nextLink']
            this.isPageEnd = graphData['@odata.nextLink'] ? false : true;
            this.users = this.users.concat(graphData.value);
          }
        } catch (error) {
          //error
        } finally {
          this.isModalLoading = false;
        }
      }
    },
    getNextUser() {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          this.getAdUserList();
        }
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
    manageInviteList(adUser: AdUser) {
      if (this.inviteUserList.some(data => data.mail == adUser.mail)) {
        this.inviteUserList = this.inviteUserList.filter(({ mail }) => mail != adUser.mail);
      }
      else {
        this.inviteUserList.push({ displayName: adUser.displayName, mail: adUser.mail });
      }
    },
    handleScroll(ref: string, isNotLoading: boolean, action: string) {
      // Trigger fetchData when scrolling near the bottom of the container
      const scroller = this.$refs[ref] as HTMLElement;
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 20 && isNotLoading) {
        this[action]();
      }
    },
    async inviteAdUsers() {
      console.log(this.inviteUserList)
      if (this.inviteUserList.length > 10) {
        this.toast.error('Please select a maximum of 10 users');
        return;
      }
      try {
        const data = {
          users: this.inviteUserList,
        }
        this.isModalLoading = true;
        const response: any = await axios.post('/user/aduserinvite', data);

        if (response.status == HttpStatusCode.Ok) {
          this.toast.success(response.message);
          // this.getHrProfileList();
          // this.bsModalHide(this.modalId);
        }
      } catch (error: any) {
        this.toast.error(error.message);
      }
      finally {
        this.isModalLoading = false;
      }
    },
  }
})
</script>
<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div v-loading="isModalLoading" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Invite Active Directory Users</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" @scroll="handleScroll('scroller', !isModalLoading, 'getAdUserList')" ref="scroller">
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