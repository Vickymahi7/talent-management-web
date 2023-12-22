<script setup lang="ts">
import { ref } from "vue";
import ModalComponent from "./ModalComponent.vue";
import { Modal } from "bootstrap";

const userPrivilegeModal = ref(null as null | Modal);

const _showModal = () => {
  userPrivilegeModal.value?.show();
}

defineExpose({ showModal: _showModal });
</script>

<template>
  <button @click="_showModal">Show Modal</button>
  <ModalComponent title="Model title goes here" ref="userPrivilegeModal">
    <template #body>This should be in the body</template>
    <template #footer>
      <button class="btn btn-primary">Save</button>
    </template>
  </ModalComponent>
</template>