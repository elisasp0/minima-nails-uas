import { useState, useMemo, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import PriceCalculator from "./pages/PriceCalculator";
import Keuangan from "./pages/Keuangan";
import Stok from "./pages/Stok";
import Portofolio from "./pages/Portofolio";
import Kasbon from "./pages/Kasbon";
import Menu from "./pages/Menu";
import Laporan from "./pages/Laporan";
import {
  LayoutDashboard, Users, CalendarCheck, Calculator, Wallet, Package,
  Sparkles, Receipt, ClipboardList, BarChart3, Bell, LogOut, ChevronLeft,
  ChevronRight, Menu as MenuIcon,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/pelanggan", label: "Pelanggan", icon: Users },
  { path: "/booking", label: "Booking", icon: CalendarCheck },
  { path: "/kalkulator", label: "Kalkulator", icon: Calculator },
  { path: "/keuangan", label: "Keuangan", icon: Wallet },
  { path: "/stok", label: "Stok", icon: Package },
  { path: "/portofolio", label: "Services", icon: Sparkles },
  { path: "/kasbon", label: "Kasbon", icon: Receipt },
  { path: "/menu", label: "Menu Layanan", icon: ClipboardList },
  { path: "/laporan", label: "Laporan", icon: BarChart3 },
];

const dummyNotifications = [
  { id: 1, text: "Booking baru dari Sarah Wijaya — Nail Art (14:00)", time: "5 menit lalu" },
  { id: 2, text: "Pembayaran dari Budiman telah dikonfirmasi — Rp150.000", time: "1 jam lalu" },
  { id: 3, text: "Stok \"Base Coat\" hampir habis (sisa 2)", time: "3 jam lalu" },
  { id: 4, text: "Pelanggan baru mendaftar: Rina Amelia", time: "1 hari lalu" },
  { id: 5, text: "Booking #0021 dibatalkan oleh pelanggan", time: "2 hari lalu" },
];

const pageTitles = {
  "/": "Dashboard",
  "/pelanggan": "Pelanggan",
  "/booking": "Booking",
  "/kalkulator": "Kalkulator Harga",
  "/keuangan": "Keuangan",
  "/stok": "Stok Bahan",
  "/portofolio": "Services",
  "/kasbon": "Kasbon",
  "/menu": "Menu Layanan",
  "/laporan": "Laporan",
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pelanggan" element={<Customers />} />
        <Route path="booking" element={<Bookings />} />
        <Route path="kalkulator" element={<PriceCalculator />} />
        <Route path="keuangan" element={<Keuangan />} />
        <Route path="stok" element={<Stok />} />
        <Route path="portofolio" element={<Portofolio />} />
        <Route path="kasbon" element={<Kasbon />} />
        <Route path="menu" element={<Menu />} />
        <Route path="laporan" element={<Laporan />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "Minima Nails";

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest(".notification-trigger") && !e.target.closest(".notif-dropdown")) {
      setShowNotif(false);
    }
    if (!e.target.closest(".profile-trigger") && !e.target.closest(".profile-dropdown")) {
      setShowProfile(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  const NavIcon = useMemo(() => {
    const item = navItems.find((n) =>
      n.path === "/" ? location.pathname === "/" : location.pathname.startsWith(n.path)
    );
    return item?.icon;
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <header className="mobile-header">
        <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <MenuIcon size={22} />
        </button>
        <span className="mobile-header-title">Minima Nails</span>
      </header>

      {/* Sidebar overlay (mobile) */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={closeSidebar} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Sparkles size={24} />
            </div>
            {!sidebarCollapsed && <span className="sidebar-logo-text">Minima Nails</span>}
          </div>
          <button className="icon-btn sidebar-close-btn" onClick={closeSidebar}>
            <MenuIcon size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-item-icon">
                <item.icon size={20} />
              </span>
              {!sidebarCollapsed && <span className="sidebar-item-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="icon-btn collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? "Perluas" : "Ciutkan"}>
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Desktop header */}
        <header className="top-header">
          <div className="top-header-left">
            {NavIcon && <NavIcon size={22} className="page-icon" />}
            <h1 className="page-title">{pageTitle}</h1>
          </div>
          <div className="top-header-right">
            <div className="notif-wrapper">
              <button className="icon-btn notification-btn notification-trigger" title="Notifikasi" onClick={() => setShowNotif(v => !v)}>
                <Bell size={20} />
              </button>
              {showNotif && (
                <div className="notif-dropdown">
                  <div className="dropdown-header">Notifikasi</div>
                  <div className="dropdown-body">
                    {dummyNotifications.map((n) => (
                      <div key={n.id} className="notif-item">
                        <div className="notif-item-dot" />
                        <div className="notif-item-body">
                          <p className="notif-item-text">{n.text}</p>
                          <span className="notif-item-time">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="profile-wrapper">
              <div className="admin-profile profile-trigger" onClick={() => setShowProfile(v => !v)}>
                <div className="admin-avatar">
                  {(user?.nama || "A").charAt(0).toUpperCase()}
                </div>
                <div className="admin-info">
                  <span className="admin-name">{user?.nama || "Admin"}</span>
                  <span className="admin-role">{user?.role || "admin"}</span>
                </div>
              </div>
              {showProfile && (
                <div className="profile-dropdown">
                  <div className="dropdown-body">
                    <div className="profile-dropdown-user">
                      <div className="admin-avatar large">
                        {(user?.nama || "A").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="profile-dropdown-name">{user?.nama || "Admin"}</div>
                        <div className="profile-dropdown-role">{user?.role || "admin"}</div>
                      </div>
                    </div>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
