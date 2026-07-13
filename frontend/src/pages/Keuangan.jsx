import { useEffect, useState } from "react";
import { getTransaksi, getTransaksiSummary, getKategori, createTransaksi, deleteTransaksi } from "../api/keuangan";

export default function Keuangan() {
  const [transaksi, setTransaksi] = useState([]);
  const [summary, setSummary] = useState(null);
  const [kategori, setKategori] = useState({ pemasukan: [], pengeluaran: [] });
  const [filterTipe, setFilterTipe] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split("T")[0], tipe: "pemasukan", kategori: "layanan", keterangan: "", jumlah: "" });

  useEffect(() => {
    loadData();
    getKategori().then((res) => setKategori(res.data.data));
  }, []);

  useEffect(() => {
    loadData();
  }, [filterTipe]);

  async function loadData() {
    const params = filterTipe ? { tipe: filterTipe } : {};
    const [transRes, sumRes] = await Promise.all([
      getTransaksi(params),
      getTransaksiSummary(),
    ]);
    setTransaksi(transRes.data.data);
    setSummary(sumRes.data.data);
  }

  function formatRp(angka) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  async function handleSubmit() {
    if (!form.tanggal || !form.keterangan || !form.jumlah) return;
    await createTransaksi(form);
    setShowModal(false);
    setForm({ tanggal: new Date().toISOString().split("T")[0], tipe: "pemasukan", kategori: "layanan", keterangan: "", jumlah: "" });
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus transaksi ini?")) return;
    await deleteTransaksi(id);
    loadData();
  }

  function handleTipeChange(tipe) {
    setForm({ ...form, tipe, kategori: tipe === "pemasukan" ? kategori.pemasukan[0] : kategori.pengeluaran[0] });
  }

  const kategoriList = form.tipe === "pemasukan" ? kategori.pemasukan : kategori.pengeluaran;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Keuangan</h1>
          <p className="page-subtitle">Pemasukan & Pengeluaran</p>
        </div>
        <button className="btn btn-primary" style={{ width: "auto", padding: "8px 16px", fontSize: "14px" }} onClick={() => setShowModal(true)}>+ Tambah</button>
      </div>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Pemasukan</span>
            <span className="stat-value income">{formatRp(summary.totalPemasukan)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Pengeluaran</span>
            <span className="stat-value expense">{formatRp(summary.totalPengeluaran)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Saldo</span>
            <span className={`stat-value ${summary.saldo >= 0 ? "income" : "expense"}`}>{formatRp(summary.saldo)}</span>
          </div>
        </div>
      )}

      {summary && (
        <div className="section" style={{ marginBottom: 20 }}>
          <h2>Grafik Sederhana</h2>
          <div className="chart-bars">
            <div className="chart-bar-group">
              <span className="chart-label">Pemasukan</span>
              <div className="chart-track">
                <div className="chart-fill chart-fill-income" style={{ width: `${Math.min(100, (summary.totalPemasukan / (summary.totalPemasukan + summary.totalPengeluaran || 1)) * 100)}%` }}></div>
              </div>
              <span className="chart-value">{formatRp(summary.totalPemasukan)}</span>
            </div>
            <div className="chart-bar-group">
              <span className="chart-label">Pengeluaran</span>
              <div className="chart-track">
                <div className="chart-fill chart-fill-expense" style={{ width: `${Math.min(100, (summary.totalPengeluaran / (summary.totalPemasukan + summary.totalPengeluaran || 1)) * 100)}%` }}></div>
              </div>
              <span className="chart-value">{formatRp(summary.totalPengeluaran)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="filter-tabs">
          <button className={`filter-tab ${filterTipe === "" ? "active" : ""}`} onClick={() => setFilterTipe("")}>Semua</button>
          <button className={`filter-tab ${filterTipe === "pemasukan" ? "active" : ""}`} onClick={() => setFilterTipe("pemasukan")}>Pemasukan</button>
          <button className={`filter-tab ${filterTipe === "pengeluaran" ? "active" : ""}`} onClick={() => setFilterTipe("pengeluaran")}>Pengeluaran</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Kategori</th>
                <th>Tipe</th>
                <th>Jumlah</th>
                <th className="th-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((t) => (
                <tr key={t.id}>
                  <td>{t.tanggal}</td>
                  <td>{t.keterangan}</td>
                  <td><span className={`status status-${t.kategori}`}>{t.kategori}</span></td>
                  <td><span className={`tipe tipe-${t.tipe}`}>{t.tipe}</span></td>
                  <td className={t.tipe === "pemasukan" ? "income" : "expense"}>{formatRp(t.jumlah)}</td>
                  <td className="th-aksi">
                    <div className="aksi-group">
                      <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(t.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {transaksi.length === 0 && <tr><td colSpan="6" className="empty-row">Belum ada transaksi</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tambah Transaksi</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Tanggal <span className="required">*</span></label>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tipe <span className="required">*</span></label>
              <select value={form.tipe} onChange={(e) => handleTipeChange(e.target.value)}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kategori <span className="required">*</span></label>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {kategoriList.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Keterangan <span className="required">*</span></label>
              <input value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Deskripsi transaksi" />
            </div>
            <div className="form-group">
              <label>Jumlah (Rp) <span className="required">*</span></label>
              <input type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} placeholder="100000" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handleSubmit}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
