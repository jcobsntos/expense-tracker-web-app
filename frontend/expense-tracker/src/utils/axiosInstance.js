import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Timeouts
    if (error.code === "ECONNABORTED") {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // Don’t redirect for auth endpoints; let Login/Register handle messages
    const isAuthEndpoint =
      url.includes("/api/v1/auth/login") || url.includes("/api/v1/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      // token expired/invalid on protected routes
      localStorage.removeItem("token");
      // Optional: redirect for protected routes only
      window.location.href = "/login";
      // NOTE: this will reload, which is fine for post-login protected routes
    } else if (status === 500) {
      console.error("Server error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
