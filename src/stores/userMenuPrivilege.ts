import axios from "@/plugins/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserMenuPrivilegeStore = defineStore(
  "userMenuPrivilege",
  () => {
    const userMenuList = ref([] as any); 
    
    // getters: {
    //   doubleCount: (state) => state.count * 2,
    // },

    async function getUserMenuPrivilegeList() {
      const response: any = await axios.get("/usermenuprivilege/list");
      userMenuList.value = response.userMenuPrivilegeList;
    }

    return {userMenuList, getUserMenuPrivilegeList};
  });
