<script lang="ts">
import type { AdUser } from '@/types/AdUser';
import HrProfile from '@/views/hrProfile/HrProfile.vue';
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';

export default defineComponent({
  props: {
    id: { type: String, default: 'hrProfileModal' },
    hrProfileId: { type: String },
  },
  components: {
    HrProfile,
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
  methods: {

  }
})
</script>
<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div v-loading="isModalLoading" class="modal-content">
        <!-- <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div> -->
        <div class="modal-body profile-modal">
          <HrProfile :id="hrProfileId" :key="hrProfileId" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn secondary-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>