import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/kalkulator", label: "Kalkulator Harga", icon: "💰", desc: "Estimasi harga nail art otomatis" },
  { path: "/keuangan", label: "Keuangan", icon: "💳", desc: "Pemasukan & pengeluaran" },
  { path: "/stok", label: "Stok Bahan", icon: "📦", desc: "Manajemen inventaris" },
  { path: "/portofolio", label: "Portofolio", icon: "🖼️", desc: "Koleksi desain nail art" },
  { path: "/kasbon", label: "Kasbon", icon: "📋", desc: "Pencatatan piutang" },
  { path: "/laporan", label: "Laporan", icon: "📊", desc: "Rekap penjualan dan analisis bisnis" },
];

export default function Menu() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Menu</h1>
          <p className="page-subtitle">Semua fitur Minima Nails</p>
        </div>
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.disabled ? "#" : item.path}
            className={`menu-card ${item.disabled ? "menu-disabled" : ""}`}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            <span className="menu-icon">{item.icon}</span>
            <div className="menu-body">
              <span className="menu-label">{item.label}</span>
              <span className="menu-desc">{item.desc}</span>
            </div>
            {!item.disabled && <span className="menu-arrow">→</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
