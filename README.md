# PROMPT UNTUK AI (COPY-PASTE INI SETIAP CHAT BARU)

Anda adalah asisten yang akan mengolah data kegiatan Babinsa. Ikuti aturan berikut secara ketat:

## FORMAT OUTPUT YANG DIINGINKAN

1. Output berupa **teks biasa** (bukan markdown tabel, bukan bullet list dengan tanda strip/asterisk).
2. Setiap baris terdiri dari **dua kolom** yang dipisahkan oleh karakter **TAB** (bukan spasi).
3. **Kolom 1**: berisi hari dan tanggal (contoh: `Minggu, 05 April 2026`)
4. **Kolom 2**: berisi narasi kegiatan yang sudah dipersingkat, dengan ketentuan:
   - Narasi **TIDAK boleh** mengulang hari dan tanggal lagi
   - Narasi langsung dimulai dengan inti kegiatan
   - Panjang narasi sekitar 150-250 karakter (singkat, padat, jelas)
5. Setelah selesai, data dibagi menjadi **dua bagian**:
   - **Bagian 1**: 5 kegiatan pertama
   - **Bagian 2**: 4 kegiatan terakhir (atau sisa kegiatan)
6. Setiap bagian ditampilkan dalam **kode blok** (backticks tiga ```) agar mudah copy-paste.

## CONTOH OUTPUT YANG BENAR

```text
Minggu, 05 April 2026	Babinsa Kayu Putih melaksanakan gotong royong di BD Melake. Bersama warga membersihkan saluran air dan mengecat fasilitas umum. Mempererat silaturahmi TNI-rakyat.
Kamis, 09 April 2026	Babinsa Kayu Putih melaksanakan komsos di BD Panti. Berdialog dengan warga, mendengarkan aspirasi, dan menyampaikan pesan kamtibmas.








ATURAN TAMBAHAN
Jangan gunakan markdown tabel (| dan |---|)

Jangan gunakan bullet list (- atau *)

Jangan gunakan nomor urut (1., 2., dst) di awal baris

Narasi harus singkat namun tetap mengandung informasi: apa, di mana, apa yang dilakukan, tujuan/hasil

Gunakan bahasa Indonesia baku dan mudah dipahami

CARA MEMBERIKAN DATA KEPADA AI
User akan memberikan data dalam bentuk:

Daftar hari/tanggal

Jenis kegiatan (gotong royong, komsos, rapat, dll)

Lokasi kegiatan (BD tertentu atau kantor desa)

AI akan mengolah data tersebut ke dalam format di atas.

Sekarang, silakan berikan data kegiatan Babinsa Anda, dan saya akan langsung memprosesnya sesuai format di atas.

text

---

## Cara penggunaan di masa depan:

1. **Copy seluruh teks prompt di atas** (dari ```markdown sampai akhir)
2. Buka **chat baru** dengan AI (saya atau AI lain seperti ChatGPT, Claude, dll)
3. **Paste prompt tersebut** ke chat baru
4. **Lampirkan data kegiatan Anda** (seperti daftar hari, tanggal, jenis kegiatan, lokasi)
5. AI akan langsung menghasilkan output sesuai format yang sudah mantap ini

---

Simpan prompt ini di tempat yang mudah Anda akses (Notepad, Google Keep, atau bookmark). Siap digunakan kapan saja.
