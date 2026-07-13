const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads", "portfolio");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const kategoriList = ["minimalis", "glitter", "french", "custom"];

const placeholderFiles = {};

function generatePlaceholder(id, label, bgColor, accentColor, type) {
  let svg = "";
  if (type === "minimalis") {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${bgColor}"/>
      <rect x="80" y="40" width="240" height="320" rx="60" fill="${accentColor}" opacity="0.15"/>
      <line x1="160" y1="140" x2="240" y2="140" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <line x1="180" y1="160" x2="220" y2="160" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
      <line x1="150" y1="280" x2="250" y2="280" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <text x="200" y="360" text-anchor="middle" fill="${accentColor}" font-size="14" font-family="sans-serif">${label}</text>
    </svg>`;
  } else if (type === "glitter") {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${bgColor}"/>
      <rect x="80" y="40" width="240" height="320" rx="60" fill="${accentColor}" opacity="0.2"/>
      <circle cx="150" cy="120" r="3" fill="#fff" opacity="0.8"/>
      <circle cx="250" cy="150" r="4" fill="#fff" opacity="0.6"/>
      <circle cx="180" cy="200" r="2" fill="#fff" opacity="0.9"/>
      <circle cx="220" cy="170" r="3" fill="#fff" opacity="0.7"/>
      <circle cx="160" cy="260" r="4" fill="#fff" opacity="0.5"/>
      <circle cx="240" cy="280" r="2" fill="#fff" opacity="0.8"/>
      <circle cx="200" cy="300" r="3" fill="#fff" opacity="0.6"/>
      <text x="200" y="360" text-anchor="middle" fill="${accentColor}" font-size="14" font-family="sans-serif">${label}</text>
    </svg>`;
  } else if (type === "french") {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${bgColor}"/>
      <rect x="80" y="40" width="240" height="320" rx="60" fill="#f5e6d3" opacity="0.5"/>
      <path d="M 80 80 Q 200 50 320 80 L 320 120 Q 200 90 80 120 Z" fill="#fff" opacity="0.8"/>
      <text x="200" y="360" text-anchor="middle" fill="${accentColor}" font-size="14" font-family="sans-serif">${label}</text>
    </svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${bgColor}"/>
      <rect x="80" y="40" width="240" height="320" rx="60" fill="${accentColor}" opacity="0.12"/>
      <circle cx="180" cy="160" r="18" fill="#ff8a80" opacity="0.7"/>
      <circle cx="220" cy="180" r="12" fill="#f48fb1" opacity="0.6"/>
      <circle cx="160" cy="200" r="8" fill="#ff8a80" opacity="0.5"/>
      <circle cx="240" cy="210" r="10" fill="#f48fb1" opacity="0.5"/>
      <circle cx="200" cy="230" r="6" fill="#ff8a80" opacity="0.4"/>
      <circle cx="170" cy="140" r="5" fill="#f48fb1" opacity="0.6"/>
      <circle cx="230" cy="150" r="7" fill="#ff8a80" opacity="0.5"/>
      <text x="200" y="360" text-anchor="middle" fill="${accentColor}" font-size="14" font-family="sans-serif">${label}</text>
    </svg>`;
  }
  const filename = `placeholder-${id}.svg`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, svg);
  return filename;
}

placeholderFiles["pink-minimalis"] = generatePlaceholder("pm", "Pink Minimalist", "#fce4ec", "#e91e63", "minimalis");
placeholderFiles["silver-glitter"] = generatePlaceholder("sg", "Silver Glitter", "#eceff1", "#78909c", "glitter");
placeholderFiles["classic-french"] = generatePlaceholder("cf", "Classic French", "#fff8e1", "#ff8f00", "french");
placeholderFiles["sakura-blossom"] = generatePlaceholder("sb", "Sakura Blossom", "#f3e5f5", "#9c27b0", "custom");

let portfolio = [
  {
    id: 1, judul: "Pink Minimalist", kategori: "minimalis",
    deskripsi: "Desain minimalis warna pink lembut dengan aksen garis tipis elegan, cocok untuk sehari-hari",
    gambar: placeholderFiles["pink-minimalis"], createdAt: "2026-06-15",
  },
  {
    id: 2, judul: "Silver Glitter", kategori: "glitter",
    deskripsi: "Efek glitter silver berkilau dengan gradasi mengkilap, cocok untuk pesta",
    gambar: placeholderFiles["silver-glitter"], createdAt: "2026-06-18",
  },
  {
    id: 3, judul: "Classic French", kategori: "french",
    deskripsi: "French manicure klasik dengan ujung putih bersih dan base natural nude",
    gambar: placeholderFiles["classic-french"], createdAt: "2026-06-20",
  },
  {
    id: 4, judul: "Sakura Blossom", kategori: "custom",
    deskripsi: "Desain custom bunga sakura dengan kelopak pink lembut, terinspirasi musim semi Jepang",
    gambar: placeholderFiles["sakura-blossom"], createdAt: "2026-06-22",
  },
];
let nextId = 5;

function saveBase64Image(base64Str, id) {
  const matches = base64Str.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;
  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const data = Buffer.from(matches[2], "base64");
  const filename = `portfolio-${id}-${Date.now()}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, data);
  return filename;
}

router.get("/", authenticateToken, (req, res) => {
  const { kategori } = req.query;
  let result = [...portfolio];
  if (kategori) result = result.filter((p) => p.kategori === kategori);
  result.sort((a, b) => b.id - a.id);
  res.json({ data: result });
});

router.get("/kategori", authenticateToken, (req, res) => {
  res.json({ data: kategoriList });
});

router.get("/:id", authenticateToken, (req, res) => {
  const item = portfolio.find((p) => p.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Portofolio tidak ditemukan" });
  res.json({ data: item });
});

router.post("/", authenticateToken, (req, res) => {
  const { judul, kategori, deskripsi, gambar } = req.body;

  if (!judul || !kategori) {
    return res.status(400).json({ message: "Judul dan kategori harus diisi" });
  }
  if (!kategoriList.includes(kategori)) {
    return res.status(400).json({ message: "Kategori tidak valid" });
  }

  const newItem = {
    id: nextId++,
    judul,
    kategori,
    deskripsi: deskripsi || "",
    gambar: null,
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (gambar) {
    const filename = saveBase64Image(gambar, newItem.id);
    if (filename) newItem.gambar = filename;
  }

  portfolio.unshift(newItem);
  res.status(201).json({ message: "Portofolio berhasil ditambahkan", data: newItem });
});

router.put("/:id", authenticateToken, (req, res) => {
  const idx = portfolio.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Portofolio tidak ditemukan" });

  const { judul, kategori, deskripsi, gambar } = req.body;
  if (!judul || !kategori) {
    return res.status(400).json({ message: "Judul dan kategori harus diisi" });
  }
  if (!kategoriList.includes(kategori)) {
    return res.status(400).json({ message: "Kategori tidak valid" });
  }

  if (gambar && gambar.startsWith("data:image")) {
    if (portfolio[idx].gambar) {
      const oldPath = path.join(uploadDir, portfolio[idx].gambar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const filename = saveBase64Image(gambar, portfolio[idx].id);
    if (filename) portfolio[idx].gambar = filename;
  }

  portfolio[idx] = {
    ...portfolio[idx],
    judul,
    kategori,
    deskripsi: deskripsi || "",
  };

  res.json({ message: "Portofolio berhasil diubah", data: portfolio[idx] });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const idx = portfolio.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Portofolio tidak ditemukan" });

  if (portfolio[idx].gambar) {
    const filePath = path.join(uploadDir, portfolio[idx].gambar);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  portfolio.splice(idx, 1);
  res.json({ message: "Portofolio berhasil dihapus" });
});

module.exports = router;
