# Gudang Mitra Bhakti — Dukuh Prosutan

Aplikasi transparansi saldo/kas + pengajuan peminjaman perkakas.

- **Login Admin**: kelola kas, daftar harga sewa, dan proses pengajuan warga
- **Login Warga**: 1 akun dipakai bersama seluruh warga — lihat transparansi kas & ajukan peminjaman
- **Alur peminjaman**: Warga ajukan → Admin setujui/tolak → Admin tandai **Lunas** → otomatis tercatat sebagai pemasukan di buku kas

Dibangun dengan **Next.js 14 + Prisma + Supabase (PostgreSQL, gratis) + NextAuth**, siap deploy ke **Vercel (gratis)**.

---

## 0. Yang perlu disiapkan

- Akun [GitHub](https://github.com) (gratis) — untuk menyimpan kode
- Akun [Supabase](https://supabase.com) (gratis) — untuk database
- Akun [Vercel](https://vercel.com) (gratis) — untuk hosting
- [Node.js](https://nodejs.org) versi 18 ke atas terpasang di komputer

---

## 1. Buat database di Supabase (gratis)

1. Buka [supabase.com](https://supabase.com) → Sign up / login → **New Project**
2. Isi nama project (mis. `gudang-mitra-bhakti`), buat password database yang kuat (**catat password ini**), pilih region terdekat (mis. Singapore)
3. Tunggu ± 2 menit sampai project siap
4. Masuk ke **Project Settings** (ikon gerigi) → **Database**
5. Di bagian **Connection string**, salin dua jenis koneksi:
   - Mode **Transaction** (port `6543`) → ini untuk `DATABASE_URL`
   - Mode **Session** (port `5432`) → ini untuk `DIRECT_URL`
6. Ganti `[YOUR-PASSWORD]` di kedua connection string dengan password yang kamu buat di langkah 2

Simpan dulu kedua string ini, akan dipakai di langkah 3.

---

## 2. Jalankan aplikasi di komputer (lokal)

```bash
# 1. Masuk ke folder project
cd gudang-mitra

# 2. Install semua dependency
npm install

# 3. Salin file environment
cp .env.example .env.local
```

Buka `.env.local`, lalu isi:

```
DATABASE_URL="<connection string mode Transaction dari Supabase>"
DIRECT_URL="<connection string mode Session dari Supabase>"
NEXTAUTH_SECRET="<hasil dari: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="<buat password kuat sendiri>"
WARGA_USERNAME="warga"
WARGA_PASSWORD="<buat password sendiri, ini yang dibagikan ke semua warga>"
```

> Tidak punya `openssl`? Generate secret di https://generate-secret.vercel.app/32

Lalu buat tabel di database & isi daftar harga sewa perkakas:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Terakhir, jalankan aplikasinya:

```bash
npm run dev
```

Buka http://localhost:3000 → coba login dengan akun admin dan akun warga yang sudah kamu atur.

---

## 3. Upload kode ke GitHub

```bash
git init
git add .
git commit -m "Inisialisasi Gudang Mitra Bhakti"
```

Buat repository baru (kosong) di GitHub, lalu:

```bash
git remote add origin <URL-repo-github-kamu>
git branch -M main
git push -u origin main
```

---

## 4. Deploy ke Vercel (gratis)

1. Buka [vercel.com](https://vercel.com) → login pakai akun GitHub
2. **Add New → Project** → pilih repository yang baru di-push
3. Di bagian **Environment Variables**, masukkan semua isi `.env.local` kamu, dengan satu perubahan:
   - `NEXTAUTH_URL` diisi dengan URL Vercel kamu nanti, contoh: `https://gudang-mitra-bhakti.vercel.app`
   (kalau belum tahu nama domainnya, deploy dulu sekali, lihat URL-nya, lalu edit env var ini dan **Redeploy**)
4. Klik **Deploy**, tunggu proses build selesai
5. Buka URL yang diberikan Vercel — aplikasi sudah live 🎉

---

## 5. Bagikan ke warga

- Bagikan **1 username + password warga** ke seluruh warga Dukuh Prosutan (lewat grup WA, misalnya)
- Simpan username + password admin hanya untuk pengurus gudang

---

## Struktur alur aplikasi

```
Warga login → lihat saldo & riwayat kas (transparan)
           → ajukan peminjaman perkakas (pilih barang + tanggal pakai)
           → cek status di "Riwayat Pengajuan"

Admin login → lihat pengajuan masuk → Setujui / Tolak
           → setelah warga bayar → tandai "Lunas"
             (otomatis tercatat sebagai pemasukan di buku kas)
           → bisa catat transaksi lain manual (pembelian barang, dsb — pengeluaran)
           → kelola daftar harga sewa perkakas
```

## Catatan tentang daftar harga awal

Daftar yang kamu kirim ada 2 item bernama **"Tratak"** dengan harga berbeda (Rp100.000 dan Rp250.000) — kemungkinan ukuran kecil & besar. Di seed data saya beri label **"Tratak (Kecil)"** dan **"Tratak (Besar)"** supaya tidak tertukar. Kamu bisa ubah nama/harga kapan saja lewat menu **Admin → Daftar Perkakas**.

## Mengubah password nanti

Cukup ubah `ADMIN_PASSWORD` / `WARGA_PASSWORD` di **Vercel → Project Settings → Environment Variables**, lalu **Redeploy**. Tidak perlu ubah kode.

## Biaya

Semua yang dipakai (Vercel Hobby, Supabase Free Tier) gratis untuk skala pemakaian RT/dukuh. Supabase free tier memberi 500MB database, lebih dari cukup untuk ribuan transaksi.
