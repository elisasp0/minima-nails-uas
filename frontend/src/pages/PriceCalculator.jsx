import { useEffect, useState } from "react";
import { getPackages, getUpgrades, calculatePrice, createPackage, updatePackage, deletePackage, createUpgrade, updateUpgrade, deleteUpgrade } from "../api/pricelist";

export default function PriceCalculator() {
  const [packages, setPackages] = useState([]);
  const [upgrades, setUpgrades] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [result, setResult] = useState(null);

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [showUpgModal, setShowUpgModal] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [editUpg, setEditUpg] = useState(null);
  const [formPkg, setFormPkg] = useState({ nama: "", harga: "", deskripsi: "", durasi: "60" });
  const [formUpg, setFormUpg] = useState({ nama: "", harga: "", deskripsi: "" });

  useEffect(() => {
    getPackages().then((res) => setPackages(res.data.data));
    getUpgrades().then((res) => setUpgrades(res.data.data));
  }, []);

  useEffect(() => {
    if (!selectedPackage) { setResult(null); return; }
    calculatePrice({ packageId: selectedPackage, upgradeIds: selectedUpgrades })
      .then((res) => setResult(res.data.data))
      .catch(() => setResult(null));
  }, [selectedPackage, selectedUpgrades]);

  function toggleUpgrade(id) {
    setSelectedUpgrades((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }

  function formatRp(angka) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  function openPkgModal(pkg) {
    if (pkg) {
      setEditPkg(pkg);
      setFormPkg({ nama: pkg.nama, harga: String(pkg.harga), deskripsi: pkg.deskripsi, durasi: String(pkg.durasi) });
    } else {
      setEditPkg(null);
      setFormPkg({ nama: "", harga: "", deskripsi: "", durasi: "60" });
    }
    setShowPkgModal(true);
  }

  function openUpgModal(upg) {
    if (upg) {
      setEditUpg(upg);
      setFormUpg({ nama: upg.nama, harga: String(upg.harga), deskripsi: upg.deskripsi });
    } else {
      setEditUpg(null);
      setFormUpg({ nama: "", harga: "", deskripsi: "" });
    }
    setShowUpgModal(true);
  }

  async function handlePkgSave() {
    if (!formPkg.nama || !formPkg.harga) return;
    if (editPkg) {
      await updatePackage(editPkg.id, formPkg);
    } else {
      await createPackage(formPkg);
    }
    const res = await getPackages();
    setPackages(res.data.data);
    setShowPkgModal(false);
  }

  async function handleUpgSave() {
    if (!formUpg.nama || !formUpg.harga) return;
    if (editUpg) {
      await updateUpgrade(editUpg.id, formUpg);
    } else {
      await createUpgrade(formUpg);
    }
    const res = await getUpgrades();
    setUpgrades(res.data.data);
    setShowUpgModal(false);
  }

  async function handlePkgDelete(id) {
    if (!confirm("Hapus paket ini?")) return;
    await deletePackage(id);
    const res = await getPackages();
    setPackages(res.data.data);
    if (selectedPackage === String(id)) { setSelectedPackage(""); setSelectedUpgrades([]); }
  }

  async function handleUpgDelete(id) {
    if (!confirm("Hapus upgrade ini?")) return;
    await deleteUpgrade(id);
    const res = await getUpgrades();
    setUpgrades(res.data.data);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Kalkulator Harga</h1>
          <p className="page-subtitle">Estimasi harga nail art otomatis</p>
        </div>
      </div>

      <div className="calc-layout">
        <div className="calc-panel card">
          <div className="calc-panel-header">
            <h3>Pilih Paket</h3>
            <button className="btn btn-sm btn-edit" onClick={() => openPkgModal(null)}>+ Paket</button>
          </div>
          <div className="calc-options">
            {packages.map((p) => (
              <label key={p.id} className={`calc-option ${selectedPackage === String(p.id) ? "selected" : ""}`}>
                <input type="radio" name="package" value={p.id} checked={selectedPackage === String(p.id)} onChange={() => { setSelectedPackage(String(p.id)); setSelectedUpgrades([]); }} />
                <div className="calc-option-body">
                  <span className="calc-option-nama">{p.nama}</span>
                  <span className="calc-option-harga">{formatRp(p.harga)}</span>
                  {p.deskripsi && <span className="calc-option-desc">{p.deskripsi}</span>}
                </div>
                <button className="btn btn-sm btn-edit" onClick={(e) => { e.preventDefault(); openPkgModal(p); }}>Edit</button>
                <button className="btn btn-sm btn-hapus" onClick={(e) => { e.preventDefault(); handlePkgDelete(p.id); }}>Hapus</button>
              </label>
            ))}
            {packages.length === 0 && <p className="empty-text">Belum ada paket</p>}
          </div>

          <hr className="calc-divider" />

          <div className="calc-panel-header">
            <h3>Upgrade (Opsional)</h3>
            <button className="btn btn-sm btn-edit" onClick={() => openUpgModal(null)}>+ Upgrade</button>
          </div>
          <div className="calc-options">
            {upgrades.map((u) => (
              <label key={u.id} className={`calc-option ${selectedUpgrades.includes(u.id) ? "selected" : ""}`}>
                <input type="checkbox" checked={selectedUpgrades.includes(u.id)} onChange={() => toggleUpgrade(u.id)} />
                <div className="calc-option-body">
                  <span className="calc-option-nama">{u.nama}</span>
                  <span className="calc-option-harga">+ {formatRp(u.harga)}</span>
                  {u.deskripsi && <span className="calc-option-desc">{u.deskripsi}</span>}
                </div>
                <button className="btn btn-sm btn-edit" onClick={(e) => { e.preventDefault(); openUpgModal(u); }}>Edit</button>
                <button className="btn btn-sm btn-hapus" onClick={(e) => { e.preventDefault(); handleUpgDelete(u.id); }}>Hapus</button>
              </label>
            ))}
            {upgrades.length === 0 && <p className="empty-text">Belum ada upgrade</p>}
          </div>
        </div>

        <div className="calc-result card">
          <h3>Estimasi Harga</h3>
          {result ? (
            <div className="calc-result-body">
              <div className="calc-result-row">
                <span>{result.package.nama}</span>
                <span>{formatRp(result.subtotalPackage)}</span>
              </div>
              {result.upgrades.map((u) => (
                <div key={u.id} className="calc-result-row">
                  <span>+ {u.nama}</span>
                  <span>{formatRp(u.harga)}</span>
                </div>
              ))}
              {result.subtotalUpgrade > 0 && <div className="calc-result-row calc-result-sub">
                <span>Subtotal Upgrade</span>
                <span>{formatRp(result.subtotalUpgrade)}</span>
              </div>}
              <hr className="calc-divider" />
              <div className="calc-result-row calc-result-total">
                <span>Total Harga</span>
                <span>{formatRp(result.totalHarga)}</span>
              </div>
            </div>
          ) : (
            <p className="empty-text" style={{ padding: "40px 0", textAlign: "center" }}>Pilih paket untuk melihat estimasi harga</p>
          )}
        </div>
      </div>

      {showPkgModal && (
        <div className="modal-overlay" onClick={() => setShowPkgModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editPkg ? "Edit Paket" : "Tambah Paket"}</h2>
              <button className="btn-close" onClick={() => setShowPkgModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Nama Paket <span className="required">*</span></label>
              <input value={formPkg.nama} onChange={(e) => setFormPkg({ ...formPkg, nama: e.target.value })} placeholder="Contoh: Nail Art Minimalis" />
            </div>
            <div className="form-group">
              <label>Harga (Rp) <span className="required">*</span></label>
              <input type="number" value={formPkg.harga} onChange={(e) => setFormPkg({ ...formPkg, harga: e.target.value })} placeholder="150000" />
            </div>
            <div className="form-group">
              <label>Durasi (menit)</label>
              <input type="number" value={formPkg.durasi} onChange={(e) => setFormPkg({ ...formPkg, durasi: e.target.value })} placeholder="60" />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea value={formPkg.deskripsi} onChange={(e) => setFormPkg({ ...formPkg, deskripsi: e.target.value })} placeholder="Deskripsi paket..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowPkgModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handlePkgSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showUpgModal && (
        <div className="modal-overlay" onClick={() => setShowUpgModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editUpg ? "Edit Upgrade" : "Tambah Upgrade"}</h2>
              <button className="btn-close" onClick={() => setShowUpgModal(false)}>x</button>
            </div>
            <div className="form-group">
              <label>Nama Upgrade <span className="required">*</span></label>
              <input value={formUpg.nama} onChange={(e) => setFormUpg({ ...formUpg, nama: e.target.value })} placeholder="Contoh: Nail Art 3D" />
            </div>
            <div className="form-group">
              <label>Harga Tambahan (Rp) <span className="required">*</span></label>
              <input type="number" value={formUpg.harga} onChange={(e) => setFormUpg({ ...formUpg, harga: e.target.value })} placeholder="50000" />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea value={formUpg.deskripsi} onChange={(e) => setFormUpg({ ...formUpg, deskripsi: e.target.value })} placeholder="Deskripsi upgrade..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-batal" onClick={() => setShowUpgModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ width: "auto" }} onClick={handleUpgSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
