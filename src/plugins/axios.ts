import router from "@/router";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const axiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

const isUnAuthorized = ref(false);

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject("Something went wrong");
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    isUnAuthorized.value = true;
    console.log(response);
    const res = response.data;
    return res;
  },
  (error) => {
    console.log(error);
    if (error.response?.data) {
      if (error.response.data.status === HttpStatusCode.Unauthorized) {
        if (!isUnAuthorized.value) {
          console.log(error.response.data.status, isUnAuthorized.value);
          toast.error(error.response.data.message);
          isUnAuthorized.value = true;
          router.push({ name: "home" });
        }
        return Promise.resolve(error.response);
      } else if (error.response.data.status === HttpStatusCode.Forbidden) {
        // No Access error handling
        toast.error(error.response.data.message);
        router.push({ name: "home" });
        return Promise.resolve(error.response);
      } else if (error.code === "ECONNABORTED") {
        // Network timeout error handling
        toast.error("Connection timeout. Please try again.");
      } else if (error.code === "ENETUNREACH") {
        // Network unreachable error handling
        toast.error(
          "Network unreachable. Please check your internet connection."
        );
      } else {
        return Promise.reject(error.response.data);
      }
    } else if (error.request) {
      toast.error("Something went wrong");
    } else {
      toast.error("Internal Server Error");
    }
  }
);

export default axiosInstance;
