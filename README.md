# CMS App – Take-Home Frontend Test

**Live Demo:** [https://cms-app.fakhrurcodes.my.id](https://cms-app.fakhrurcodes.my.id)

CMS sederhana yang dibangun menggunakan Next.js & TypeScript untuk memenuhi take-home test frontend. Aplikasi ini menyediakan fitur login, halaman dashboard, serta halaman pengaturan untuk mengelola **Menu Groups** dan **Menus**.

---

##  Tech Stack

- **Next.js** : Framework React 
- **TypeScript** : Bahasa pemrograman
- **MUI (Material UI)** : Komponen UI 
- **React Hook Form + Zod** : Untuk manajemen form dan validasi skema
- **Zustand** : State management 
- **React Query** : Pengelolaan data async 
- **Tailwind CSS** : Utility-first CSS framework
- **React Toastify** : Notifikasi toast
- **localStorage** : Menyimpan data secara lokal agar persist setelah reload

---

## Features

### Authentication
- Halaman login sederhana
- Kredensial hardcoded
- Redirect ke Home setelah berhasil login
- **Logout**: menghapus session dan kembali ke halaman login

### Home Page
- Halaman dashboard setelah login
- Menampilkan pesan sambutan
- Tombol logout

###  Settings Page
####  Menu Group Management
- Tambah, edit, dan hapus group
- Daftar semua menu group yang ada

####  Menu Management
- Tambah menu ke group tertentu
- Hapus menu dari group
- Edit menu
- Tampilkan semua menu berdasarkan group-nya

### Theme Toggle
- **Dark Mode & Light Mode** (otomatis tersimpan)

### Responsiveness
- Tampilan mendukung mobile, tablet, dan desktop

### Bonus
- Validasi form menggunakan Zod
- State management pakai Zustand
- Data persist dengan `localStorage`
- Formatting otomatis (Prettier + ESLint )
- Dark Mode disimpan dan diterapkan otomatis

---

##  How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

#Credential
Username : admin
Password : password
