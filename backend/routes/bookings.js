const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const layananList = [
  "Nail Art Minimalis",
  "Nail Art Glitter",
  "French Manicure",
  "Gel Extension",
  "Acrylic Nail",
  "Nail Art Custom",
  "Basic Manicure",
  "Pedicure",
];

let bookings = [
  { id: 1, pelangganId: 1, pelangganNama: "Siti Rahma", layanan: "Nail Art Minimalis", tanggal: "2026-07-01", jamMulai: "10:00", jamSelesai: "11:00", status: "confirmed", catatan: "", createdAt: "2026-06-28" },
  { id: 2, pelangganId: 2, pelangganNama: "Dewi Lestari", layanan: "Gel Extension", tanggal: "2026-07-01", jamMulai: "13:00", jamSelesai: "14:30", status: "confirmed", catatan: "", createdAt: "2026-06-29" },
  { id: 3, pelangganId: 3, pelangganNama: "Rina Wijaya", layanan: "French Manicure", tanggal: "2026-07-01", jamMulai: "15:30", jamSelesai: "16:30", status: "pending", catatan: "Minta desain bunga", createdAt: "2026-07-01" },
  { id: 4, pelangganId: 1, pelangganNama: "Siti Rahma", layanan: "Basic Manicure", tanggal: "2026-07-02", jamMulai: "09:00", jamSelesai: "09:45", status: "confirmed", catatan: "", createdAt: "2026-06-30" },
  { id: 5, pelangganId: 2, pelangganNama: "Dewi Lestari", layanan: "Nail Art Custom", tanggal: "2026-07-02", jamMulai: "14:00", jamSelesai: "16:00", status: "done", catatan: "Sudah selesai", createdAt: "2026-06-25" },
];
let nextId = 6;

function isSlotConflict(tanggal, jamMulai, jamSelesai, excludeId) {
  return bookings.some((b) => {
    if (b.id === excludeId) return false;
    if (b.status === "cancelled") return false;
    if (b.tanggal !== tanggal) return false;
    return jamMulai < b.jamSelesai && jamSelesai > b.jamMulai;
  });
}

router.get("/", authenticateToken, (req, res) => {
  const { tanggal, status } = req.query;
  let result = [...bookings];
  if (tanggal) result = result.filter((b) => b.tanggal === tanggal);
  if (status) result = result.filter((b) => b.status === status);
  result.sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jamMulai.localeCompare(b.jamMulai));
  res.json({ data: result });
});

router.get("/layanan", authenticateToken, (req, res) => {
  res.json({ data: layananList });
});

router.get("/:id", authenticateToken, (req, res) => {
  const booking = bookings.find((b) => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ message: "Booking tidak ditemukan" });
  res.json({ data: booking });
});

router.post("/", authenticateToken, (req, res) => {
  const { pelangganId, pelangganNama, layanan, tanggal, jamMulai, jamSelesai, catatan } = req.body;

  if (!pelangganNama || !layanan || !tanggal || !jamMulai || !jamSelesai) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (jamMulai >= jamSelesai) {
    return res.status(400).json({ message: "Jam selesai harus setelah jam mulai" });
  }

  if (isSlotConflict(tanggal, jamMulai, jamSelesai)) {
    return res.status(409).json({ message: "Slot waktu sudah dibooking oleh pelanggan lain" });
  }

  const newBooking = {
    id: nextId++,
    pelangganId: pelangganId || null,
    pelangganNama,
    layanan,
    tanggal,
    jamMulai,
    jamSelesai,
    status: "pending",
    catatan: catatan || "",
    createdAt: new Date().toISOString().split("T")[0],
  };
  bookings.push(newBooking);
  res.status(201).json({ message: "Booking berhasil dibuat", data: newBooking });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = bookings.findIndex((b) => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Booking tidak ditemukan" });

  const { pelangganId, pelangganNama, layanan, tanggal, jamMulai, jamSelesai, catatan, status } = req.body;

  if (!pelangganNama || !layanan || !tanggal || !jamMulai || !jamSelesai) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (jamMulai >= jamSelesai) {
    return res.status(400).json({ message: "Jam selesai harus setelah jam mulai" });
  }

  const conflict = isSlotConflict(tanggal, jamMulai, jamSelesai, bookings[idx].id);
  if (conflict) {
    return res.status(409).json({ message: "Slot waktu sudah dibooking oleh pelanggan lain" });
  }

  bookings[idx] = {
    ...bookings[idx],
    pelangganId: pelangganId || bookings[idx].pelangganId,
    pelangganNama,
    layanan,
    tanggal,
    jamMulai,
    jamSelesai,
    catatan: catatan || "",
    status: status || bookings[idx].status,
  };

  res.json({ message: "Booking berhasil diubah", data: bookings[idx] });
});

router.patch("/:id/status", authenticateToken, (req, res) => {
  const idx = bookings.findIndex((b) => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Booking tidak ditemukan" });

  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "done", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  bookings[idx].status = status;
  res.json({ message: "Status booking berhasil diubah", data: bookings[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = bookings.findIndex((b) => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Booking tidak ditemukan" });

  bookings.splice(idx, 1);
  res.json({ message: "Booking berhasil dihapus" });
});

module.exports = router;
