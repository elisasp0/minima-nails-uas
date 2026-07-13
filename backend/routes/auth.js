const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, authenticateToken } = require("../middleware/auth");

const router = express.Router();

const dummyUser = {
  id: 1,
  username: "admin",
  password: bcrypt.hashSync("admin123", 10),
  nama: "Admin Minima Nails",
  role: "admin",
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi" });
  }

  if (username !== dummyUser.username) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const validPassword = bcrypt.compareSync(password, dummyUser.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = jwt.sign(
    { id: dummyUser.id, username: dummyUser.username, nama: dummyUser.nama, role: dummyUser.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    message: "Login berhasil",
    token,
    user: {
      id: dummyUser.id,
      username: dummyUser.username,
      nama: dummyUser.nama,
      role: dummyUser.role,
    },
  });
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      nama: req.user.nama,
      role: req.user.role,
    },
  });
});

module.exports = router;
