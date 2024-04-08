<script lang="ts" setup>
import axiosCustom from '@/plugins/axios'
import type HrProfile from '@/types/HrProfile'
import HrProfileComponent from '@/views/hrProfile/HrProfile.vue'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
const props = defineProps({
  id: String
});
const toast = useToast();

const isLoading = ref(false);
const byteArrayPDF = ref(false);
const documentUrl = ref('');
const hrProfile = ref({} as HrProfile);

const imageBaseUrl = computed(() => {
  return (import.meta as any).env.VITE_API_BASE_URL;
});

onMounted(() => {
  getHrProfileDetail();
});

const getHrProfileDetail = async () => {
  try {
    isLoading.value = true;
    const response: any = await axiosCustom.get('/hrprofile/view/' + props.id);
    hrProfile.value = response.hrProfile as HrProfile;
    if (hrProfile.value.resume_url) {
      fetchDocument(imageBaseUrl.value+'/'+hrProfile.value.resume_url);
    }
  } catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
};

const fetchDocument = (url: string) => {
  isLoading.value = true;
  fetch(url)
    .then(response => {
      console.log(response)
      isLoading.value = false;
      documentUrl.value = response.url;
      byteArrayPDF.value = true;
    })
    .catch((error) => {
      console.log(error)
      byteArrayPDF.value = false;
      isLoading.value = false;
    })
}

</script>
<template>
  <div class="d-flex card-gap-mb">
    <div class="content-card content-header">
      <span>
          <label>Resume View</label>
        </span>
    </div>
    <button class="btn btn-secondary ms-2" type="button" @click="$router.back()">
      <font-awesome-icon icon="fa-solid fa-times" class="me-2" />
      Close
    </button>
  </div>
  <div v-loading="isLoading" class="row">
    <div class="col-7 pe-0">
      <HrProfileComponent :id="props.id" />
    </div>
    <div class="col-5 ps-0">
      <iframe v-if="byteArrayPDF" :src="documentUrl" width="100%" height="100%" class="border rounded" frameborder="0"></iframe>
      <iframe v-else-if="hrProfile.resume_url"
        :src="'https://view.officeapps.live.com/op/embed.aspx?src=' + imageBaseUrl + hrProfile.resume_url" width="100%" height="100%"
        class="border rounded" frameborder="0"></iframe>
    </div>
  </div>
</template>