╔════════════════════════════════════════════════════════════════════════════╗
║                    PANDUAN GIT AUTO SYNC - TXT COMBINER                    ║
╚════════════════════════════════════════════════════════════════════════════╝

📌 PERSYARATAN
===============================================================================
1. Git for Windows sudah terinstall (dari https://git-scm.com/downloads)
2. Folder proyek: D:\APLIKASI\HTML GIT\gabungtxt-main
3. Koneksi internet aktif


🚀 CARA MENGGUNAKAN
===============================================================================

【OPSI 1: INSTALL SERVICE (REKOMENDASI)】
    ✅ Auto sync berjalan di BACKGROUND (tanpa jendela)
    ✅ Aktif otomatis saat Windows menyala
    ✅ Tidak perlu klik apapun lagi setelah install

    Cara:
    - Jalankan "INSTALL-SERVICE.bat" (sebagai Administrator)
    - Selesai! Auto sync sudah berjalan


【OPSI 2: RUN MANUAL (UNTUK TESTING)】
    ✅ Bisa melihat proses berjalan di jendela
    ✅ Cocok untuk debugging

    Cara:
    - Jalankan "RUN-NOW.bat"
    - Biarkan jendela terbuka
    - Tutup jendela untuk berhenti


【OPSI 3: TEST SEKALI (TANPA LOOP)】
    ✅ Commit dan push hanya SEKALI
    ✅ Tidak ada monitoring berkelanjutan

    Cara:
    - Jalankan "TEST-SYNC.bat"


🔧 UTILITY LAINNYA
===============================================================================

📊 CHECK-STATUS.bat    → Cek status folder vs GitHub
🛑 STOP-SYNC.bat       → Hentikan auto sync service


📁 FILE YANG DIMONITOR
===============================================================================

Semua file di folder ini akan otomatis sync ke GitHub:
- index.html
- style.css
- app.js
- data.json
- manifest.json
- sw.js
- icon-*.png
- dan semua file lain di folder ini


⚙️ CARA KERJA
===============================================================================

1. Script AUTO-SYNC.sh berjalan di background
2. Setiap 5 detik mengecek perubahan file
3. Jika ada perubahan:
   - git add . (menambahkan semua file)
   - git commit (dengan pesan otomatis + timestamp)
   - git push (ke GitHub)
4. Website akan update dalam 1-2 menit


🛠️ TROUBLESHOOTING
===============================================================================

❌ "bash: command not found"
   → Git Bash belum terinstall. Download dari git-scm.com

❌ "Permission denied"
   → Jalankan INSTALL-SERVICE.bat sebagai Administrator

❌ Tidak sync ke GitHub
   → Cek koneksi internet
   → Jalankan CHECK-STATUS.bat untuk melihat error

❌ Website tidak update
   → Tunggu 1-2 menit setelah push
   → Clear cache browser (Ctrl+F5)


📞 BUTUH BANTUAN?
===============================================================================

Jika ada masalah, silakan tanyakan ke pembuat script ini.