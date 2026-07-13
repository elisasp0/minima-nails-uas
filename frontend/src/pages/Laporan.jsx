import { useEffect, useState, useRef } from "react";
import { getTransaksi, getTransaksiSummary, getBookings, getCustomers, getKasbon, getPackages } from "../api/laporan";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function getMonthRange(monthStr) {
  const [y, m] = monthStr.split("-").map(Number);
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const end = `${y}-${String(m).padStart(2, "0")}-${String(daysInMonth(y, m)).padStart(2, "0")}`;
  return { start, end };
}

function buildDayBuckets(start, end) {
  const buckets = {};
  let d = new Date(start);
  const endD = new Date(end);
  while (d <= endD) {
    const key = d.toISOString().split("T")[0];
    buckets[key] = { pemasukan: 0, pengeluaran: 0 };
    d.setDate(d.getDate() + 1);
  }
  return buckets;
}

function getServicePrice(serviceName, packages) {
  const pkg = packages.find((p) => p.nama.toLowerCase() === serviceName.toLowerCase());
  return pkg ? pkg.harga : 0;
}

export default function Laporan() {
  const printRef = useRef(null);

  const [period, setPeriod] = useState("thisMonth");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [dailyData, setDailyData] = useState({});
  const [topServices, setTopServices] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [kasbonOutstanding, setKasbonOutstanding] = useState(0);
  const [recentTrans, setRecentTrans] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  function getDateRange() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    if (period === "today") return { start: today(), end: today() };
    if (period === "week") {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      return { start: d.toISOString().split("T")[0], end: today() };
    }
    if (period === "thisMonth") return getMonthRange(`${y}-${String(m).padStart(2, "0")}`);
    if (period === "lastMonth") {
      const lm = m === 1 ? 12 : m - 1;
      const ly = m === 1 ? y - 1 : y;
      return getMonthRange(`${ly}-${String(lm).padStart(2, "0")}`);
    }
    return { start: customStart, end: customEnd };
  }

  useEffect(() => {
    loadData();
  }, [period, customStart, customEnd]);

  async function loadData() {
    setLoading(true);
    try {
      const range = getDateRange();
      if (!range.start || !range.end) { setLoading(false); return; }

      const [keuRes, summRes, bookRes, custRes, kasRes, pkgRes] = await Promise.all([
        getTransaksi({ startDate: range.start, endDate: range.end }),
        getTransaksiSummary({ startDate: range.start, endDate: range.end }),
        getBookings({}),
        getCustomers(),
        getKasbon({}),
        getPackages(),
      ]);

      const trans = keuRes.data.data || [];
      const allBookings = bookRes.data.data || [];
      const allCustomers = custRes.data.data || [];
      const allKasbon = kasRes.data.data || [];
      const packages = pkgRes.data.data || [];

      setSummary(summRes.data.data);
      setTotalCustomers(allCustomers.length);
      setTotalBookings(allBookings.length);
      setServices(packages);

      const pendapatanKasbon = allKasbon.filter((k) => k.status === "lunas").reduce((s, k) => s + k.jumlah, 0);
      const sisaKasbon = allKasbon.filter((k) => k.status === "belum lunas").reduce((s, k) => s + k.jumlah, 0);
      setKasbonOutstanding(sisaKasbon);

      const ended = allBookings.filter((b) => b.status === "done" || b.status === "confirmed");
      const serviceCount = {};
      for (const b of ended) {
        const name = b.layanan || "Unknown";
        serviceCount[name] = (serviceCount[name] || 0) + 1;
      }
      const sorted = Object.entries(serviceCount)
        .map(([nama, count]) => ({
          nama,
          count,
          pendapatan: count * getServicePrice(nama, packages),
        }))
        .sort((a, b) => b.count - a.count);
      setTopServices(sorted);

      const buckets = buildDayBuckets(range.start, range.end);
      for (const t of trans) {
        if (buckets[t.tanggal]) {
          if (t.tipe === "pemasukan") buckets[t.tanggal].pemasukan += t.jumlah;
          else buckets[t.tanggal].pengeluaran += t.jumlah;
        }
      }
      setDailyData(buckets);

      const sortedTrans = [...trans].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
      setRecentTrans(sortedTrans.slice(0, 10));
    } catch (e) {
      console.error("Gagal load laporan:", e);
    }
    setLoading(false);
  }

  function handleExportExcel() {
    const range = getDateRange();
    const rows = [["Tanggal", "Tipe", "Kategori", "Keterangan", "Jumlah"]];
    for (const t of recentTrans.length ? recentTrans : []) {
      rows.push([t.tanggal, t.tipe, t.kategori, t.keterangan, t.jumlah]);
    }
    for (const s of topServices) {
      rows.push([`Layanan: ${s.nama}`, "", "", `${s.count}x booking`, s.pendapatan]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-keuangan-${range.start}-to-${range.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPDF() {
    window.print();
  }

  const isCustom = period === "custom";

  const days = Object.entries(dailyData);
  const maxDaily = Math.max(...days.map(([, v]) => Math.max(v.pemasukan, v.pengeluaran, 1)), 1);

  return (
    <div className="page" ref={printRef}>
      <div className="page-header">
        <div>
          <h1>Laporan Usaha</h1>
          <p className="page-subtitle">Rekap penjualan, pengeluaran, dan analisis bisnis</p>
        </div>
        <div className="laporan-actions no-print">
          <button className="btn btn-sm btn-outline" onClick={handleExportExcel}>📥 Excel</button>
          <button className="btn btn-sm btn-outline" onClick={handleExportPDF}>📄 PDF</button>
        </div>
      </div>

      <div className="laporan-filters no-print">
        <div className="filter-tabs">
          {[
            { key: "today", label: "Hari Ini" },
            { key: "week", label: "7 Hari" },
            { key: "thisMonth", label: "Bulan Ini" },
            { key: "lastMonth", label: "Bulan Lalu" },
            { key: "custom", label: "Custom" },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-tab ${period === f.key ? "active" : ""}`}
              onClick={() => setPeriod(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {isCustom && (
          <div className="laporan-date-range">
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <span>s/d</span>
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-text">Memuat laporan...</div>
      ) : (
        <>
          <div className="stats-grid laporan-stats">
            <div className="stat-card">
              <span className="stat-label">Total Pendapatan</span>
              <span className="stat-value income">{formatRupiah(summary.totalPemasukan || 0)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Pengeluaran</span>
              <span className="stat-value expense">{formatRupiah(summary.totalPengeluaran || 0)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Laba Bersih</span>
              <span className={`stat-value ${(summary.saldo || 0) >= 0 ? "income" : "expense"}`}>
                {formatRupiah(summary.saldo || 0)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Booking</span>
              <span className="stat-value">{totalBookings}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pelanggan</span>
              <span className="stat-value">{totalCustomers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Piutang</span>
              <span className="stat-value expense">{formatRupiah(kasbonOutstanding)}</span>
            </div>
          </div>

          <div className="section">
            <h2>Grafik Harian</h2>
            <div className="laporan-chart">
              {days.length === 0 ? (
                <div className="empty-state">Belum ada data periode ini</div>
              ) : (
                days.map(([tanggal, data]) => {
                  const pctPemasukan = (data.pemasukan / maxDaily) * 100;
                  const pctPengeluaran = (data.pengeluaran / maxDaily) * 100;
                  const label = tanggal.slice(5);
                  return (
                    <div key={tanggal} className="chart-col" title={`${tanggal}\nMasuk: ${formatRupiah(data.pemasukan)}\nKeluar: ${formatRupiah(data.pengeluaran)}`}>
                      <div className="chart-bars">
                        <div className="chart-bar bar-income" style={{ height: `${Math.max(pctPemasukan, 2)}%` }} />
                        <div className="chart-bar bar-expense" style={{ height: `${Math.max(pctPengeluaran, 2)}%` }} />
                      </div>
                      <span className="chart-label">{label}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="chart-legend">
              <span><span className="legend-dot dot-income" /> Pemasukan</span>
              <span><span className="legend-dot dot-expense" /> Pengeluaran</span>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h2>Layanan Paling Populer</h2>
              {topServices.length === 0 ? (
                <div className="empty-state">Belum ada data booking selesai</div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Layanan</th>
                        <th>Jumlah Booking</th>
                        <th>Estimasi Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topServices.map((s, i) => (
                        <tr key={i}>
                          <td>{s.nama}</td>
                          <td><span className="badge badge-count">{s.count}x</span></td>
                          <td>{formatRupiah(s.pendapatan)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="section">
              <h2>Transaksi Terbaru</h2>
              {recentTrans.length === 0 ? (
                <div className="empty-state">Belum ada transaksi periode ini</div>
              ) : (
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
                      {recentTrans.map((t) => (
                        <tr key={t.id}>
                          <td>{t.tanggal}</td>
                          <td>{t.keterangan}</td>
                          <td><span className={`tipe tipe-${t.tipe === "pemasukan" ? "pemasukan" : "pengeluaran"}`}>{t.tipe}</span></td>
                          <td className={t.tipe === "pemasukan" ? "text-income" : "text-expense"}>{formatRupiah(t.jumlah)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="page-footer-text no-print">
            <p>Data laporan berdasarkan transaksi keuangan dan booking yang tercatat di sistem.</p>
          </div>
        </>
      )}
    </div>
  );
}
