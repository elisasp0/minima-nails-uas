import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getCustomers(search) {
  const params = search ? { search } : {};
  return api.get("/customers", { params });
}

export function getCustomer(id) {
  return api.get(`/customers/${id}`);
}

export function createCustomer(data) {
  return api.post("/customers", data);
}

export function updateCustomer(id, data) {
  return api.put(`/customers/${id}`, data);
}

export function deleteCustomer(id) {
  return api.delete(`/customers/${id}`);
}
