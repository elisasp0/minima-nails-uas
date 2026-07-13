import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getKasbon(params) {
  return api.get("/kasbon", { params });
}

export function getKasbonDueSoon() {
  return api.get("/kasbon/due-soon");
}

export function getKasbonById(id) {
  return api.get(`/kasbon/${id}`);
}

export function createKasbon(data) {
  return api.post("/kasbon", data);
}

export function updateKasbon(id, data) {
  return api.put(`/kasbon/${id}`, data);
}

export function updateKasbonStatus(id, status) {
  return api.patch(`/kasbon/${id}/status`, { status });
}

export function deleteKasbon(id) {
  return api.delete(`/kasbon/${id}`);
}
