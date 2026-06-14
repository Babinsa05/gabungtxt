// ==================== SUPABASE CONFIG ====================
const SUPABASE_URL = 'https://qthoexsadattfnnzcawh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aG9leHNhZGF0dGZubnpjYXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTMzNTAsImV4cCI6MjA5NjEyOTM1MH0.qZBFjrN8F8vwxoaPKIPLDQIOWbt58BNlPWLOn4J_5_4';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== FUNGSI SUPABASE ====================

// 1. Simpan CSS ke Supabase
async function simpanCSSkeSupabase(namaFile, kontenCSS) {
    const { data, error } = await supabase
        .from('file_css')
        .upsert({ 
            id: namaFile, 
            konten: kontenCSS,
            updated_at: new Date()
        });
    
    if (error) {
        console.error('Gagal simpan CSS:', error);
        return false;
    }
    console.log('✅ CSS tersimpan:', namaFile);
    return true;
}

// 2. Baca CSS dari Supabase
async function bacaCSSdariSupabase(namaFile) {
    const { data, error } = await supabase
        .from('file_css')
        .select('konten')
        .eq('id', namaFile)
        .single();
    
    if (error) {
        console.error('Gagal baca CSS:', error);
        return null;
    }
    return data?.konten || null;
}

// 3. Terapkan CSS ke halaman
async function terapkanCSSdariSupabase() {
    const cssKonten = await bacaCSSdariSupabase('style.css');
    if (cssKonten) {
        const styleTag = document.createElement('style');
        styleTag.textContent = cssKonten;
        document.head.appendChild(styleTag);
        console.log('✅ CSS dari Supabase diterapkan');
        return true;
    }
    return false;
}

// 4. Simpan hasil gabungan TXT ke Supabase
async function simpanHasilGabungan(hasilTeks, metadata) {
    const { data, error } = await supabase
        .from('hasil_gabungan')
        .insert({
            id: crypto.randomUUID(),
            konten: hasilTeks,
            desa: metadata.desa,
            bulan: metadata.bulan,
            jumlah_entri: metadata.jumlahEntri,
            created_at: new Date()
        });
    
    if (error) {
        console.error('Gagal simpan hasil:', error);
        return null;
    }
    console.log('✅ Hasil gabungan tersimpan:', data);
    return data;
}

// 5. Ambil riwayat hasil gabungan
async function ambilRiwayatHasil(limit = 10) {
    const { data, error } = await supabase
        .from('hasil_gabungan')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) {
        console.error('Gagal ambil riwayat:', error);
        return [];
    }
    return data;
}

// 6. Simpan file TXT individual ke Supabase
async function simpanFileTXT(namaFile, konten, ukuran) {
    const { data, error } = await supabase
        .from('file_txt')
        .insert({
            id: crypto.randomUUID(),
            nama: namaFile,
            konten: konten,
            ukuran: ukuran,
            uploaded_at: new Date()
        });
    
    if (error) {
        console.error('Gagal simpan file:', error);
        return null;
    }
    return data;
}

// 7. Ambil semua file TXT dari Supabase
async function ambilSemuaFileTXT() {
    const { data, error } = await supabase
        .from('file_txt')
        .select('*')
        .order('uploaded_at', { ascending: false });
    
    if (error) {
        console.error('Gagal ambil file:', error);
        return [];
    }
    return data;
}

// 8. Hapus file TXT dari Supabase
async function hapusFileTXT(id) {
    const { error } = await supabase
        .from('file_txt')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Gagal hapus file:', error);
        return false;
    }
    return true;
}

// ==================== MODIFIKASI FUNGSI EXISTING ====================

// Simpan hasil gabungan ke Supabase (tambahkan di akhir prosesOtomatis)
async function prosesOtomatisDenganSupabase() {
    if (!files.length) {
        document.getElementById('output').innerHTML = '✨ Upload file/folder TXT...';
        document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat dihapus | 📍 Desa: - | 📅 Bulan: -';
        finalText = "";
        return;
    }
    
    document.getElementById('output').innerHTML = '🔄 Memproses file...';
    
    let semua = [];
    for (let f of files) { semua.push(...parseEntries(f.content)); }
    let unik = [...new Map(semua.map(l => [l.toLowerCase().trim(), l])).values()];
    const duplikat = semua.length - unik.length;
    let terurut = sortByDate(unik);
    finalText = terurut.join('\n');
    
    document.getElementById('output').innerHTML = finalText || '(kosong)';
    document.getElementById('infoText').innerHTML = `📏 Total: ${terurut.length} entri | ${duplikat} duplikat | 📍 Desa: ${detectedDesa || '-'} | 📅 Bulan: ${detectedBulan || '-'}`;
    
    if (terurut.length) {
        showToast(`✅ ${terurut.length} entri (${duplikat} duplikat)`, '#10b981');
        
        // SIMPAN KE SUPABASE
        await simpanHasilGabungan(finalText, {
            desa: detectedDesa || '-',
            bulan: detectedBulan || '-',
            jumlahEntri: terurut.length
        });
    }
}

// Saat upload file, simpan juga ke Supabase
async function tambahFileDenganSupabase(file) {
    if (!file.name.endsWith('.txt')) { 
        showToast(`⚠️ ${file.name} bukan TXT`, '#f59e0b'); 
        return false; 
    }
    if (files.some(f => f.name === file.name)) { 
        showToast(`⚠️ ${file.name} sudah ada`, '#f59e0b'); 
        return false; 
    }
    
    const content = await bacaFile(file);
    files.push({ name: file.name, content });
    
    // SIMPAN KE SUPABASE
    await simpanFileTXT(file.name, content, file.size);
    
    renderFileList();
    await deteksiMetadataDariFile();
    await prosesOtomatisDenganSupabase();
    showToast(`✅ ${file.name}`, '#10b981');
    return true;
}

// ==================== TAMBAHKAN TOMBOL & FITUR BARU ====================

// Buat tombol untuk menyimpan CSS ke Supabase
function tambahTombolSupabase() {
    const btnGroup = document.querySelector('.btn-group');
    if (btnGroup) {
        const btnSupabase = document.createElement('button');
        btnSupabase.id = 'saveToSupabaseBtn';
        btnSupabase.className = 'btn btn-purple';
        btnSupabase.innerHTML = '💾 Simpan CSS ke Supabase';
        btnSupabase.onclick = async () => {
            // Ambil CSS dari file atau dari style tag
            const cssKonten = await fetch('style.css').then(r => r.text()).catch(() => {
                // Jika tidak bisa fetch, ambil dari style tag
                let css = '';
                document.querySelectorAll('style').forEach(style => {
                    css += style.textContent;
                });
                return css;
            });
            
            await simpanCSSkeSupabase('style.css', cssKonten);
            showToast('✅ CSS tersimpan di Supabase!', '#10b981');
        };
        btnGroup.appendChild(btnSupabase);
        
        const btnLoadCss = document.createElement('button');
        btnLoadCss.id = 'loadCssFromSupabaseBtn';
        btnLoadCss.className = 'btn btn-outline';
        btnLoadCss.innerHTML = '📥 Load CSS dari Supabase';
        btnLoadCss.onclick = async () => {
            const success = await terapkanCSSdariSupabase();
            if (success) {
                showToast('✅ CSS dari Supabase dimuat!', '#10b981');
            } else {
                showToast('⚠️ Gagal load CSS', '#f59e0b');
            }
        };
        btnGroup.appendChild(btnLoadCss);
    }
}

// Buat panel riwayat hasil gabungan
function tambahPanelRiwayat() {
    const resultHeader = document.querySelector('.result-header');
    if (resultHeader && !document.getElementById('historyBtn')) {
        const btnHistory = document.createElement('button');
        btnHistory.id = 'historyBtn';
        btnHistory.className = 'btn btn-outline';
        btnHistory.innerHTML = '📜 Riwayat';
        btnHistory.onclick = async () => {
            const riwayat = await ambilRiwayatHasil(10);
            if (riwayat.length === 0) {
                showToast('Belum ada riwayat', '#475569');
                return;
            }
            
            let html = '📜 RIWAYAT HASIL GABUNGAN:\n\n';
            riwayat.forEach((item, i) => {
                html += `${i+1}. ${new Date(item.created_at).toLocaleString()}\n`;
                html += `   📍 Desa: ${item.desa} | 📅 Bulan: ${item.bulan} | 📊 ${item.jumlah_entri} entri\n`;
                html += `   📄 Preview: ${item.konten.substring(0, 100)}...\n\n`;
            });
            alert(html);
        };
        resultHeader.appendChild(btnHistory);
    }
}

// ==================== INISIALISASI ====================

// Ganti fungsi prosesOtomatis dengan yang versi Supabase
const prosesOtomatisOriginal = prosesOtomatis;
window.prosesOtomatis = prosesOtomatisDenganSupabase;

// Ganti fungsi tambahFile dengan yang versi Supabase
window.tambahFile = tambahFileDenganSupabase;

// Tambahkan tombol Supabase
setTimeout(() => {
    tambahTombolSupabase();
    tambahPanelRiwayat();
}, 1000);

console.log('✅ Supabase terintegrasi!');
console.log('📦 Tabel yang dibutuhkan: file_css, hasil_gabungan, file_txt');