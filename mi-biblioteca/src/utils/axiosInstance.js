import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("API error:", e?.response || e?.message);
    return Promise.reject(e);
  }
);

export default api;
