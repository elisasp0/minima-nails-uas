# Minima Nails

Minima Nails adalah aplikasi web berbasis React dan Node.js yang dibuat untuk membantu pengelolaan operasional bisnis nail artist dan salon kecantikan secara terstruktur. Aplikasi ini mencakup pengelolaan pelanggan, booking, layanan (services), kalkulator harga, keuangan, stok, kasbon, dashboard, serta portofolio hasil nail art.

## Tujuan Aplikasi

Aplikasi ini dibuat untuk mempermudah admin atau pemilik salon dalam:

- Mengelola data pelanggan.
- Mengatur jadwal booking pelanggan.
- Mengelola daftar layanan (services).
- Menghitung estimasi harga layanan.
- Mengelola pemasukan dan pengeluaran.
- Mengelola stok produk dan alat.
- Mencatat kasbon pelanggan.
- Menampilkan portofolio hasil nail art.
- Melihat dashboard dan laporan usaha.

## Target Pengguna

Target pengguna aplikasi Minima Nails adalah:

- Nail Artist Freelance.
- Salon Nails Skala Kecil.
- UMKM Jasa Nail Art.
- Admin atau pemilik salon.

## Fitur Utama

1. Login dan autentikasi admin.
2. Dashboard bisnis.
3. CRUD data pelanggan.
4. CRUD data booking.
5. Manajemen layanan (Services).
6. Price Calculator.
7. Manajemen stok.
8. Manajemen keuangan.
9. Pencatatan kasbon pelanggan.
10. Portofolio hasil nail art.
11. Dashboard laporan sederhana.
12. Logout dan Protected Route.

## Alur Status Booking

Status booking berjalan dengan urutan:

```text
menunggu → dikonfirmasi → diproses → selesai
```

Booking juga dapat diubah menjadi status:

```text
dibatalkan
```

## Teknologi yang Digunakan

### Frontend

- React.js
- Vite
- JavaScript
- CSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- BcryptJS
- Express Rate Limit
- CORS

### Database

- SQLite

## Struktur Folder

```text
minima-nails
├── backend
│   ├── routes
│   ├── uploads
│   ├── database
│   ├── middleware
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── App.jsx
│   └── package.json
│
├── PRD.md
├── README.md
└── .gitignore
```

## Cara Menjalankan Aplikasi

### 1. Menjalankan Backend

Buka terminal kemudian jalankan:

```bash
cd backend
npm install
npm run dev
```

Backend akan berjalan pada:

```text
http://localhost:5000
```

### 2. Menjalankan Frontend

Buka terminal baru kemudian jalankan:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

## Akun Admin Default

Gunakan akun berikut untuk masuk ke aplikasi:

```text
Username : admin
Password : admin123
```

## Dokumentasi Perencanaan

Dokumentasi kebutuhan sistem dan perencanaan pengembangan aplikasi dapat dilihat pada file:

```text
PRD.md
```

## Repository GitHub

Repository aplikasi:

```text
https://github.com/elisasp0/minima-nails-uas
```

## Status Pengembangan

Tahapan utama pengembangan aplikasi telah diselesaikan, meliputi:

1. Setup project dan autentikasi.
2. Manajemen pelanggan.
3. Sistem booking.
4. Manajemen layanan (Services).
5. Price Calculator.
6. Manajemen keuangan.
7. Manajemen stok.
8. Kasbon pelanggan.
9. Dashboard dan laporan.

Aplikasi telah memasuki tahap final testing dan penyempurnaan antarmuka (UI/UX).

## Pengembang

**Elisa Putri**  
Program Studi Sistem Informasi  
Universitas Stikubank (UNISBANK) Semarang

Project ini dibuat untuk memenuhi tugas **Ujian Akhir Semester (UAS)** mata kuliah Pengembangan Aplikasi Web Bisnis.