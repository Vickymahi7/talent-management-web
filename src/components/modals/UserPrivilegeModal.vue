<script setup lang="ts">
import axios from "@/plugins/axios";
import type UserMenuPrivilege from "@/types/UserMenuPrivilege";
import { HttpStatusCode } from "axios";
import { Modal } from "bootstrap";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import ModalComponent from "./ModalComponent.vue";
const toast = useToast();

const userId = ref(null as null | number);
const userPrivilegeModal = ref(null as null | Modal);
const isLoading = ref(false);
const standardPrivilegeList = ref([] as UserMenuPrivilege[]);
const userMenuPrivilegeFields = ref([
  // { key: 'user_menu_privilege_id', label: 'ID' },
  { key: 'main_menu', label: 'Main Menu' },
  { key: 'menu', label: 'Menu' },
  { key: 'active', label: 'Active' },
  // { key: 'actions', label: 'Action' },
]);

const getStandardPrivilegeList = async (_userId: number) => {
  try {
    isLoading.value = true;
    const response: any = await axios.get('/standardprivilege/list/' + _userId)
    standardPrivilegeList.value = response.standardPrivilegeList;
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const updateUserMenuPrivilege = async (item: any) => {
  try {
    let data = {
      user_menu_privilege_id: item.user_menu_privilege_id,
      standard_menu_id: item.standard_menu_id,
      menu_order: item.menu_order,
      active: item.active,
      user_id: userId.value,
    }
    isLoading.value = true;
    const response: any = await axios.post('/usermenuprivilege/statechange', data)
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.message);
      getStandardPrivilegeList(userId.value!);
      // bsModalHide();
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

const _showModal = (_userId: number) => {
  userPrivilegeModal.value?.show();

  getStandardPrivilegeList(_userId);
  userId.value = _userId;
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
            <tr v-for="item in standardPrivilegeList" :key="item.standard_menu_id">
              <td v-for="field in userMenuPrivilegeFields" :key="field.key">
                <template v-if="field.key == 'active'">
                  <input class="form-check-input checkbox-lg mt-0" type="checkbox" v-model="item[field.key]"
                    @change="updateUserMenuPrivilege(item)">
                  <!-- <el-switch v-model="item[field.key]" size="small" :active-value="1" :inactive-value="0"
                    @change="updateUserMenuPrivilege(item)" @click="test" /> -->
                </template>
                <template v-else>{{ item[field.key] }}</template>
              </td>
            </tr>
            <tr v-if="standardPrivilegeList.length == 0">
              <td colspan="12" class="text-center"> No record found </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </ModalComponent>
</template>