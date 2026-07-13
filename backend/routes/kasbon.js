const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads", "kasbon");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let kasbonList = [
  {
    id: 1, pelangganNama: "Siti Rahma", jumlah: 150000, keterangan: "Sisa pembayaran nail art",
    tanggal: "2026-06-20", jatuhTempo: "2026-07-05", status: "belum lunas", fotoBukti: null, createdAt: "2026-06-20",
  },
  {
    id: 2, pelangganNama: "Dewi Lestari", jumlah: 350000, keterangan: "DP Gel Extension",
    tanggal: "2026-06-25", jatuhTempo: "2026-07-10", status: "belum lunas", fotoBukti: null, createdAt: "2026-06-25",
  },
  {
    id: 3, pelangganNama: "Rina Wijaya", jumlah: 100000, keterangan: "Kasbon nail art custom",
    tanggal: "2026-06-28", jatuhTempo: "2026-07-03", status: "belum lunas", fotoBukti: null, createdAt: "2026-06-28",
  },
  {
    id: 4, pelangganNama: "Siti Rahma", jumlah: 200000, keterangan: "Top up nail extension",
    tanggal: "2026-06-15", jatuhTempo: "2026-06-29", status: "lunas", fotoBukti: null, createdAt: "2026-06-15",
  },
  {
    id: 5, pelangganNama: "Budi Santoso", jumlah: 50000, keterangan: "Tambahan nail art per kuku",
    tanggal: "2026-06-30", jatuhTempo: "2026-07-02", status: "belum lunas", fotoBukti: null, createdAt: "2026-06-30",
  },
];
let nextId = 6;

function saveBase64Image(base64Str, id) {
  const matches = base64Str.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;
  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const data = Buffer.from(matches[2], "base64");
  const filename = `kasbon-${id}-${Date.now()}.${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), data);
  return filename;
}

router.get("/", authenticateToken, (req, res) => {
  const { status, search } = req.query;
  let result = [...kasbonList];
  if (status) result = result.filter((k) => k.status === status);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((k) => k.pelangganNama.toLowerCase().includes(q));
  }
  result.sort((a, b) => b.id - a.id);
  res.json({ data: result });
});

router.get("/due-soon", authenticateToken, (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const due = kasbonList.filter((k) => {
    if (k.status === "lunas") return false;
    const dueDate = new Date(k.jatuhTempo);
    return dueDate <= threeDaysFromNow;
  });

  const overdue = due.filter((k) => new Date(k.jatuhTempo) < today);
  const soon = due.filter((k) => new Date(k.jatuhTempo) >= today);

  res.json({ data: { overdue, soon }, total: due.length });
});

router.get("/:id", authenticateToken, (req, res) => {
  const item = kasbonList.find((k) => k.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Kasbon tidak ditemukan" });
  res.json({ data: item });
});

router.post("/", authenticateToken, (req, res) => {
  const { pelangganNama, jumlah, keterangan, tanggal, jatuhTempo, fotoBukti } = req.body;

  if (!pelangganNama || !jumlah || !tanggal || !jatuhTempo) {
    return res.status(400).json({ message: "Nama pelanggan, jumlah, tanggal, dan jatuh tempo harus diisi" });
  }

  const newItem = {
    id: nextId++,
    pelangganNama,
    jumlah: parseInt(jumlah),
    keterangan: keterangan || "",
    tanggal,
    jatuhTempo,
    status: "belum lunas",
    fotoBukti: null,
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (fotoBukti) {
    const filename = saveBase64Image(fotoBukti, newItem.id);
    if (filename) newItem.fotoBukti = filename;
  }

  kasbonList.unshift(newItem);
  res.status(201).json({ message: "Kasbon berhasil ditambahkan", data: newItem });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = kasbonList.findIndex((k) => k.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Kasbon tidak ditemukan" });

  const { pelangganNama, jumlah, keterangan, tanggal, jatuhTempo, fotoBukti } = req.body;
  if (!pelangganNama || !jumlah || !tanggal || !jatuhTempo) {
    return res.status(400).json({ message: "Nama pelanggan, jumlah, tanggal, dan jatuh tempo harus diisi" });
  }

  if (fotoBukti && fotoBukti.startsWith("data:image")) {
    if (kasbonList[idx].fotoBukti) {
      const oldPath = path.join(uploadDir, kasbonList[idx].fotoBukti);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const filename = saveBase64Image(fotoBukti, kasbonList[idx].id);
    if (filename) kasbonList[idx].fotoBukti = filename;
  }

  kasbonList[idx] = {
    ...kasbonList[idx],
    pelangganNama,
    jumlah: parseInt(jumlah),
    keterangan: keterangan || "",
    tanggal,
    jatuhTempo,
  };

  res.json({ message: "Kasbon berhasil diubah", data: kasbonList[idx] });
});

router.patch("/:id/status", authenticateToken, (req, res) => {
  const idx = kasbonList.findIndex((k) => k.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Kasbon tidak ditemukan" });

  const { status } = req.body;
  if (!["lunas", "belum lunas"].includes(status)) {
    return res.status(400).json({ message: "Status harus lunas atau belum lunas" });
  }

  kasbonList[idx].status = status;
  res.json({ message: "Status kasbon berhasil diubah", data: kasbonList[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = kasbonList.findIndex((k) => k.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Kasbon tidak ditemukan" });

  if (kasbonList[idx].fotoBukti) {
    const filePath = path.join(uploadDir, kasbonList[idx].fotoBukti);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  kasbonList.splice(idx, 1);
  res.json({ message: "Kasbon berhasil dihapus" });
});

module.exports = router;
