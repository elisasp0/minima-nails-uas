const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

let packages = [
  { id: 1, nama: "Nail Art Minimalis", harga: 150000, deskripsi: "Desain simple 1 warna + top coat", durasi: 60 },
  { id: 2, nama: "Nail Art Glitter", harga: 200000, deskripsi: "Desain dengan glitter dan aksen", durasi: 75 },
  { id: 3, nama: "French Manicure", harga: 180000, deskripsi: "French tip classic dengan base natural", durasi: 60 },
  { id: 4, nama: "Gel Extension", harga: 350000, deskripsi: "Extension gel dengan bentuk sesuai permintaan", durasi: 120 },
  { id: 5, nama: "Acrylic Nail", harga: 400000, deskripsi: "Akrilik full set dengan desain custom", durasi: 150 },
  { id: 6, nama: "Nail Art Custom", harga: 300000, deskripsi: "Desain bebas sesuai request", durasi: 90 },
  { id: 7, nama: "Basic Manicure", harga: 80000, deskripsi: "Potong kuku, rapiin kutikula, polish", durasi: 30 },
  { id: 8, nama: "Pedicure", harga: 100000, deskripsi: "Perawatan kaki + cat kuku", durasi: 40 },
];
let nextPackageId = 9;

let upgrades = [
  { id: 1, nama: "Nail Art 3D", harga: 50000, deskripsi: "Tambahan aksen 3D" },
  { id: 2, nama: "Stamp Art", harga: 25000, deskripsi: "Motif stamp tambahan" },
  { id: 3, nama: "Swavorski Crystal", harga: 75000, deskripsi: "Kristal Swavorski per 5 pcs" },
  { id: 4, nama: "Glitter Gradient", harga: 30000, deskripsi: "Efek gradasi glitter" },
  { id: 5, nama: "Chrome Effect", harga: 40000, deskripsi: "Efek chrome metalik" },
  { id: 6, nama: "Cat Eye", harga: 35000, deskripsi: "Efek cat eye magnetik" },
  { id: 7, nama: "Extra Length", harga: 100000, deskripsi: "Tambahan panjang untuk extension" },
  { id: 8, nama: "Nail Art Per Kuku", harga: 15000, deskripsi: "Desain khusus per kuku" },
];
let nextUpgradeId = 9;

router.get("/packages", authenticateToken, (req, res) => {
  res.json({ data: packages });
});

router.get("/packages/:id", authenticateToken, (req, res) => {
  const pkg = packages.find((p) => p.id === parseInt(req.params.id));
  if (!pkg) return res.status(404).json({ message: "Paket tidak ditemukan" });
  res.json({ data: pkg });
});

router.post("/packages", authenticateToken, (req, res) => {
  const { nama, harga, deskripsi, durasi } = req.body;
  if (!nama || !harga) {
    return res.status(400).json({ message: "Nama dan harga harus diisi" });
  }
  const newPackage = {
    id: nextPackageId++,
    nama,
    harga: parseInt(harga),
    deskripsi: deskripsi || "",
    durasi: durasi ? parseInt(durasi) : 60,
  };
  packages.push(newPackage);
  res.status(201).json({ message: "Paket berhasil ditambahkan", data: newPackage });
});

router.put("/packages/:id", authenticateToken, (req, res) => {
  const idx = packages.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Paket tidak ditemukan" });

  const { nama, harga, deskripsi, durasi } = req.body;
  if (!nama || !harga) {
    return res.status(400).json({ message: "Nama dan harga harus diisi" });
  }

  packages[idx] = {
    ...packages[idx],
    nama,
    harga: parseInt(harga),
    deskripsi: deskripsi || "",
    durasi: durasi ? parseInt(durasi) : packages[idx].durasi,
  };
  res.json({ message: "Paket berhasil diubah", data: packages[idx] });
});

router.delete("/packages/:id", authenticateToken, (req, res) => {
  const idx = packages.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Paket tidak ditemukan" });
  packages.splice(idx, 1);
  res.json({ message: "Paket berhasil dihapus" });
});

router.get("/upgrades", authenticateToken, (req, res) => {
  res.json({ data: upgrades });
});

router.get("/upgrades/:id", authenticateToken, (req, res) => {
  const upg = upgrades.find((u) => u.id === parseInt(req.params.id));
  if (!upg) return res.status(404).json({ message: "Upgrade tidak ditemukan" });
  res.json({ data: upg });
});

router.post("/upgrades", authenticateToken, (req, res) => {
  const { nama, harga, deskripsi } = req.body;
  if (!nama || !harga) {
    return res.status(400).json({ message: "Nama dan harga harus diisi" });
  }
  const newUpgrade = {
    id: nextUpgradeId++,
    nama,
    harga: parseInt(harga),
    deskripsi: deskripsi || "",
  };
  upgrades.push(newUpgrade);
  res.status(201).json({ message: "Upgrade berhasil ditambahkan", data: newUpgrade });
});

router.put("/upgrades/:id", authenticateToken, (req, res) => {
  const idx = upgrades.findIndex((u) => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Upgrade tidak ditemukan" });

  const { nama, harga, deskripsi } = req.body;
  if (!nama || !harga) {
    return res.status(400).json({ message: "Nama dan harga harus diisi" });
  }

  upgrades[idx] = {
    ...upgrades[idx],
    nama,
    harga: parseInt(harga),
    deskripsi: deskripsi || "",
  };
  res.json({ message: "Upgrade berhasil diubah", data: upgrades[idx] });
});

router.delete("/upgrades/:id", authenticateToken, (req, res) => {
  const idx = upgrades.findIndex((u) => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Upgrade tidak ditemukan" });
  upgrades.splice(idx, 1);
  res.json({ message: "Upgrade berhasil dihapus" });
});

router.post("/calculate", authenticateToken, (req, res) => {
  const { packageId, upgradeIds } = req.body;

  if (!packageId) {
    return res.status(400).json({ message: "Paket harus dipilih" });
  }

  const pkg = packages.find((p) => p.id === parseInt(packageId));
  if (!pkg) {
    return res.status(404).json({ message: "Paket tidak ditemukan" });
  }

  let totalUpgrade = 0;
  const selectedUpgrades = [];
  if (upgradeIds && Array.isArray(upgradeIds)) {
    for (const id of upgradeIds) {
      const upg = upgrades.find((u) => u.id === parseInt(id));
      if (upg) {
        totalUpgrade += upg.harga;
        selectedUpgrades.push(upg);
      }
    }
  }

  const totalHarga = pkg.harga + totalUpgrade;

  res.json({
    data: {
      package: pkg,
      upgrades: selectedUpgrades,
      subtotalPackage: pkg.harga,
      subtotalUpgrade: totalUpgrade,
      totalHarga,
    },
  });
});

module.exports = router;
