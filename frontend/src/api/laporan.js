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

export function getBookings(params) {
  return api.get("/bookings", { params });
}

export function getCustomers() {
  return api.get("/customers");
}

export function getKasbon(params) {
  return api.get("/kasbon", { params });
}

export function getPackages() {
  return api.get("/pricelist/packages");
}
