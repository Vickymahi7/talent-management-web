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
const emit = defineEmits(['show', 'shown', 'hide', 'hidden']);

const modalElement = ref(null as HTMLElement | null);
const thisModalObj = ref(null as null | Modal);

onMounted(() => {
  thisModalObj.value = new Modal(modalElement.value!);
  if (modalElement.value) {
    modalElement.value.addEventListener('show.bs.modal', show);
    modalElement.value.addEventListener('shown.bs.modal', shown);
    modalElement.value.addEventListener('hide.bs.modal', hide);
    modalElement.value.addEventListener('hidden.bs.modal', hidden);
  }
});

const show = (() => emit('show'));
const shown = (() => emit('shown'));
const hide = (() => emit('hide'));
const hidden = (() => emit('hidden'));

const _show = () => {
  thisModalObj.value?.show();
};
const _hide = () => {
  thisModalObj.value?.hide();
};
defineExpose({ show: _show, hide: _hide });
</script>

<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalElement">
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