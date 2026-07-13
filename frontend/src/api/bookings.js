import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getBookings(params) {
  return api.get("/bookings", { params });
}

export function getLayanan() {
  return api.get("/bookings/layanan");
}

export function getBooking(id) {
  return api.get(`/bookings/${id}`);
}

export function createBooking(data) {
  return api.post("/bookings", data);
}

export function updateBooking(id, data) {
  return api.put(`/bookings/${id}`, data);
}

export function updateBookingStatus(id, status) {
  return api.patch(`/bookings/${id}/status`, { status });
}

export function deleteBooking(id) {
  return api.delete(`/bookings/${id}`);
}
