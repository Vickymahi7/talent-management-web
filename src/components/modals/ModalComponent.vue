<script setup lang="ts">
import { Modal } from "bootstrap";
import { onBeforeUnmount, onMounted, ref } from "vue";
defineProps({
  title: { type: String, default: "Modal", },
  cancelTitle: { type: String, default: "Close", },
  contentClass: String,
  hideHeader: Boolean,
  hideCancel: Boolean,
  hideFooter: Boolean,
  centered: Boolean,
  scrollable: Boolean,
  fullscreen: Boolean,
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
onBeforeUnmount(() => {
  _hide();
});

const show = (() => emit('show'));
const shown = (() => emit('shown'));
const hide = (() => emit('hide'));
const hidden = (() => emit('hidden'));

const _toggle = () => {
  thisModalObj.value?.toggle();
};
const _show = () => {
  thisModalObj.value?.show();
};
const _hide = () => {
  thisModalObj.value?.hide();
};
defineExpose({ toggle: _toggle, show: _show, hide: _hide });
</script>

<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog" :class="{
      [size!]: size,
      'modal-fullscreen': fullscreen,
      'modal-dialog-centered': centered,
      'modal-dialog-scrollable': scrollable
    }">
      <div class="modal-content" :class="contentClass ? contentClass : ''">
        <slot name="modal-content">
          <div v-if="!hideHeader" class="modal-header">
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
        </slot>
      </div>
    </div>
  </div>
</template>