import { useEffect, useState } from "react";
import { getStok, getLowStock, getStokKategori, createStok, updateStok, updateStokQty, deleteStok } from "../api/stok";

export default function Stok() {
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [qtyItem, setQtyItem] = useState(null);
  const [qtyForm, setQtyForm] = useState({ operasi: "masuk", jumlah: "" });
  const [form, setForm] = useState({ nama: "", kategori: "cat kuku", stokSaatIni: "", stokMinimum: "", satuan: "", hargaBeli: "", hargaJual: "" });

  useEffect(() => {
    loadData();
    getStokKategori().then((res) => setKategoriList(res.data.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 300);
    return () => clearTimeout(timer);
  }, [search, filterKategori]);

  async function loadData() {
    const params = {};
    if (search) params.search = search;
    if (filterKategori) params.kategori = filterKategori;
    const [itemsRes, lowRes] = await Promise.all([getStok(params), getLowStock()]);
    setItems(itemsRes.data.data);
    setLowStock(lowRes.data.data);
  }

  function formatRp(angka) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  function openAddModal() {
    setEditItem(null);
    setForm({ nama: "", kategori: "cat kuku", stokSaatIni: "", stokMinimum: "", satuan: "", hargaBeli: "", hargaJual: "" });
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditItem(item);
    setForm({ nama: item.nama, kategori: item.kategori, stokSaatIni: String(item.stokSaatIni), stokMinimum: String(item.stokMinimum), satuan: item.satuan, hargaBeli: String(item.hargaBeli), hargaJual: String(item.hargaJual) });
    setShowModal(true);
  }

  function openQtyModal(item, operasi) {
    setQtyItem(item);
    setQtyForm({ operasi, jumlah: "" });
    setShowQtyModal(true);
  }

  async function handleSave() {
    if (!form.nama || !form.stokSaatIni || !form.stokMinimum || !form.satuan) return;
    if (editItem) {
      await updateStok(editItem.id, form);
    } else {
      await createStok(form);
    }
    setShowModal(false);
    loadData();
  }

  async function handleQtySave() {
    if (!qtyForm.jumlah || qtyForm.jumlah < 1) return;
    await updateStokQty(qtyItem.id, qtyForm);
    setShowQtyModal(false);
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus bahan ini?")) return;
    await deleteStok(id);
    loadData();
  }

  const isLow = (item) => item.stokSaatIni <= item.stokMinimum;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Stok Bahan</h1>
          <p className="page-subtitle">Manajemen inventaris nail art</p>
        </div>
        <button className="btn btn-primary" style={{ width: "auto", padding: "8px 16px", fontSize: "14px" }} onClick={openAddModal}>+ Tambah</button>
      </div>

      {lowStock.length > 0 && (
        <div className="low-stock-banner">
          <span className="low-stock-icon">!</span>
          <div className="low-stock-text">
            <strong>{lowStock.length} bahan</strong> dengan stok menipis
            <div className="low-stock-list">
              {lowStock.map((item) => (
                <span key={item.id} className="low-stock-tag">{item.nama} ({item.stokSaatIni} {item.satuan})</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="search-bar">
        <input placeholder="Cari bahan..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="stok-filter-row">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button className={`filter-tab ${filterKategori === "" ? "active" : ""}`} onClick={() => setFilterKategori("")}>Semua</button>
          {kategoriList.map((k) => (
            <button key={k} className={`filter-tab ${filterKategori === k ? "active" : ""}`} onClick={() => setFilterKategori(filterKategori === k ? "" : k)}>{k}</button>
          ))}
        </div>
      </div>

      <div className="stok-list">
        {items.map((item) => (
          <div key={item.id} className={`stok-card ${isLow(item) ? "stok-low" : ""}`}>
            <div className="stok-card-top">
              <div className="stok-card-info">
                <div className="stok-card-nama">{item.nama}</div>
                <div className="stok-card-meta">
                  <span className={`stok-badge stok-badge-${item.kategori.replace(/\s/g, "-")}`}>{item.kategori}</span>
                  <span className="stok-card-satuan">{item.satuan}</span>
                </div>
              </div>
              <div className="stok-card-qty">
                <span className={`stok-angka ${isLow(item) ? "stok-angka-low" : ""}`}>{item.stokSaatIni}</span>
                {isLow(item) && <span className="stok-label-low">Hampir habis</span>}
              </div>
            </div>
            <div className="stok-card-bar">
              <div className="stok-bar-track">
                <div className="stok-bar-fill" style={{ width: `${Math.min(100, (item.stokSaatIni / Math.max(item.stokMinimum * 2, 1)) * 100)}%` }}></div>
              </div>
              <span className="stok-bar-min">Min: {item.stokMinimum}</span>
            </div>
            {(item.hargaBeli > 0 || item.hargaJual > 0) && (
              <div className="stok-card-harga">
                {item.hargaBeli > 0 && <span>Beli: {formatRp(item.hargaBeli)}</span>}
                {item.hargaJual > 0 && <span>Jual: {formatRp(item.hargaJual)}</span>}
              </div>
            )}
            <div className="stok-card-aksi">
              <button className="btn btn-sm btn-terima" onClick={() => openQtyModal(item, "masuk")}>+ Masuk</button>
              <button className="btn btn-sm btn-tolak" onClick={() => openQtyModal(item, "keluar")}>- Keluar</button>
              <button className="btn btn-sm btn-edit" onClick={() => openEditModal(item)}>Edit</button>
              <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(item.id)}>Hapus</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty-text" style={{ textAlign: "center", padding: "40px 0" }}>Tidak ada bahan ditemukan</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? "Edit Bahan" : "Tambah Bahan"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Nama Bahan <span className="required">*</span></label>
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Cat Kuku Merah" />
            </div>
            <div className="form-group">
              <label>Kategori <span className="required">*</span></label>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {kategoriList.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stok Saat Ini <span className="required">*</span></label>
                <input type="number" value={form.stokSaatIni} onChange={(e) => setForm({ ...form, stokSaatIni: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Stok Minimum <span className="required">*</span></label>
                <input type="number" value={form.stokMinimum} onChange={(e) => setForm({ ...form, stokMinimum: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="form-group">
              <label>Satuan <span className="required">*</span></label>
              <input value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} placeholder="Contoh: botol, pcs, box" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Harga Beli (Rp)</label>
                <input type="number" value={form.hargaBeli} onChange={(e) => setForm({ ...form, hargaBeli: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Harga Jual (Rp)</label>
                <input type="number" value={form.hargaJual} onChange={(e) => setForm({ ...form, hargaJual: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showQtyModal && qtyItem && (
        <div className="modal-overlay" onClick={() => setShowQtyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{qtyForm.operasi === "masuk" ? "Stok Masuk" : "Stok Keluar"}</h2>
              <button className="btn-close" onClick={() => setShowQtyModal(false)}>x</button>
            </div>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
              {qtyItem.nama} — Stok saat ini: <strong>{qtyItem.stokSaatIni} {qtyItem.satuan}</strong>
            </p>
            <div className="form-group">
              <label>Jumlah <span className="required">*</span></label>
              <input type="number" value={qtyForm.jumlah} onChange={(e) => setQtyForm({ ...qtyForm, jumlah: e.target.value })} placeholder="1" min="1" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowQtyModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handleQtySave}>{qtyForm.operasi === "masuk" ? "Masuk" : "Keluar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
