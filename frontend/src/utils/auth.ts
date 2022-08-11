import axios from "axios";

export const setAuthToken = (token: string) =>
  localStorage.setItem("auth-token", token);

export const getAuthToken = () => localStorage.getItem("auth-token");

const API_URL = "http://localhost:9000";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
