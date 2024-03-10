<script lang="ts" setup>
const props = defineProps({
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
});
function yesClick() {
  if (props.onYes) {
    props.onYes();
  }
}
function noClick() {
  props.onNo();
}
// function closeClick() {
//   props.onExit();
// }
</script>
<template>
  <ModalComponent :id="id" title="Forgot Password ?" ref="dialogModalRef" centered>
    <template #body>
      <div v-html="message"></div>
    </template>
    <template #footer v-if="showFooter">
      <button v-if="noButton" type="button" class="btn btn-secondary" @click="noClick" data-bs-dismiss="modal">No</button>
      <button v-if="yesButton" type="button" class="btn btn-primary" @click="yesClick"
        data-bs-dismiss="modal">Yes</button>
    </template>
  </ModalComponent>
</template>