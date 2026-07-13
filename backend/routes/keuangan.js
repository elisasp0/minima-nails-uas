const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const kategoriPemasukan = ["layanan", "dp", "lainnya"];
const kategoriPengeluaran = ["stok", "alat", "operasional"];

let transaksi = [
  { id: 1, tanggal: "2026-07-01", tipe: "pemasukan", kategori: "layanan", keterangan: "Nail Art Minimalis - Siti", jumlah: 250000, createdAt: "2026-07-01" },
  { id: 2, tanggal: "2026-07-01", tipe: "pengeluaran", kategori: "stok", keterangan: "Beli Cat Kuku", jumlah: 150000, createdAt: "2026-07-01" },
  { id: 3, tanggal: "2026-06-30", tipe: "pemasukan", kategori: "layanan", keterangan: "Gel Extension - Dewi", jumlah: 350000, createdAt: "2026-06-30" },
  { id: 4, tanggal: "2026-06-30", tipe: "pemasukan", kategori: "dp", keterangan: "DP Booking Rina", jumlah: 100000, createdAt: "2026-06-30" },
  { id: 5, tanggal: "2026-06-29", tipe: "pengeluaran", kategori: "operasional", keterangan: "Sewa Tempat", jumlah: 500000, createdAt: "2026-06-29" },
  { id: 6, tanggal: "2026-06-28", tipe: "pengeluaran", kategori: "alat", keterangan: "Beli Lampu LED", jumlah: 250000, createdAt: "2026-06-28" },
  { id: 7, tanggal: "2026-06-28", tipe: "pemasukan", kategori: "layanan", keterangan: "French Manicure - Rina", jumlah: 180000, createdAt: "2026-06-28" },
  { id: 8, tanggal: "2026-06-27", tipe: "pemasukan", kategori: "lainnya", keterangan: "Jual stok lama", jumlah: 75000, createdAt: "2026-06-27" },
];
let nextId = 9;

router.get("/", authenticateToken, (req, res) => {
  const { tipe, kategori, startDate, endDate } = req.query;
  let result = [...transaksi];

  if (tipe) result = result.filter((t) => t.tipe === tipe);
  if (kategori) result = result.filter((t) => t.kategori === kategori);
  if (startDate) result = result.filter((t) => t.tanggal >= startDate);
  if (endDate) result = result.filter((t) => t.tanggal <= endDate);

  result.sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
  res.json({ data: result });
});

router.get("/summary", authenticateToken, (req, res) => {
  const { startDate, endDate } = req.query;
  let filtered = [...transaksi];

  if (startDate) filtered = filtered.filter((t) => t.tanggal >= startDate);
  if (endDate) filtered = filtered.filter((t) => t.tanggal <= endDate);

  const totalPemasukan = filtered
    .filter((t) => t.tipe === "pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalPengeluaran = filtered
    .filter((t) => t.tipe === "pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const byKategori = {};
  for (const t of filtered) {
    const key = `${t.tipe}-${t.kategori}`;
    byKategori[key] = (byKategori[key] || 0) + t.jumlah;
  }

  res.json({
    data: {
      totalPemasukan,
      totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran,
      byKategori,
    },
  });
});

router.get("/kategori", authenticateToken, (req, res) => {
  res.json({
    data: {
      pemasukan: kategoriPemasukan,
      pengeluaran: kategoriPengeluaran,
    },
  });
});

router.get("/:id", authenticateToken, (req, res) => {
  const t = transaksi.find((tr) => tr.id === parseInt(req.params.id));
  if (!t) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
  res.json({ data: t });
});

router.post("/", authenticateToken, (req, res) => {
  const { tanggal, tipe, kategori, keterangan, jumlah } = req.body;

  if (!tanggal || !tipe || !kategori || !keterangan || !jumlah) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (!["pemasukan", "pengeluaran"].includes(tipe)) {
    return res.status(400).json({ message: "Tipe harus pemasukan atau pengeluaran" });
  }

  const kategoriValid = tipe === "pemasukan" ? kategoriPemasukan : kategoriPengeluaran;
  if (!kategoriValid.includes(kategori)) {
    return res.status(400).json({ message: `Kategori tidak valid untuk ${tipe}` });
  }

  const newTransaksi = {
    id: nextId++,
    tanggal,
    tipe,
    kategori,
    keterangan,
    jumlah: parseInt(jumlah),
    createdAt: new Date().toISOString().split("T")[0],
  };
  transaksi.unshift(newTransaksi);
  res.status(201).json({ message: "Transaksi berhasil ditambahkan", data: newTransaksi });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = transaksi.findIndex((t) => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

  const { tanggal, tipe, kategori, keterangan, jumlah } = req.body;
  if (!tanggal || !tipe || !kategori || !keterangan || !jumlah) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (!["pemasukan", "pengeluaran"].includes(tipe)) {
    return res.status(400).json({ message: "Tipe harus pemasukan atau pengeluaran" });
  }

  transaksi[idx] = {
    ...transaksi[idx],
    tanggal,
    tipe,
    kategori,
    keterangan,
    jumlah: parseInt(jumlah),
  };
  res.json({ message: "Transaksi berhasil diubah", data: transaksi[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = transaksi.findIndex((t) => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
  transaksi.splice(idx, 1);
  res.json({ message: "Transaksi berhasil dihapus" });
});

module.exports = router;
