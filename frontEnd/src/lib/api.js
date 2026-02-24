import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://food-app-backend-r8v9.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
