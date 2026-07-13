const dummyData = {
  dashboard: {
    stats: {
      totalPelanggan: 24,
      totalBookingBulanIni: 18,
      pemasukanBulanIni: 8500000,
      pengeluaranBulanIni: 3200000,
    },
    bookingHariIni: [
      { id: 1, pelanggan: "Siti Rahma", layanan: "Nail Art Minimalis", jam: "10:00", status: "confirmed" },
      { id: 2, pelanggan: "Dewi Lestari", layanan: "Gel Extension", jam: "13:00", status: "confirmed" },
      { id: 3, pelanggan: "Rina Wijaya", layanan: "French Manicure", jam: "15:30", status: "pending" },
    ],
    transaksiTerbaru: [
      { id: 1, tanggal: "2026-07-01", keterangan: "Nail Art Minimalis - Siti", tipe: "pemasukan", jumlah: 250000 },
      { id: 2, tanggal: "2026-07-01", keterangan: "Beli Cat Kuku", tipe: "pengeluaran", jumlah: 150000 },
      { id: 3, tanggal: "2026-06-30", keterangan: "Gel Extension - Dewi", tipe: "pemasukan", jumlah: 350000 },
    ],
  },
  pelanggan: [
    { id: 1, nama: "Siti Rahma", noTelp: "081234567890", totalKunjungan: 5, terakhir: "2026-06-28" },
    { id: 2, nama: "Dewi Lestari", noTelp: "081298765432", totalKunjungan: 3, terakhir: "2026-06-25" },
    { id: 3, nama: "Rina Wijaya", noTelp: "087812345678", totalKunjungan: 1, terakhir: "2026-07-01" },
  ],
};

module.exports = dummyData;
