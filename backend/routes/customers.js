const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

let customers = [
  { id: 1, nama: "Siti Rahma", noTelp: "081234567890", alamat: "Bandung", email: "siti@mail.com", totalKunjungan: 5, terakhir: "2026-06-28", createdAt: "2026-01-15" },
  { id: 2, nama: "Dewi Lestari", noTelp: "081298765432", alamat: "Jakarta", email: "dewi@mail.com", totalKunjungan: 3, terakhir: "2026-06-25", createdAt: "2026-02-10" },
  { id: 3, nama: "Rina Wijaya", noTelp: "087812345678", alamat: "Surabaya", email: "rina@mail.com", totalKunjungan: 1, terakhir: "2026-07-01", createdAt: "2026-06-20" },
];
let nextId = 4;

router.get("/", authenticateToken, (req, res) => {
  const { search } = req.query;
  let result = customers;
  if (search) {
    const q = search.toLowerCase();
    result = customers.filter((c) => c.nama.toLowerCase().includes(q) || c.noTelp.includes(q));
  }
  res.json({ data: result });
});

router.get("/:id", authenticateToken, (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
  res.json({ data: customer });
});

router.post("/", authenticateToken, (req, res) => {
  const { nama, noTelp, alamat, email } = req.body;
  if (!nama || !noTelp) {
    return res.status(400).json({ message: "Nama dan No. Telepon harus diisi" });
  }

  const newCustomer = {
    id: nextId++,
    nama,
    noTelp,
    alamat: alamat || "",
    email: email || "",
    totalKunjungan: 0,
    terakhir: null,
    createdAt: new Date().toISOString().split("T")[0],
  };
  customers.unshift(newCustomer);
  res.status(201).json({ message: "Pelanggan berhasil ditambahkan", data: newCustomer });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = customers.findIndex((c) => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });

  const { nama, noTelp, alamat, email } = req.body;
  if (!nama || !noTelp) {
    return res.status(400).json({ message: "Nama dan No. Telepon harus diisi" });
  }

  customers[idx] = { ...customers[idx], nama, noTelp, alamat: alamat || "", email: email || "" };
  res.json({ message: "Pelanggan berhasil diubah", data: customers[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = customers.findIndex((c) => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });

  customers.splice(idx, 1);
  res.json({ message: "Pelanggan berhasil dihapus" });
});

module.exports = router;
