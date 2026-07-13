import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getTransaksi(params) {
  return api.get("/keuangan", { params });
}

export function getTransaksiSummary(params) {
  return api.get("/keuangan/summary", { params });
}

export function getKategori() {
  return api.get("/keuangan/kategori");
}

export function getTransaksiById(id) {
  return api.get(`/keuangan/${id}`);
}

export function createTransaksi(data) {
  return api.post("/keuangan", data);
}

export function updateTransaksi(id, data) {
  return api.put(`/keuangan/${id}`, data);
}

export function deleteTransaksi(id) {
  return api.delete(`/keuangan/${id}`);
}
