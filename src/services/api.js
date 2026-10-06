import axios from "axios";

const api = axios.create({
  baseURL: "https://coloring-print-shop-production.up.railway.app/api/v1",
});

// إضافة الـ Token تلقائياً لو موجود
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// لو الـ token مات أو اترفض → اطلع بره تلقائياً
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;