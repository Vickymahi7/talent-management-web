import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    console.log(response);
    const res = response.data;
    return res;
  },
  (error) => {
    console.log(error);
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    } else {
      return Promise.reject(new Error("Something went wrong"));
    }
  }
);

export default axiosInstance;
