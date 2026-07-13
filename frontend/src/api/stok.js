import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getStok(params) {
  return api.get("/stok", { params });
}

export function getLowStock() {
  return api.get("/stok/low-stock");
}

export function getStokKategori() {
  return api.get("/stok/kategori");
}

export function getStokById(id) {
  return api.get(`/stok/${id}`);
}

export function createStok(data) {
  return api.post("/stok", data);
}

export function updateStok(id, data) {
  return api.put(`/stok/${id}`, data);
}

export function updateStokQty(id, data) {
  return api.patch(`/stok/${id}/stok`, data);
}

export function deleteStok(id) {
  return api.delete(`/stok/${id}`);
}
