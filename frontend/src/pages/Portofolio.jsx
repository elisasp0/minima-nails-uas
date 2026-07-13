import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Search, Clock, Sparkles as SparklesIcon, X, CheckCircle, Trash2 } from "lucide-react";

const kategoriList = ["minimalis", "glitter", "french", "custom", "gel", "acrylic"];

const defaultServices = [
  { id: 1, nama: "Nail Art Minimalis Pink", harga: 85000, durasi: 60, kategori: "minimalis", gambar: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop" },
  { id: 2, nama: "Glitter Sparkle Nails", harga: 120000, durasi: 75, kategori: "glitter", gambar: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop" },
  { id: 3, nama: "French Manicure Classic", harga: 95000, durasi: 60, kategori: "french", gambar: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop" },
  { id: 4, nama: "Custom Nail Art Premium", harga: 150000, durasi: 90, kategori: "custom", gambar: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop" },
  { id: 5, nama: "Gel Extension Full Set", harga: 200000, durasi: 120, kategori: "gel", gambar: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop" },
  { id: 6, nama: "Acrylic Nails 3D Art", harga: 180000, durasi: 105, kategori: "acrylic", gambar: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop" },
  { id: 7, nama: "Minimalis Nude Nails", harga: 75000, durasi: 45, kategori: "minimalis", gambar: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop" },
  { id: 8, nama: "Glitter Ombre Nails", harga: 135000, durasi: 80, kategori: "glitter", gambar: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop" },
];

function formatRp(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
}

const kategoriEmoji = {
  minimalis: "🌸", glitter: "✨", french: "🇫🇷", custom: "🎨", gel: "💎", acrylic: "🖌️",
};

export default function Portofolio() {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("services_data");
      return saved ? JSON.parse(saved) : defaultServices;
    } catch { return defaultServices; }
  });
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "", harga: "", durasi: "60", kategori: "minimalis", gambar: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem("services_data", JSON.stringify(services));
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase());
      const matchKategori = !filterKategori || s.kategori === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [services, search, filterKategori]);

  function openAddModal() {
    setEditing(null);
    setForm({ nama: "", harga: "", durasi: "60", kategori: "minimalis", gambar: "" });
    setShowModal(true);
  }

  function openEditModal(s) {
    setEditing(s.id);
    setForm({ nama: s.nama, harga: String(s.harga), durasi: String(s.durasi), kategori: s.kategori, gambar: s.gambar || "" });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.nama || !form.harga) return;
    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing
            ? { ...s, nama: form.nama, harga: Number(form.harga), durasi: Number(form.durasi), kategori: form.kategori, gambar: form.gambar || s.gambar }
            : s
        )
      );
      showToast("Layanan berhasil diperbarui", "success");
    } else {
      const newService = {
        id: Date.now(),
        nama: form.nama,
        harga: Number(form.harga),
        durasi: Number(form.durasi),
        kategori: form.kategori,
        gambar: form.gambar || `https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop`,
      };
      setServices((prev) => [newService, ...prev]);
      showToast("Layanan berhasil ditambahkan", "success");
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    const s = services.find((x) => x.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast(`"${s?.nama}" berhasil dihapus`, "success");
  }

  return (
    <div className="services-page page">
      <div className="page-header">
        <div>
          <h1>Services</h1>
          <p className="page-subtitle">Katalog layanan salon</p>
        </div>
        <button className="btn btn-primary btn-add-service" onClick={openAddModal}>
          <Plus size={18} />
          <span>Tambah Services</span>
        </button>
      </div>

      <div className="services-toolbar">
        <div className="services-search">
          <Search size={18} className="services-search-icon" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="services-search-clear" onClick={() => setSearch("")}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="services-filter">
          <button className={`filter-tab ${filterKategori === "" ? "active" : ""}`} onClick={() => setFilterKategori("")}>Semua</button>
          {kategoriList.map((k) => (
            <button key={k} className={`filter-tab ${filterKategori === k ? "active" : ""}`} onClick={() => setFilterKategori(filterKategori === k ? "" : k)}>
              {kategoriEmoji[k]} {k}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="services-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="service-card skeleton">
              <div className="service-card-img skeleton-img" />
              <div className="service-card-body">
                <div className="skeleton-line skeleton-line-title" />
                <div className="skeleton-line skeleton-line-meta" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="services-empty">
          <div className="services-empty-icon">
            <SparklesIcon size={48} strokeWidth={1} />
          </div>
          <h3 className="services-empty-title">
            {services.length === 0 ? "Belum ada layanan" : "Layanan tidak ditemukan"}
          </h3>
          <p className="services-empty-desc">
            {services.length === 0
              ? "Klik tombol Tambah Services untuk menambahkan layanan baru"
              : "Coba gunakan kata kunci atau filter lain"}
          </p>
          {services.length === 0 && (
            <button className="btn btn-primary" style={{ width: "auto", marginTop: 16 }} onClick={openAddModal}>
              <Plus size={18} />
              <span>Tambah Services</span>
            </button>
          )}
        </div>
      ) : (
        <div className="services-grid">
          {filtered.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-card-img">
                <img src={s.gambar} alt={s.nama} loading="lazy" />
                <span className="service-card-badge">{kategoriEmoji[s.kategori]} {s.kategori}</span>
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">{s.nama}</h3>
                <div className="service-card-meta">
                  <span className="service-card-price">{formatRp(s.harga)}</span>
                  <span className="service-card-durasi">
                    <Clock size={14} />
                    {s.durasi} menit
                  </span>
                </div>
                <div className="service-card-aksi">
                  <button className="btn btn-sm btn-edit" onClick={() => openEditModal(s)}>Edit</button>
                  <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(s.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`toast-overlay ${toast ? "open" : ""}`}>
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <CheckCircle size={18} />
            <span>{toast.message}</span>
            <button className="toast-close" onClick={dismissToast}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Services" : "Tambah Services"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Nama Layanan <span className="required">*</span></label>
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Nail Art Minimalis" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Harga <span className="required">*</span></label>
                <input type="number" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} placeholder="85000" min="0" />
              </div>
              <div className="form-group">
                <label>Durasi (menit)</label>
                <input type="number" value={form.durasi} onChange={(e) => setForm({ ...form, durasi: e.target.value })} placeholder="60" min="0" />
              </div>
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {kategoriList.map((k) => <option key={k} value={k}>{kategoriEmoji[k]} {k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>URL Gambar (opsional)</label>
              <input value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} placeholder="https://..." />
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
