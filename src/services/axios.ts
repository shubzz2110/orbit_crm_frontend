import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 30000, // Increased timeout for large datasets with pagination
  withCredentials: true,
});

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
type QueueItem = {
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
};
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;

    // Skip if no original request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip authentication routes
    if (
      originalRequest.url?.includes("/accounts/login/") ||
      originalRequest.url?.includes("/accounts/logout/")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/accounts/token/refresh/");
        const newToken = response.data?.access_token || response.data?.access || response.data?.token;
        
        if (newToken) {
          useAuthStore.getState().setToken(newToken);
          processQueue(null, newToken);
        } else {
          processQueue(null, null);
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth on refresh failure
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined") {
          const params = new URLSearchParams({ reason: "expired" });
          window.location.href = `/auth/login?${params.toString()}`;
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;