const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const customerRoutes = require("./routes/customers");
const bookingRoutes = require("./routes/bookings");
const pricelistRoutes = require("./routes/pricelist");
const keuanganRoutes = require("./routes/keuangan");
const stokRoutes = require("./routes/stok");
const portfolioRoutes = require("./routes/portfolio");
const kasbonRoutes = require("./routes/kasbon");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static("uploads"));

// ROUTES API
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/pricelist", pricelistRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/stok", stokRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/kasbon", kasbonRoutes);

// TAMBAHAN: route utama "/"
app.get("/", (req, res) => {
  res.send("Minima Nails Backend Running 🚀");
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Minima Nails API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});