import { useEffect, useState } from "react";
import { getKasbon, getKasbonDueSoon, createKasbon, updateKasbon, updateKasbonStatus, deleteKasbon } from "../api/kasbon";

export default function Kasbon() {
  const [items, setItems] = useState([]);
  const [dueInfo, setDueInfo] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ pelangganNama: "", jumlah: "", keterangan: "", tanggal: new Date().toISOString().split("T")[0], jatuhTempo: "" });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 300);
    return () => clearTimeout(timer);
  }, [filterStatus, search]);

  async function loadData() {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (search) params.search = search;
    const [itemsRes, dueRes] = await Promise.all([getKasbon(params), getKasbonDueSoon()]);
    setItems(itemsRes.data.data);
    setDueInfo(dueRes.data.data);
  }

  function formatRp(angka) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  function daysUntil(dateStr) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + "T00:00:00");
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }

  function openAddModal() {
    setEditItem(null);
    setForm({ pelangganNama: "", jumlah: "", keterangan: "", tanggal: new Date().toISOString().split("T")[0], jatuhTempo: "" });
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditItem(item);
    setForm({ pelangganNama: item.pelangganNama, jumlah: String(item.jumlah), keterangan: item.keterangan, tanggal: item.tanggal, jatuhTempo: item.jatuhTempo });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.pelangganNama || !form.jumlah || !form.tanggal || !form.jatuhTempo) return;
    if (editItem) {
      await updateKasbon(editItem.id, form);
    } else {
      await createKasbon(form);
    }
    setShowModal(false);
    loadData();
  }

  async function handleToggleStatus(item) {
    const newStatus = item.status === "lunas" ? "belum lunas" : "lunas";
    await updateKasbonStatus(item.id, newStatus);
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kasbon ini?")) return;
    await deleteKasbon(id);
    loadData();
  }

  function getDueStatus(item) {
    if (item.status === "lunas") return null;
    const days = daysUntil(item.jatuhTempo);
    if (days < 0) return { label: `Telat ${Math.abs(days)} hari`, cls: "due-overdue" };
    if (days === 0) return { label: "Jatuh tempo hari ini", cls: "due-today" };
    if (days <= 3) return { label: `${days} hari lagi`, cls: "due-soon" };
    return { label: `${days} hari lagi`, cls: "due-ok" };
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Kasbon</h1>
          <p className="page-subtitle">Pencatatan piutang pelanggan</p>
        </div>
        <button className="btn btn-primary" style={{ width: "auto", padding: "8px 16px", fontSize: "14px" }} onClick={openAddModal}>+ Tambah</button>
      </div>

      {dueInfo && dueInfo.total > 0 && (
        <div className={`kasbon-banner ${dueInfo.overdue.length > 0 ? "banner-overdue" : "banner-soon"}`}>
          <span className="low-stock-icon" style={{ background: dueInfo.overdue.length > 0 ? "#c62828" : "#e65100" }}>!</span>
          <div className="low-stock-text">
            <strong>{dueInfo.total} kasbon</strong> perlu perhatian
            <div className="low-stock-list">
              {dueInfo.overdue.map((k) => (
                <span key={k.id} className="low-stock-tag" style={{ borderColor: "#ef9a9a", color: "#c62828" }}>
                  {k.pelangganNama} — {formatRp(k.jumlah)} (telat)
                </span>
              ))}
              {dueInfo.soon.map((k) => (
                <span key={k.id} className="low-stock-tag" style={{ borderColor: "#ffcc80", color: "#e65100" }}>
                  {k.pelangganNama} — {formatRp(k.jumlah)} (jatuh tempo)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="search-bar">
        <input placeholder="Cari pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="filter-tabs" style={{ marginBottom: 16 }}>
        <button className={`filter-tab ${filterStatus === "" ? "active" : ""}`} onClick={() => setFilterStatus("")}>Semua</button>
        <button className={`filter-tab ${filterStatus === "belum lunas" ? "active" : ""}`} onClick={() => setFilterStatus("belum lunas")}>Belum Lunas</button>
        <button className={`filter-tab ${filterStatus === "lunas" ? "active" : ""}`} onClick={() => setFilterStatus("lunas")}>Lunas</button>
      </div>

      <div className="kasbon-list">
        {items.map((item) => {
          const due = getDueStatus(item);
          return (
            <div key={item.id} className={`kasbon-card ${item.status === "lunas" ? "kasbon-lunas" : ""} ${due && due.cls === "due-overdue" ? "kasbon-overdue" : ""}`}>
              <div className="kasbon-card-top">
                <div className="kasbon-card-info">
                  <div className="kasbon-card-nama">{item.pelangganNama}</div>
                  <div className="kasbon-card-meta">
                    {item.keterangan && <span className="kasbon-card-ket">{item.keterangan}</span>}
                    <span className="kasbon-card-tgl">{formatDate(item.tanggal)}</span>
                  </div>
                </div>
                <div className="kasbon-card-jumlah">
                  <span className={`kasbon-angka ${item.status === "lunas" ? "text-lunas" : ""}`}>{formatRp(item.jumlah)}</span>
                  {due ? (
                    <span className={`kasbon-due ${due.cls}`}>{due.label}</span>
                  ) : (
                    <span className="kasbon-due due-paid">Lunas</span>
                  )}
                </div>
              </div>
              {item.jatuhTempo && (
                <div className="kasbon-card-tempo">
                  <span>Jatuh tempo: {formatDate(item.jatuhTempo)}</span>
                </div>
              )}
              <div className="kasbon-card-aksi">
                <button className={`btn btn-sm ${item.status === "lunas" ? "btn-tolak" : "btn-terima"}`} onClick={() => handleToggleStatus(item)}>
                  {item.status === "lunas" ? "Batalkan" : "Tandai Lunas"}
                </button>
                <button className="btn btn-sm btn-edit" onClick={() => openEditModal(item)}>Edit</button>
                <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(item.id)}>Hapus</button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="empty-text" style={{ textAlign: "center", padding: "40px 0" }}>Belum ada kasbon</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? "Edit Kasbon" : "Tambah Kasbon"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Nama Pelanggan <span className="required">*</span></label>
              <input value={form.pelangganNama} onChange={(e) => setForm({ ...form, pelangganNama: e.target.value })} placeholder="Nama pelanggan" />
            </div>
            <div className="form-group">
              <label>Jumlah (Rp) <span className="required">*</span></label>
              <input type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} placeholder="100000" />
            </div>
            <div className="form-group">
              <label>Keterangan</label>
              <textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Deskripsi kasbon..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tanggal <span className="required">*</span></label>
                <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Jatuh Tempo <span className="required">*</span></label>
                <input type="date" value={form.jatuhTempo} onChange={(e) => setForm({ ...form, jatuhTempo: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
