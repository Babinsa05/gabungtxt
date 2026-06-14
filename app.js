// ==================== DATA STORE ====================
let files = [];
let finalText = "";
let detectedDesa = "";
let detectedBulan = "";

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const kataKerja = ['melaksanakan', 'melakukan', 'mengikuti', 'menghadiri', 'melaporkan', 'memeriksa', 'mendampingi'];

function showToast(msg, bgColor) {
    let existing = document.querySelector('.toast');
    if (existing) existing.remove();
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.backgroundColor = bgColor;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function bersihkanNamaDesa(nama) {
    if (!nama) return null;
    for (let kata of kataKerja) {
        if (nama.toLowerCase() === kata.toLowerCase()) return null;
        if (nama.toLowerCase().includes(kata.toLowerCase())) {
            let bagian = nama.split(new RegExp(kata, 'i'))[0];
            if (bagian && bagian.trim().length > 0) return bagian.trim();
            return null;
        }
    }
    return nama;
}

function deteksiDesa(teks) {
    let match = teks.match(/\bDesa\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match) { let nama = bersihkanNamaDesa(match[1]); if (nama) return nama; }
    match = teks.match(/\bdi\s+Desa\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match) { let nama = bersihkanNamaDesa(match[1]); if (nama) return nama; }
    match = teks.match(/\bBabinsa\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match) {
        let calonNama = match[1];
        for (let kata of kataKerja) {
            if (calonNama.toLowerCase() === kata.toLowerCase()) return null;
        }
        return calonNama;
    }
    return null;
}

function deteksiBulan(teks) {
    for (let bulan of daftarBulan) {
        if (teks.includes(bulan)) return bulan;
    }
    return null;
}

function updatePreviewName() {
    const previewDiv = document.getElementById('previewName');
    if (detectedDesa && detectedBulan) {
        previewDiv.innerHTML = `📄 Nama file: <strong>${detectedDesa}_Gabungan_${detectedBulan}.txt</strong>`;
        previewDiv.style.background = '#d1fae5';
    } else if (detectedDesa) {
        previewDiv.innerHTML = `📄 Nama file: <strong>${detectedDesa}_Gabungan.txt</strong>`;
        previewDiv.style.background = '#fed7aa';
    } else if (detectedBulan) {
        previewDiv.innerHTML = `📄 Nama file: <strong>Gabungan_${detectedBulan}.txt</strong>`;
        previewDiv.style.background = '#fed7aa';
    } else {
        previewDiv.innerHTML = `📄 Nama file: <strong>Laporan_Gabungan.txt</strong>`;
        previewDiv.style.background = '#e6f0fa';
    }
}

async function deteksiMetadataDariFile() {
    let semuaTeks = "";
    for (let f of files) { semuaTeks += f.content + " "; }
    const desa = deteksiDesa(semuaTeks);
    if (desa && !kataKerja.includes(desa.toLowerCase())) detectedDesa = desa;
    const bulan = deteksiBulan(semuaTeks);
    if (bulan) detectedBulan = bulan;
    updatePreviewName();
    
    const infoDiv = document.getElementById('infoText');
    let txt = infoDiv.innerHTML;
    if (txt.includes('📍')) {
        infoDiv.innerHTML = txt.replace(/📍 Desa: [^|]+/, `📍 Desa: ${detectedDesa || '-'}`).replace(/📅 Bulan: [^|]+/, `📅 Bulan: ${detectedBulan || '-'}`);
    }
}

function bacaFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsText(file, "UTF-8");
    });
}

function parseEntries(content) {
    return content.split(/\r?\n/).filter(line => line.trim().length > 0);
}

function extractDate(entry) {
    const regex = /(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i;
    const match = entry.match(regex);
    if (match) {
        const bulanMap = { januari:1, februari:2, maret:3, april:4, mei:5, juni:6, juli:7, agustus:8, september:9, oktober:10, november:11, desember:12 };
        return new Date(parseInt(match[3]), bulanMap[match[2].toLowerCase()]-1, parseInt(match[1]));
    }
    return null;
}

function sortByDate(entries) {
    return [...entries].sort((a, b) => {
        const da = extractDate(a);
        const db = extractDate(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da - db;
    });
}

async function prosesOtomatis() {
    if (!files.length) {
        document.getElementById('output').innerHTML = '✨ Upload file/folder TXT...';
        document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat dihapus | 📍 Desa: - | 📅 Bulan: -';
        finalText = "";
        return;
    }
    document.getElementById('output').innerHTML = '🔄 Memproses...';
    let semua = [];
    for (let f of files) { semua.push(...parseEntries(f.content)); }
    let unik = [...new Map(semua.map(l => [l.toLowerCase().trim(), l])).values()];
    const duplikat = semua.length - unik.length;
    let terurut = sortByDate(unik);
    finalText = terurut.join('\n');
    document.getElementById('output').innerHTML = finalText || '(kosong)';
    document.getElementById('infoText').innerHTML = `📏 Total: ${terurut.length} entri | ${duplikat} duplikat | 📍 Desa: ${detectedDesa || '-'} | 📅 Bulan: ${detectedBulan || '-'}`;
    if (terurut.length) showToast(`✅ ${terurut.length} entri (${duplikat} duplikat)`, '#10b981');
}

async function tambahFile(file) {
    if (!file.name.endsWith('.txt')) { showToast(`⚠️ ${file.name} bukan TXT`, '#f59e0b'); return false; }
    if (files.some(f => f.name === file.name)) { showToast(`⚠️ ${file.name} sudah ada`, '#f59e0b'); return false; }
    const content = await bacaFile(file);
    files.push({ name: file.name, content });
    renderFileList();
    await deteksiMetadataDariFile();
    await prosesOtomatis();
    showToast(`✅ ${file.name}`, '#10b981');
    return true;
}

async function bacaFolder(entry) {
    let hasil = [];
    let reader = entry.createReader();
    const bacaSemua = () => {
        return new Promise((resolve) => {
            reader.readEntries(async (entries) => {
                for (let e of entries) {
                    if (e.isFile) {
                        let file = await new Promise(res => e.file(res));
                        if (file.name.endsWith('.txt')) hasil.push(file);
                    } else if (e.isDirectory) {
                        let sub = await bacaFolder(e);
                        hasil.push(...sub);
                    }
                }
                resolve();
            }, () => resolve());
        });
    };
    await bacaSemua();
    return hasil;
}

function renderFileList() {
    const container = document.getElementById('fileList');
    const counter = document.getElementById('fileCount');
    counter.innerText = `${files.length} file`;
    if (files.length === 0) { container.innerHTML = '📭 Belum ada file'; return; }
    container.innerHTML = files.map((f, i) => `<div class="file-item"><span>📄 ${escapeHtml(f.name)}</span><button class="remove-file" data-index="${i}">Hapus</button></div>`).join('');
    document.querySelectorAll('.remove-file').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.dataset.index);
            files.splice(idx, 1);
            renderFileList();
            await deteksiMetadataDariFile();
            if (files.length) { await prosesOtomatis(); }
            else {
                detectedDesa = ''; detectedBulan = '';
                updatePreviewName();
                document.getElementById('output').innerHTML = '✨ Upload file/folder TXT...';
                document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat | 📍 Desa: - | 📅 Bulan: -';
                finalText = '';
            }
            showToast('File dihapus', '#475569');
        });
    });
}

function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

function download() {
    if (!finalText) { showToast('Tidak ada data', '#f59e0b'); return; }
    let nama = (detectedDesa && detectedBulan) ? `${detectedDesa}_Gabungan_${detectedBulan}.txt` : `Laporan_Gabungan_${new Date().toISOString().slice(0,10)}.txt`;
    const blob = new Blob([finalText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nama;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast(`⬇️ ${nama}`, '#10b981');
}

function clearAll() {
    if (!files.length) return;
    if (confirm(`Hapus ${files.length} file?`)) {
        files = []; finalText = ''; detectedDesa = ''; detectedBulan = '';
        updatePreviewName(); renderFileList();
        document.getElementById('output').innerHTML = '✨ Upload file/folder TXT...';
        document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat | 📍 Desa: - | 📅 Bulan: -';
        showToast('Semua dihapus', '#475569');
    }
}

async function loadKonten() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        document.getElementById('guideContent').innerHTML = data.guide;
        document.getElementById('promptContent').innerHTML = `<div class="prompt-header"><strong>📜 PROMPT LENGKAP</strong><button id="copyPromptBtn" class="copy-btn">📋 Copy</button></div><div class="prompt-box">${data.prompt.text}</div>`;
        document.getElementById('wordContent').innerHTML = data.wordGuide;
        document.getElementById('copyPromptBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(data.prompt.text).then(() => showToast('✅ Prompt disalin!', '#10b981'));
        });
    } catch(e) { console.error(e); }
}

// Event Listeners
document.getElementById('addFilesBtn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.multiple = true; input.accept = '.txt';
    input.onchange = async (e) => { for (let f of e.target.files) await tambahFile(f); };
    input.click();
};

document.getElementById('addFolderBtn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.webkitdirectory = true;
    input.onchange = async (e) => {
        let added = 0;
        for (let f of e.target.files) {
            if (f.name.endsWith('.txt') && !files.some(ex => ex.name === f.name)) {
                files.push({ name: f.name, content: await bacaFile(f) });
                added++;
            }
        }
        renderFileList(); await deteksiMetadataDariFile(); if (files.length) await prosesOtomatis();
        showToast(`📁 ${added} file`, '#475569');
    };
    input.click();
};

document.getElementById('clearAllBtn').onclick = clearAll;
document.getElementById('downloadBtn').onclick = download;

const dropZone = document.getElementById('dropZone');
dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
dropZone.ondragleave = () => { dropZone.classList.remove('drag-over'); };
dropZone.ondrop = async (e) => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    for (let item of e.dataTransfer.items) {
        const entry = item.webkitGetAsEntry();
        if (!entry) continue;
        if (entry.isFile) {
            const file = await new Promise(r => entry.file(r));
            if (file.name.endsWith('.txt')) await tambahFile(file);
        } else if (entry.isDirectory) {
            let added = 0;
            for (let f of await bacaFolder(entry)) {
                if (!files.some(ex => ex.name === f.name)) {
                    files.push({ name: f.name, content: await bacaFile(f) });
                    added++;
                }
            }
            renderFileList(); await deteksiMetadataDariFile(); if (files.length) await prosesOtomatis();
            showToast(`📁 ${added} file`, '#475569');
        }
    }
};

const tabs = document.querySelectorAll('.tab-btn');
const panes = document.querySelectorAll('.tab-pane');
tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        tabs.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(id).classList.add('active');
    });
});

renderFileList();
updatePreviewName();
loadKonten();