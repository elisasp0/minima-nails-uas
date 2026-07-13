import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function login(username, password) {
  return api.post("/auth/login", { username, password });
}

export function getMe() {
  return api.get("/auth/me");
}

export function getDashboardStats() {
  return api.get("/dashboard/stats");
}

export function getDashboardPelanggan() {
  return api.get("/dashboard/pelanggan");
}
