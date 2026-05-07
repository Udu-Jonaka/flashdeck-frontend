import axios from "axios";
import * as SecureStore from "expo-secure-store";

// REMEMBER TO USE YOUR ACTUAL IP OR LOCALHOST URL HERE!
const BASE_URL = "http://192.168.0.199:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// The Interceptor: Runs before every single request
api.interceptors.request.use(
  async (config) => {
    // 1. Grab the token from secure storage
    const token = await SecureStore.getItemAsync("userToken");

    // 2. If it exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
