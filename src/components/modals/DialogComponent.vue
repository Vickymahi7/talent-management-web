<script lang="ts">
export default {
  props: {
    showFooter: { type: Boolean, default: true },
    id: { type: String, default: '_confirm1' },
    title: { type: String, default: 'Delete Confirmation' },
    message: { type: String, default: 'Are you sure to delete ?' },
    yesButton: { type: String, default: '1' },
    noButton: { type: String, default: '1' },
    returnParams: { type: Object, default: function () { return {} } },
    onYes: Function,
    onNo: { type: Function, default: function () { return false; } },
    onExit: { type: Function, default: function () { return false; } }
  },
  methods: {
    yesClick: function () {
      if (this.onYes) {
        this.onYes();
      }
    },
    noClick: function () {
      this.onNo();
    },
    closeClick: function () {
      this.onExit();
    }
  }
}
</script>
<template>
  <div class="modal fade" v-bind:id="id" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="exampleModalLongTitle">{{ title }}</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-html="message">
        </div>
        <div v-if="showFooter" class="modal-footer">
          <button v-if="noButton" type="button" class="btn btn-secondary" @click="noClick"
            data-bs-dismiss="modal">No</button>
          <button v-if="yesButton" type="button" class="btn btn-primary" @click="yesClick"
            data-bs-dismiss="modal">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>