PRD: Minima Nails - SaaS Digitalisasi Operasional dan Manajemen Bisnis Nail Artist
Latar Belakang
Industri nail art di Indonesia berkembang pesat, terutama di kalangan mikro-salon dan nail artist independen. Namun, banyak dari mereka yang masih mengelola bisnis secara manual menggunakan buku catatan, WhatsApp, atau media sosial. Minimnya akses ke teknologi yang ramah pengguna dan terjangkau membuat operasional bisnis mereka belum optimal. Perlunya solusi yang sederhana, ringan, dan dapat diakses dari perangkat dengan spesifikasi rendah menjadi krusial untuk mendukung digitalisasi usaha kecil ini.

Permasalahan
Pengelolaan Operasional Manual: Nail artist masih menggunakan buku catatan atau WhatsApp untuk mencatat pelanggan, jadwal booking, dan transaksi.
Double-Booking: Tanpa sistem penjadwalan yang terintegrasi, sering terjadi bentrok jadwal.
Kesulitan Estimasi Harga: Penentuan harga nail art masih subjektif dan tidak konsisten.
Manajemen Stok yang Tidak Terkontrol: Bahan nail art sering habis atau tidak tercatat dengan baik.
Keterbatasan Promosi Digital: Kesulitan memamerkan portofolio dan mencapai pelanggan baru.
Keterbatasan Akses Internet: Mayoritas pengguna hanya memiliki akses internet dengan kecepatan rendah.
Keterbatasan Perangkat: Pengguna menggunakan smartphone Android kelas menengah ke bawah.
Solusi
Minima Nails adalah platform SaaS berbasis web yang dirancang khusus untuk nail artist dan micro-salon. Aplikasi ini menyediakan fitur-fitur inti untuk mengelola operasional bisnis secara digital dengan antarmuka yang sederhana, responsif, dan ringan. Dengan pendekatan offline-first dan optimasi performa, aplikasi dapat berjalan lancar meskipun pada kondisi jaringan yang terbatas.

Target Pengguna
Nail Artist Independen: Pengguna yang membuka jasa nail art secara pribadi di rumah atau tempat khusus.
Micro-Salon: Usaha salon kecil dengan 1-5 tenaga kerja yang fokus pada layanan nail art.
Nail Technician Pemula: Pengguna yang baru memulai usaha dan membutuhkan bantuan mengelola operasional.
Nail Artist di Daerah: Pengguna yang berlokasi di daerah dengan akses internet terbatas dan perangkat terbatas.
User Persona
Persona 1: Siti (Nail Artist Independen)
Umur: 25 tahun
Lokasi: Bandung, Jawa Barat
Perangkat: Xiaomi Redmi Note 8 (RAM 3GB)
Koneksi Internet: 4G dengan koneksi yang tidak stabil
Karakteristik: Aktif di Instagram, gemar nail art, mengelola semua transaksi di WhatsApp
Keterbatasan: Belum terbiasa dengan aplikasi bisnis, butuh antarmuka sederhana
Persona 2: Ibu Rina (Pemilik Micro-Salon)
Umur: 35 tahun
Lokasi: Surabaya, Jawa Timur
Perangkat: Oppo A3s (RAM 2GB)
Koneksi Internet: WiFi di rumah, paket data terbatas
Karakteristik: Punya 2-3 karyiwan, menggunakan buku catatan untuk semua transaksi
Keterbatasan: Butuh sistem yang mudah diajari ke karyawan
User Story
Sebagai Nail Artist, saya ingin:
Mencatat pelanggan baru dengan mudah sehingga tidak perlu menulis di buku lagi.
Menghitung harga nail art secara otomatis agar tidak perlu menghitung manual.
Membuat jadwal booking yang tidak bentrok sehingga tidak ada yang kelewatan atau ganda.
Mengelola portofolio desain nail art agar mudah ditunjukkan ke pelanggan.
Memonitor pemasukan dan pengeluaran harian untuk mengontrol keuangan.
Mengecek stok bahan nail art secara real-time agar tidak kehabisan saat melayani pelanggan.
Mencatat kasbon pelanggan agar tidak lupa piutang.
Menerima notifikasi WhatsApp sehingga tidak ketinggalan jadwal.
Functional Requirements
FR-01: Kalkulator Estimasi Harga Otomatis
Pengguna dapat membuat paket layanan dengan harga tetap
Sistem menyediakan kalkulator dengan opsi layanan tambahan (upgrade)
Estimasi harga ditampilkan secara real-time
FR-02: Booking Online Pelanggan
Pelanggan dapat melakukan booking melalui tautan yang dibagikan
Pilihan tanggal dan jam yang tersedia otomatis terfilter
Status booking: pending, confirmed, done, cancelled
FR-03: Kalender dan Penjadwalan Anti Double-Booking
Kalender interaktif menampilkan jadwal harian/mingguan/bulanan
Sistem mencegah pembuatan booking pada slot yang sudah terisi
Notifikasi bentrok muncul jika ada upaya double-booking
FR-04: Manajemen Portofolio Desain Nail Art
Upload foto desain dengan kompresi otomatis
Kategori desain (minimalis, glitter, french, custom)
Galeri responsif yang dapat ditunjukkan ke pelanggan
FR-05: Dashboard Pemasukan dan Pengeluaran
Ringkasan transaksi harian/mingguan/bulanan
Grafik sederhana untuk visualisasi keuangan
Kategori pemasukan (layanan, dp, lainnya)
Kategori pengeluaran (stok, alat, operasional)
FR-06: Pengelolaan Stok Bahan Nail Art
Pencatatan stok masuk dan keluar
Notifikasi stok rendah
Daftar harga beli dan estimasi harga jual
FR-07: Pencatatan Kasbon Pelanggan
Form pencatatan kasbon dengan foto bukti
Status lunas/belum lunas
Notifikasi otomatis saat jatuh tempo
FR-08: Pengingat Jadwal dan Notifikasi WhatsApp
Reminder otomatis H-1 dan 1 jam sebelum booking
Integrasi WhatsApp untuk notifikasi
Pengingat stok rendah dan kasbon jatuh tempo
FR-09: Laporan Usaha Sederhana
Laporan penjualan harian/bulanan
Laporan paling populer layanan
Export data ke PDF/Excel
Non Functional Requirements
NFR-01: Kinerja pada Jaringan Lambat
Implementasi offline-first dengan sync otomatis saat online
Kompresi gambar otomatis (maks 500KB per foto)
Caching data penting di browser/localStorage
Lazy loading untuk komponen tidak penting
NFR-02: Mobile Friendly dan Responsif
Desain mobile-first dengan ukuran target 320px-480px
Touch-friendly button dengan ukuran minimal 44x44px
Font size minimal 14px untuk keterbacaan
Navigasi bawah (bottom navigation) untuk akses cepat
NFR-03: Ringan untuk Perangkat Mid-Low
JavaScript bundle maksimal 200KB (gzipped)
Minimal library eksternal, prioritas native CSS
Optimasi render dengan React.lazy atau code splitting
Transisi/animasi minimal untuk mengurangi beban
NFR-04: Aksesibilitas
Support bahasa Indonesia penuh
Kontras warna yang memadai
Keyboard navigation support
NFR-05: Keamanan
Autentikasi dengan JWT
Enkripsi data sensitif
Backup data otomatis ke cloud
MVP Features
Autentikasi pengguna (register, login, logout)
Manajemen pelanggan (CRUD pelanggan)
Kalkulator estimasi harga nail art
Booking dan kalender penjadwalan
Manajemen portofolio (upload, view, delete foto)
Dashboard pemasukan/pengeluaran sederhana
Manajemen stok bahan dasar
Pencatatan kasbon pelanggan
Future Features
Integrasi pembayaran digital (e-wallet, transfer)
Invoice otomatis ke email/WhatsApp
Sistem loyalitas poin pelanggan
Analisis keuntungan per desain/layanan
Template chat promo untuk WhatsApp
Integrasi marketplace untuk jual desain
Multi-user role (admin, nail artist, karyawan)
API publik untuk integrasi pihak ketiga
Workflow Sistem
1. Registrasi & Onboarding
   Pengguna → Isi data profil → Pilih paket langganan → Setup toko

2. Manajemen Pelanggan
   Pengguna → Tambah pelanggan → Sistem simpan data → Data siap dipakai

3. Booking Process
   Pelanggan → Buka link booking → Pilih tanggal/jam → Konfirmasi
   Pengguna → Terima notifikasi → Konfirmasi booking

4. Layanan Process
   Hari H → Notifikasi WhatsApp → Layani pelanggan → Catat transaksi

5. Manajemen Keuangan
   Pengguna → Input pemasukan/pengeluaran → Sistem catat → Dashboard update

6. Stok Management
   Pengguna → Input stok masuk → Sistem update → Cek stok saat layanan

7. Laporan & Analisis
   Pengguna → Buka dashboard → Lihat grafik → Download laporan
Success Metrics
Metrics Kualitas & Performa:
Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
Ukuran Aplikasi: < 1MB total bundle
Offline Support: 80% fitur utama dapat diakses offline
Metrics Penggunaan:
Retention Rate: > 70% pengguna aktif setelah 30 hari
Daily Active Users (DAU): > 60% pengguna terdaftar
Fitur Adoption Rate: > 50% pengguna menggunakan booking & portofolio
Metrics Bisnis:
Konversi ke Paid: > 3% pengguna gratis beralih ke berbayar
Churn Rate: < 5% bulanan
User Satisfaction: Rating > 4.0 di Play Store/App Store (jika ada)
Metrics Teknis:
Page Load Time: < 3 detik pada 3G simulation
Time to Interactive: < 5 detik
Offline Sync Success: > 95% data tersync saat online kembali
Kesimpulan
Pengembangan aplikasi berbasis web Minima Nails adalah solusi yang sangat relevan dengan kondisi nyata nail artist dan micro-salon di Indonesia. Dengan fokus pada:

Kemudahan Akses: Antarmuka sederhana yang dapat diakses pada perangkat mid-low dengan koneksi internet terbatas.

Kebutuhan Operasional Nyata: Fitur-fitur inti yang dirancang khusus untuk mengelola pelanggan, layanan, booking, keuangan, stok, dan kasbon dalam satu platform terintegrasi.

Pendekatan SaaS: Model berlangganan fleksibel, data tersentral di cloud, dan akses multi-perangkat tanpa instalasi rumit membuat aplikasi ini dapat diakses oleh semua kalangan.

Digitalisasi Bertahap: Dengan desain yang intuitif dan tidak membingungkan, nail artist dapat berpindah dari sistem manual ke digital secara gradual tanpa hambatan.

Melalui Minima Nails, nail artist dan micro-salon dapat meningkatkan efisiensi operasional, mengurangi kesalahan double-booking, serta memperluas jangkauan pasar melalui fitur portofolio digital dan booking online. Hal ini akan memperkuat daya saing usaha kecil dalam menghadapi era digitalisasi.