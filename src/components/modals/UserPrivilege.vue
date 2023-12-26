<script setup lang="ts">
import axios from "@/plugins/axios";
import { HttpStatusCode } from "axios";
import { Modal } from "bootstrap";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import ModalComponent from "./ModalComponent.vue";
const toast = useToast();

const userPrivilegeModal = ref(null as null | Modal);
const isLoading = ref(false);
const userMenuPrivilegeList = ref([] as any);
const userMenuPrivilegeFields = ref([
  { key: 'user_menu_privilege_id', label: 'ID' },
  { key: 'main_menu', label: 'Main Menu' },
  { key: 'menu', label: 'Menu' },
  { key: 'active', label: 'Active' },
  // { key: 'actions', label: 'Action' },
]);

const getUserMenuPrivilegeList = async (userId: number) => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/usermenuprivilege/list/' + userId)
    userMenuPrivilegeList.value = response.userMenuPrivilegeList;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const updateUsetMenuPrivilege = async (item: any) => {
  try {
    let data = {
      user_menu_privilege_id: item.user_menu_privilege_id,
      active: item.active,
    }
    isLoading.value = true;
    const response: any = await axios.post('/usermenuprivilege/statechange', data)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      // bsModalHide();
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const _showModal = (userId: number) => {
  userPrivilegeModal.value?.show();

  getUserMenuPrivilegeList(userId);
}

defineExpose({ showModal: _showModal });
</script>

<template>
  <ModalComponent v-loading="isLoading" title="User Menu Privilege" ref="userPrivilegeModal">
    <template #body>
      <div class="table-responsive">
        <table class="table table-borderless custom-table-style">
          <thead class="table-primary">
            <tr>
              <th scope="col" v-for="field in userMenuPrivilegeFields" :key="field.key">{{ field.label }}</th>
            </tr>
          </thead>
          <tbody class="custom-tbody-style">
            <tr v-for="item in userMenuPrivilegeList" :key="item">
              <td v-for="field in userMenuPrivilegeFields" :key="field.key">
                <template v-if="field.key == 'active'">
                  <el-switch v-model="item[field.key]" size="small" :active-value="1" :inactive-value="0"
                    @change="updateUsetMenuPrivilege(item)" />
                  <!-- <div class="form-check form-switch">
                    {{ item[field.key] }}
                    <input class="form-check-input" type="checkbox" v-model="item[field.key]" :value="item[field.key]">
                  </div> -->
                  <!-- <span v-if="item[field.key]" class="text-success me-2" title="User Activated">
                    <font-awesome-icon icon="fa-solid fa-user-check" />
                  </span>
                  <span v-else class="text-danger me-2" title="User Not Activated">
                    <font-awesome-icon icon="fa-solid fa-user-xmark" />
                  </span> -->
                </template>
                <template v-else>{{ item[field.key] }}</template>
              </td>
            </tr>
            <tr v-if="userMenuPrivilegeList.length == 0">
              <td colspan="12" class="text-center"> No record found </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary">Save</button>
    </template>
  </ModalComponent>
</template>