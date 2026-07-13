import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getDashboardPelanggan } from "../api/auth";
import { Users, CalendarCheck, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [booking, setBooking] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);

  useEffect(() => {
    getDashboardStats().then((res) => {
      setStats(res.data.stats);
      setBooking(res.data.bookingHariIni);
      setTransaksi(res.data.transaksiTerbaru);
    });
    getDashboardPelanggan().then((res) => setPelanggan(res.data));
  }, []);

  function formatRp(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <div className="dashboard">
      <p className="dashboard-welcome">Selamat datang kembali, <strong>{user?.nama}</strong></p>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
              <Users size={22} />
            </div>
            <div className="stat-card-body">
              <span className="stat-label">Total Pelanggan</span>
              <span className="stat-value">{stats.totalPelanggan}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#e3f2fd", color: "#1565c0" }}>
              <CalendarCheck size={22} />
            </div>
            <div className="stat-card-body">
              <span className="stat-label">Booking Bulan Ini</span>
              <span className="stat-value">{stats.totalBookingBulanIni}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
              <TrendingUp size={22} />
            </div>
            <div className="stat-card-body">
              <span className="stat-label">Pemasukan Bulan Ini</span>
              <span className="stat-value income">{formatRp(stats.pemasukanBulanIni)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#fce4ec", color: "#c62828" }}>
              <TrendingDown size={22} />
            </div>
            <div className="stat-card-body">
              <span className="stat-label">Pengeluaran Bulan Ini</span>
              <span className="stat-value expense">{formatRp(stats.pengeluaranBulanIni)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h2>Booking Hari Ini</h2>
            {booking.length > 0 && <span className="section-badge">{booking.length}</span>}
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Jam</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {booking.length === 0 && (
                  <tr><td colSpan={4} className="empty-row">Tidak ada booking hari ini</td></tr>
                )}
                {booking.map((b) => (
                  <tr key={b.id}>
                    <td><span className="td-name">{b.pelanggan}</span></td>
                    <td>{b.layanan}</td>
                    <td>{b.jam}</td>
                    <td>
                      <span className={`status status-${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Transaksi Terbaru</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Tipe</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.length === 0 && (
                  <tr><td colSpan={4} className="empty-row">Belum ada transaksi</td></tr>
                )}
                {transaksi.map((t) => (
                  <tr key={t.id}>
                    <td>{t.tanggal}</td>
                    <td>{t.keterangan}</td>
                    <td>
                      <span className={`status tipe-${t.tipe}`}>{t.tipe}</span>
                    </td>
                    <td className={t.tipe === "pemasukan" ? "income" : "expense"}>
                      {formatRp(t.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Pelanggan Terbaru</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>No. Telepon</th>
                  <th>Kunjungan</th>
                  <th>Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {pelanggan.length === 0 && (
                  <tr><td colSpan={4} className="empty-row">Belum ada pelanggan</td></tr>
                )}
                {pelanggan.map((p) => (
                  <tr key={p.id}>
                    <td><span className="td-name">{p.nama}</span></td>
                    <td>{p.noTelp}</td>
                    <td>{p.totalKunjungan}x</td>
                    <td>{p.terakhir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
