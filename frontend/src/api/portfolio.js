import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getPortfolio(params) {
  return api.get("/portfolio", { params });
}

export function getPortfolioKategori() {
  return api.get("/portfolio/kategori");
}

export function getPortfolioById(id) {
  return api.get(`/portfolio/${id}`);
}

export function createPortfolio(data) {
  return api.post("/portfolio", data);
}

export function updatePortfolio(id, data) {
  return api.put(`/portfolio/${id}`, data);
}

export function deletePortfolio(id) {
  return api.delete(`/portfolio/${id}`);
}
