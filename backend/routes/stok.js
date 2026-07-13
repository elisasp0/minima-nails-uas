const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const kategoriList = ["Gel polish", "acrylic", "dekorasi", "nail tip", "alat", "finishing", "perawatan", "lainnya"];

let items = [
  { id: 1, nama: "Gel Polish Merah", kategori: "Gel polish", stokSaatIni: 6, stokMinimum: 3, satuan: "botol", hargaBeli: 35000, hargaJual: 75000, createdAt: "2026-06-01" },
  { id: 2, nama: "Gel Polish Putih", kategori: "Gel polish", stokSaatIni: 2, stokMinimum: 3, satuan: "botol", hargaBeli: 35000, hargaJual: 75000, createdAt: "2026-06-01" },
  { id: 3, nama: "Gel Polish Nude", kategori: "Gel polish", stokSaatIni: 4, stokMinimum: 2, satuan: "botol", hargaBeli: 35000, hargaJual: 75000, createdAt: "2026-06-05" },
  { id: 4, nama: "Acrylic Liquid", kategori: "acrylic", stokSaatIni: 3, stokMinimum: 2, satuan: "botol", hargaBeli: 85000, hargaJual: 150000, createdAt: "2026-06-05" },
  { id: 5, nama: "Acrylic Powder Clear", kategori: "acrylic", stokSaatIni: 1, stokMinimum: 2, satuan: "box", hargaBeli: 60000, hargaJual: 120000, createdAt: "2026-06-10" },
  { id: 6, nama: "Glitter Pack", kategori: "dekorasi", stokSaatIni: 5, stokMinimum: 3, satuan: "box", hargaBeli: 15000, hargaJual: 35000, createdAt: "2026-06-10" },
  { id: 7, nama: "Nail Sticker", kategori: "dekorasi", stokSaatIni: 8, stokMinimum: 5, satuan: "pack", hargaBeli: 10000, hargaJual: 25000, createdAt: "2026-06-12" },
  { id: 8, nama: "Nail Tip Natural", kategori: "nail tip", stokSaatIni: 100, stokMinimum: 30, satuan: "pcs", hargaBeli: 500, hargaJual: 1500, createdAt: "2026-06-15" },
  { id: 9, nama: "Nail Tip Coffin", kategori: "nail tip", stokSaatIni: 60, stokMinimum: 20, satuan: "pcs", hargaBeli: 700, hargaJual: 2000, createdAt: "2026-06-15" },
  { id: 10, nama: "Nail File", kategori: "alat", stokSaatIni: 12, stokMinimum: 5, satuan: "pcs", hargaBeli: 5000, hargaJual: 15000, createdAt: "2026-06-10" },
  { id: 11, nama: "Cuticle Pusher", kategori: "alat", stokSaatIni: 3, stokMinimum: 2, satuan: "pcs", hargaBeli: 15000, hargaJual: 35000, createdAt: "2026-06-10" },
  { id: 12, nama: "UV Lamp 48W", kategori: "alat", stokSaatIni: 1, stokMinimum: 1, satuan: "unit", hargaBeli: 250000, hargaJual: 450000, createdAt: "2026-06-15" },
  { id: 13, nama: "Top Coat Glossy", kategori: "finishing", stokSaatIni: 4, stokMinimum: 2, satuan: "botol", hargaBeli: 30000, hargaJual: 60000, createdAt: "2026-06-18" },
  { id: 14, nama: "Top Coat Matte", kategori: "finishing", stokSaatIni: 1, stokMinimum: 2, satuan: "botol", hargaBeli: 30000, hargaJual: 60000, createdAt: "2026-06-18" },
  { id: 15, nama: "Base Coat", kategori: "finishing", stokSaatIni: 5, stokMinimum: 3, satuan: "botol", hargaBeli: 28000, hargaJual: 55000, createdAt: "2026-06-20" },
  { id: 16, nama: "Cuticle Oil", kategori: "perawatan", stokSaatIni: 3, stokMinimum: 2, satuan: "botol", hargaBeli: 20000, hargaJual: 45000, createdAt: "2026-06-22" },
  { id: 17, nama: "Hand Cream", kategori: "perawatan", stokSaatIni: 4, stokMinimum: 3, satuan: "tube", hargaBeli: 15000, hargaJual: 35000, createdAt: "2026-06-22" },
  { id: 18, nama: "Nail Art Brush Set", kategori: "alat", stokSaatIni: 6, stokMinimum: 4, satuan: "set", hargaBeli: 45000, hargaJual: 90000, createdAt: "2026-06-25" },
  { id: 19, nama: "Nail Polish Remover", kategori: "perawatan", stokSaatIni: 2, stokMinimum: 3, satuan: "botol", hargaBeli: 12000, hargaJual: 25000, createdAt: "2026-06-28" },
  { id: 20, nama: "Nail Art Rhinestone", kategori: "dekorasi", stokSaatIni: 1, stokMinimum: 2, satuan: "pack", hargaBeli: 20000, hargaJual: 40000, createdAt: "2026-06-30" },
];
let nextId = 21;

router.get("/", authenticateToken, (req, res) => {
  const { search, kategori } = req.query;
  let result = [...items];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((i) => i.nama.toLowerCase().includes(q) || i.kategori.includes(q));
  }
  if (kategori) result = result.filter((i) => i.kategori === kategori);
  res.json({ data: result });
});

router.get("/low-stock", authenticateToken, (req, res) => {
  const low = items.filter((i) => i.stokSaatIni <= i.stokMinimum);
  res.json({ data: low, total: low.length });
});

router.get("/kategori", authenticateToken, (req, res) => {
  res.json({ data: kategoriList });
});

router.get("/:id", authenticateToken, (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Bahan tidak ditemukan" });
  res.json({ data: item });
});

router.post("/", authenticateToken, (req, res) => {
  const { nama, kategori, stokSaatIni, stokMinimum, satuan, hargaBeli, hargaJual } = req.body;
  if (!nama || !kategori || stokSaatIni === undefined || stokMinimum === undefined || !satuan) {
    return res.status(400).json({ message: "Nama, kategori, stok, stok minimum, dan satuan harus diisi" });
  }
  if (!kategoriList.includes(kategori)) {
    return res.status(400).json({ message: "Kategori tidak valid" });
  }
  const newItem = {
    id: nextId++,
    nama,
    kategori,
    stokSaatIni: parseInt(stokSaatIni),
    stokMinimum: parseInt(stokMinimum),
    satuan,
    hargaBeli: hargaBeli ? parseInt(hargaBeli) : 0,
    hargaJual: hargaJual ? parseInt(hargaJual) : 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  items.unshift(newItem);
  res.status(201).json({ message: "Bahan berhasil ditambahkan", data: newItem });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Bahan tidak ditemukan" });

  const { nama, kategori, stokSaatIni, stokMinimum, satuan, hargaBeli, hargaJual } = req.body;
  if (!nama || !kategori || stokSaatIni === undefined || stokMinimum === undefined || !satuan) {
    return res.status(400).json({ message: "Nama, kategori, stok, stok minimum, dan satuan harus diisi" });
  }
  if (!kategoriList.includes(kategori)) {
    return res.status(400).json({ message: "Kategori tidak valid" });
  }

  items[idx] = {
    ...items[idx],
    nama,
    kategori,
    stokSaatIni: parseInt(stokSaatIni),
    stokMinimum: parseInt(stokMinimum),
    satuan,
    hargaBeli: hargaBeli ? parseInt(hargaBeli) : 0,
    hargaJual: hargaJual ? parseInt(hargaJual) : 0,
  };
  res.json({ message: "Bahan berhasil diubah", data: items[idx] });
});

router.patch("/:id/stok", authenticateToken, (req, res) => {
  const idx = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Bahan tidak ditemukan" });

  const { operasi, jumlah } = req.body;
  if (!["masuk", "keluar"].includes(operasi) || !jumlah || jumlah < 1) {
    return res.status(400).json({ message: "Operasi (masuk/keluar) dan jumlah valid harus diisi" });
  }

  if (operasi === "masuk") {
    items[idx].stokSaatIni += parseInt(jumlah);
  } else {
    if (items[idx].stokSaatIni < parseInt(jumlah)) {
      return res.status(400).json({ message: `Stok tidak mencukupi. Sisa: ${items[idx].stokSaatIni} ${items[idx].satuan}` });
    }
    items[idx].stokSaatIni -= parseInt(jumlah);
  }

  res.json({ message: `Stok berhasil di${operasi}kan`, data: items[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Bahan tidak ditemukan" });
  items.splice(idx, 1);
  res.json({ message: "Bahan berhasil dihapus" });
});

module.exports = router;
