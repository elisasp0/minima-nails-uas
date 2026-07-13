const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const dummyData = require("../data/dummy");

const router = express.Router();

router.get("/stats", authenticateToken, (req, res) => {
  res.json(dummyData.dashboard);
});

router.get("/pelanggan", authenticateToken, (req, res) => {
  res.json(dummyData.pelanggan);
});

module.exports = router;
