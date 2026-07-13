import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getPackages() {
  return api.get("/pricelist/packages");
}

export function getPackage(id) {
  return api.get(`/pricelist/packages/${id}`);
}

export function createPackage(data) {
  return api.post("/pricelist/packages", data);
}

export function updatePackage(id, data) {
  return api.put(`/pricelist/packages/${id}`, data);
}

export function deletePackage(id) {
  return api.delete(`/pricelist/packages/${id}`);
}

export function getUpgrades() {
  return api.get("/pricelist/upgrades");
}

export function getUpgrade(id) {
  return api.get(`/pricelist/upgrades/${id}`);
}

export function createUpgrade(data) {
  return api.post("/pricelist/upgrades", data);
}

export function updateUpgrade(id, data) {
  return api.put(`/pricelist/upgrades/${id}`, data);
}

export function deleteUpgrade(id) {
  return api.delete(`/pricelist/upgrades/${id}`);
}

export function calculatePrice(data) {
  return api.post("/pricelist/calculate", data);
}
