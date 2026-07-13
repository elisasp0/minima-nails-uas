import { useEffect, useState, useMemo } from "react";
import { getBookings, createBooking, updateBooking, updateBookingStatus, deleteBooking, getLayanan } from "../api/bookings";
import { getCustomers } from "../api/customers";

const emptyForm = { pelangganId: "", pelangganNama: "", layanan: "", tanggal: "", jamMulai: "", jamSelesai: "", catatan: "" };

const statusLabel = { pending: "Pending", confirmed: "Dikonfirmasi", done: "Selesai", cancelled: "Dibatalkan" };

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const holidays = {
  "2026-01-01": "Tahun Baru Masehi",
  "2026-02-17": "Tahun Baru Imlek",
  "2026-03-11": "Isra Miraj Nabi Muhammad",
  "2026-03-29": "Hari Raya Nyepi",
  "2026-04-03": "Wafat Isa Almasih",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-13": "Kenaikan Isa Almasih",
  "2026-05-27": "Idul Fitri 1447 H",
  "2026-05-28": "Idul Fitri 1447 H",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-07-04": "Idul Adha 1447 H",
  "2026-08-17": "Hari Kemerdekaan RI",
  "2026-09-24": "Maulid Nabi Muhammad",
  "2026-12-25": "Hari Raya Natal",
};

function fmt(d) {
  return d.toISOString().split("T")[0];
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function isHoliday(dateStr) {
  return holidays[dateStr];
}

function isSunday(dateStr) {
  return new Date(dateStr + "T00:00:00").getDay() === 0;
}

function shouldBeRed(dateStr) {
  return isSunday(dateStr) || !!holidays[dateStr];
}

export default function Bookings() {
  const [allBookings, setAllBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [layananList, setLayananList] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState(fmt(new Date()));
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllBookings();
    loadCustomers();
    getLayanan().then((res) => setLayananList(res.data.data)).catch(() => {});
  }, []);

  async function loadAllBookings() {
    try {
      const res = await getBookings({});
      setAllBookings(res.data.data);
    } catch {
      setAllBookings([]);
    }
  }

  async function loadCustomers() {
    try {
      const res = await getCustomers();
      setCustomers(res.data.data);
    } catch {
      setCustomers([]);
    }
  }

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => b.tanggal === filterTanggal);
  }, [allBookings, filterTanggal]);

  function bookingCount(dateStr) {
    return allBookings.filter((b) => b.tanggal === dateStr).length;
  }

  function getCalendarCells() {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, otherMonth: true, dateStr: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, otherMonth: false, dateStr });
    }

    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, otherMonth: true, dateStr: null });
    }

    return cells;
  }

  function goToday() {
    const t = fmt(new Date());
    setFilterTanggal(t);
    setCalendarYear(new Date().getFullYear());
    setCalendarMonth(new Date().getMonth());
  }

  function changeMonth(delta) {
    let m = calendarMonth + delta;
    let y = calendarYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalendarMonth(m);
    setCalendarYear(y);
  }

  function selectDate(dateStr) {
    if (dateStr) setFilterTanggal(dateStr);
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, tanggal: filterTanggal, jamMulai: "09:00", jamSelesai: "10:00" });
    setError("");
    setShowModal(true);
  }

  function openEdit(b) {
    setEditing(b);
    setForm({
      pelangganId: b.pelangganId || "",
      pelangganNama: b.pelangganNama,
      layanan: b.layanan,
      tanggal: b.tanggal,
      jamMulai: b.jamMulai,
      jamSelesai: b.jamSelesai,
      catatan: b.catatan || "",
    });
    setError("");
    setShowModal(true);
  }

  function selectCustomer(id) {
    const c = customers.find((c) => c.id === parseInt(id));
    setForm({ ...form, pelangganId: id, pelangganNama: c ? c.nama : "" });
  }

  async function handleDelete(id) {
    if (!confirm("Hapus booking ini?")) return;
    try {
      await deleteBooking(id);
      loadAllBookings();
    } catch {
      alert("Gagal menghapus booking");
    }
  }

  async function handleStatus(id, status) {
    try {
      await updateBookingStatus(id, status);
      loadAllBookings();
    } catch {
      alert("Gagal mengubah status");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.pelangganNama || !form.layanan || !form.tanggal || !form.jamMulai || !form.jamSelesai) {
      setError("Semua field wajib diisi");
      return;
    }
    if (form.jamMulai >= form.jamSelesai) {
      setError("Jam selesai harus setelah jam mulai");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateBooking(editing.id, form);
      } else {
        await createBooking(form);
      }
      setShowModal(false);
      loadAllBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const now = new Date();
  const todayStr = fmt(now);
  const cells = getCalendarCells();
  const selectedDate = filterTanggal;
  const currentMonthStr = `${monthNames[calendarMonth]} ${calendarYear}`;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Booking</h1>
          <p className="page-subtitle">{filteredBookings.length} booking pada {formatDate(filterTanggal)}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah</button>
      </div>

      <div className="card calendar-card">
        <div className="calendar-header">
          <button className="btn btn-nav" onClick={() => changeMonth(-1)}>&larr;</button>
          <div className="calendar-month-display" onClick={goToday}>
            <span className="calendar-month-text">{currentMonthStr}</span>
          </div>
          <button className="btn btn-nav" onClick={() => changeMonth(1)}>&rarr;</button>
        </div>

        <div className="calendar-weekdays">
          {dayNames.map((d) => (
            <div key={d} className="calendar-weekday">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((cell, i) => {
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDate;
            const hasBooking = cell.dateStr && bookingCount(cell.dateStr) > 0;
            const red = cell.dateStr && shouldBeRed(cell.dateStr);
            const holidayName = cell.dateStr ? holidays[cell.dateStr] : null;

            let cls = "calendar-cell";
            if (cell.otherMonth) cls += " other-month";
            if (isToday) cls += " today";
            if (isSelected) cls += " selected";
            if (red) cls += " holiday";

            return (
              <div
                key={i}
                className={cls}
                onClick={() => selectDate(cell.dateStr)}
                title={holidayName || ""}
              >
                <span className="calendar-day-num">{cell.day}</span>
                {hasBooking && (
                  <span className="calendar-badge">{bookingCount(cell.dateStr)}</span>
                )}
                {isToday && <span className="calendar-today-dot" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card date-navigator">
        <button className="btn btn-nav" onClick={() => {
          const d = new Date(filterTanggal + "T00:00:00");
          d.setDate(d.getDate() - 1);
          const newFmt = fmt(d);
          setFilterTanggal(newFmt);
          if (d.getMonth() !== calendarMonth || d.getFullYear() !== calendarYear) {
            setCalendarYear(d.getFullYear());
            setCalendarMonth(d.getMonth());
          }
        }}>&larr;</button>
        <div className="date-display" onClick={goToday}>
          <span className="date-text">{formatDate(filterTanggal)}</span>
          <span className="date-today">Hari Ini</span>
        </div>
        <button className="btn btn-nav" onClick={() => {
          const d = new Date(filterTanggal + "T00:00:00");
          d.setDate(d.getDate() + 1);
          const newFmt = fmt(d);
          setFilterTanggal(newFmt);
          if (d.getMonth() !== calendarMonth || d.getFullYear() !== calendarYear) {
            setCalendarYear(d.getFullYear());
            setCalendarMonth(d.getMonth());
          }
        }}>&rarr;</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Jam</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Status</th>
                <th>Catatan</th>
                <th className="th-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 && (
                <tr><td colSpan={6} className="empty-row">Tidak ada booking hari ini</td></tr>
              )}
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.jamMulai} - {b.jamSelesai}</strong></td>
                  <td>{b.pelangganNama}</td>
                  <td>{b.layanan}</td>
                  <td>
                    <span className={`status status-${b.status}`}>{statusLabel[b.status]}</span>
                  </td>
                  <td className="cell-catatan">{b.catatan || "-"}</td>
                  <td>
                    <div className="aksi-group">
                      <button className="btn btn-sm btn-edit" onClick={() => openEdit(b)}>Edit</button>
                      {b.status === "pending" && (
                        <button className="btn btn-sm btn-terima" onClick={() => handleStatus(b.id, "confirmed")}>Terima</button>
                      )}
                      {b.status === "confirmed" && (
                        <button className="btn btn-sm btn-selesai" onClick={() => handleStatus(b.id, "done")}>Selesai</button>
                      )}
                      {b.status !== "cancelled" && b.status !== "done" && (
                        <button className="btn btn-sm btn-tolak" onClick={() => handleStatus(b.id, "cancelled")}>Batal</button>
                      )}
                      <button className="btn btn-sm btn-hapus" onClick={() => handleDelete(b.id)}>Hapus</button>
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
              <h2>{editing ? "Edit Booking" : "Tambah Booking"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label>Pelanggan <span className="required">*</span></label>
                <div className="form-row">
                  <select value={form.pelangganId} onChange={(e) => selectCustomer(e.target.value)}>
                    <option value="">Pilih pelanggan...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama} - {c.noTelp}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Nama Pelanggan <span className="required">*</span></label>
                <input type="text" value={form.pelangganNama} onChange={(e) => setForm({ ...form, pelangganNama: e.target.value })} placeholder="Nama pelanggan" required />
              </div>
              <div className="form-group">
                <label>Layanan <span className="required">*</span></label>
                <select value={form.layanan} onChange={(e) => setForm({ ...form, layanan: e.target.value })} required>
                  <option value="">Pilih layanan...</option>
                  {layananList.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tanggal <span className="required">*</span></label>
                <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Jam Mulai <span className="required">*</span></label>
                  <input type="time" value={form.jamMulai} onChange={(e) => setForm({ ...form, jamMulai: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Jam Selesai <span className="required">*</span></label>
                  <input type="time" value={form.jamSelesai} onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Catatan</label>
                <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan (opsional)" rows={3} />
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
