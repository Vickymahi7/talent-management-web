<script setup lang="ts">
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";
defineProps({
  title: { type: String, default: "Modal", },
  cancelTitle: { type: String, default: "Close", },
  hideCancel: Boolean,
  hideFooter: Boolean,
  centered: Boolean,
  size: { type: String, },
});
const modalEle = ref(null);
const thisModalObj = ref(null as null | Modal);

onMounted(() => {
  thisModalObj.value = new Modal(modalEle.value!);
});
function _show() {
  thisModalObj.value?.show();
}
defineExpose({ show: _show });
</script>

<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalEle">
    <div class="modal-dialog" :class="{ [size!]: size, 'modal-dialog-centered': centered }">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div v-if="!hideFooter" class="modal-footer">
          <button v-if="!hideCancel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ cancelTitle }}
          </button>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>