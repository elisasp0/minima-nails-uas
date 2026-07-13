import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customers";

const emptyForm = { nama: "", noTelp: "", alamat: "", email: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers(q) {
    try {
      const res = await getCustomers(q || "");
      setCustomers(res.data.data);
    } catch {
      setCustomers([]);
    }
  }

  function handleSearch(val) {
    setSearch(val);
    loadCustomers(val);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({ nama: c.nama, noTelp: c.noTelp, alamat: c.alamat || "", email: c.email || "" });
    setError("");
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!confirm("Hapus pelanggan ini?")) return;
    try {
      await deleteCustomer(id);
      loadCustomers(search);
    } catch {
      alert("Gagal menghapus pelanggan");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama || !form.noTelp) {
      setError("Nama dan No. Telepon harus diisi");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateCustomer(editing.id, form);
      } else {
        await createCustomer(form);
      }
      setShowModal(false);
      loadCustomers(search);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pelanggan</h1>
          <p className="page-subtitle">{customers.length} pelanggan terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari nama atau no. telepon..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>No. Telepon</th>
                <th>Alamat</th>
                <th>Kunjungan</th>
                <th>Terakhir</th>
                <th className="th-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td colSpan={6} className="empty-row">Belum ada pelanggan</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.nama}</strong></td>
                  <td>{c.noTelp}</td>
                  <td>{c.alamat || "-"}</td>
                  <td>{c.totalKunjungan}x</td>
                  <td>{c.terakhir || "-"}</td>
                  <td>
                    <div className="aksi-group">
                      <button className="btn btn-sm btn-edit" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(c.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Pelanggan" : "Tambah Pelanggan"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>Nama <span className="required">*</span></label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama pelanggan" required />
              </div>
              <div className="form-group">
                <label>No. Telepon <span className="required">*</span></label>
                <input type="text" value={form.noTelp} onChange={(e) => setForm({ ...form, noTelp: e.target.value })} placeholder="081234567890" required />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input type="text" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat (opsional)" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-batal" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
