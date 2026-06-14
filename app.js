// ==================== DATA STORE ====================
let files = [];
let finalText = "";
let allEntries = [];
let detectedDesa = "";
let detectedBulan = "";

// Daftar konstanta
const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const kataKerja = ['melaksanakan', 'melakukan', 'mengikuti', 'menghadiri', 'melaporkan', 'memeriksa', 'mendampingi', 'mensosialisasikan', 'berkoordinasi', 'berpartisipasi'];

// ==================== UTILITY FUNCTIONS ====================
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
    if (match) {
        let nama = bersihkanNamaDesa(match[1]);
        if (nama) return nama;
    }
    match = teks.match(/\bdi\s+Desa\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match) {
        let nama = bersihkanNamaDesa(match[1]);
        if (nama) return nama;
    }
    match = teks.match(/\bBabinsa\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match) {
        let calonNama = match[1];
        let isValid = true;
        for (let kata of kataKerja) {
            if (calonNama.toLowerCase() === kata.toLowerCase()) {
                isValid = false;
                break;
            }
        }
        if (isValid) return calonNama;
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
        previewDiv.innerHTML = `📄 Nama file output: <strong>${detectedDesa}_Gabungan_${detectedBulan}.txt</strong>`;
        previewDiv.style.background = '#d1fae5';
        previewDiv.style.color = '#065f46';
    } else if (detectedDesa) {
        previewDiv.innerHTML = `📄 Nama file output: <strong>${detectedDesa}_Gabungan.txt</strong> (Bulan belum terdeteksi)`;
        previewDiv.style.background = '#fed7aa';
        previewDiv.style.color = '#92400e';
    } else if (detectedBulan) {
        previewDiv.innerHTML = `📄 Nama file output: <strong>Gabungan_${detectedBulan}.txt</strong> (Desa belum terdeteksi)`;
        previewDiv.style.background = '#fed7aa';
        previewDiv.style.color = '#92400e';
    } else {
        previewDiv.innerHTML = `📄 Nama file output: <strong>Laporan_Gabungan.txt</strong> (Deteksi otomatis dari isi file)`;
        previewDiv.style.background = '#e6f0fa';
        previewDiv.style.color = '#1e3a5f';
    }
}

async function deteksiMetadataDariFile() {
    let semuaTeks = "";
    for (let f of files) {
        semuaTeks += f.content + " ";
    }
    const desa = deteksiDesa(semuaTeks);
    if (desa && !kataKerja.includes(desa.toLowerCase())) detectedDesa = desa;
    const bulan = deteksiBulan(semuaTeks);
    if (bulan) detectedBulan = bulan;
    updatePreviewName();
    
    const infoDiv = document.getElementById('infoText');
    let currentInfo = infoDiv.innerHTML;
    if (currentInfo.includes('📍')) {
        infoDiv.innerHTML = currentInfo.replace(/📍 Desa: [^|]+/, `📍 Desa: ${detectedDesa || '-'}`).replace(/📅 Bulan: [^|]+/, `📅 Bulan: ${detectedBulan || '-'}`);
    }
}

function bacaFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => resolve("");
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
        return new Date(parseInt(match[3]), bulanMap[match[2].toLowerCase()] - 1, parseInt(match[1]));
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
        document.getElementById('output').innerHTML = '✨ Upload file/folder TXT, akan digabung otomatis...';
        document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat dihapus | 📍 Desa: - | 📅 Bulan: -';
        finalText = "";
        return;
    }
    
    document.getElementById('output').innerHTML = '🔄 Memproses file...';
    
    let semua = [];
    for (let f of files) {
        semua.push(...parseEntries(f.content));
    }
    
    let unik = [...new Map(semua.map(l => [l.toLowerCase().trim(), l])).values()];
    const duplikatTerhapus = semua.length - unik.length;
    let terurut = sortByDate(unik);
    
    allEntries = terurut;
    finalText = terurut.join('\n');
    
    document.getElementById('output').innerHTML = finalText || '(kosong)';
    document.getElementById('infoText').innerHTML = `📏 Total: ${terurut.length} entri | ${duplikatTerhapus} duplikat dihapus | 📍 Desa: ${detectedDesa || '-'} | 📅 Bulan: ${detectedBulan || '-'}`;
    
    if (terurut.length > 0) {
        showToast(`✅ Selesai! ${terurut.length} entri (${duplikatTerhapus} duplikat dihapus)`, '#10b981');
    }
}

async function tambahFile(file) {
    if (!file.name.endsWith('.txt')) {
        showToast(`⚠️ ${file.name} bukan file TXT`, '#f59e0b');
        return false;
    }
    if (files.some(f => f.name === file.name)) {
        showToast(`⚠️ ${file.name} sudah ada`, '#f59e0b');
        return false;
    }
    
    const content = await bacaFile(file);
    files.push({ name: file.name, content });
    renderFileList();
    await deteksiMetadataDariFile();
    await prosesOtomatis();
    showToast(`✅ ${file.name} ditambahkan`, '#10b981');
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
                        if (file.name.endsWith('.txt')) {
                            hasil.push(file);
                        }
                    } else if (e.isDirectory) {
                        let subFiles = await bacaFolder(e);
                        hasil.push(...subFiles);
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
    const fileListDiv = document.getElementById('fileList');
    const fileCountSpan = document.getElementById('fileCount');
    
    fileCountSpan.innerText = `${files.length} file`;
    
    if (files.length === 0) {
        fileListDiv.innerHTML = '📭 Belum ada file';
        return;
    }
    
    fileListDiv.innerHTML = files.map((f, i) => `
        <div class="file-item">
            <span>📄 ${escapeHtml(f.name)}</span>
            <button class="remove-file" data-index="${i}">Hapus</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-file').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            files.splice(index, 1);
            renderFileList();
            await deteksiMetadataDariFile();
            if (files.length) {
                await prosesOtomatis();
            } else {
                detectedDesa = '';
                detectedBulan = '';
                updatePreviewName();
                document.getElementById('output').innerHTML = '✨ Upload file/folder TXT, akan digabung otomatis...';
                document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat dihapus | 📍 Desa: - | 📅 Bulan: -';
                finalText = '';
            }
            showToast('🗑️ File dihapus', '#475569');
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

function download() {
    if (!finalText || finalText.length === 0) {
        showToast('⚠️ Tidak ada hasil untuk di-download', '#f59e0b');
        return;
    }
    
    let outputName;
    if (detectedDesa && detectedBulan) {
        outputName = `${detectedDesa}_Gabungan_${detectedBulan}.txt`;
    } else if (detectedDesa) {
        outputName = `${detectedDesa}_Gabungan.txt`;
    } else if (detectedBulan) {
        outputName = `Gabungan_${detectedBulan}.txt`;
    } else {
        outputName = `Laporan_Gabungan_${new Date().toISOString().slice(0, 10)}.txt`;
    }
    
    const blob = new Blob([finalText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = outputName;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`⬇️ Download: ${outputName}`, '#10b981');
}

function clearAll() {
    if (files.length === 0) {
        showToast('📭 Tidak ada file yang dihapus', '#475569');
        return;
    }
    if (confirm(`Hapus semua ${files.length} file?`)) {
        files = [];
        finalText = '';
        allEntries = [];
        detectedDesa = '';
        detectedBulan = '';
        updatePreviewName();
        renderFileList();
        document.getElementById('output').innerHTML = '✨ Upload file/folder TXT, akan digabung otomatis...';
        document.getElementById('infoText').innerHTML = '📏 Total: 0 entri | 0 duplikat dihapus | 📍 Desa: - | 📅 Bulan: -';
        showToast('🗑️ Semua file dihapus', '#475569');
    }
}

// ==================== LOAD CONTENT FROM JSON ====================
async function loadContentFromJSON() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const guideContent = document.getElementById('guideContent');
        if (guideContent && data.guide) guideContent.innerHTML = data.guide;
        
        const promptContent = document.getElementById('promptContent');
        if (promptContent && data.prompt) {
            promptContent.innerHTML = `
                <div class="prompt-header"><strong>📜 PROMPT LENGKAP</strong><button id="copyPromptBtn" class="copy-btn">📋 Copy Prompt</button></div>
                <div class="prompt-box" id="promptText">${data.prompt.text}</div>
            `;
            const copyBtn = document.getElementById('copyPromptBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const promptText = document.getElementById('promptText')?.innerText || '';
                    navigator.clipboard.writeText(promptText).then(() => showToast('✅ Prompt AI disalin!', '#10b981'));
                });
            }
        }
        
        const wordContent = document.getElementById('wordContent');
        if (wordContent && data.wordGuide) {
            wordContent.innerHTML = data.wordGuide;
            const copyExampleBtn = document.getElementById('copyExampleTextBtn');
            if (copyExampleBtn) {
                copyExampleBtn.addEventListener('click', () => {
                    const exampleText = document.getElementById('exampleText')?.innerText || '';
                    navigator.clipboard.writeText(exampleText).then(() => showToast('✅ Contoh laporan disalin!', '#10b981'));
                });
            }
        }
        
        const readmeDisplay = document.getElementById('readmeContentDisplay');
        if (readmeDisplay && data.readme) readmeDisplay.innerText = data.readme;
        
    } catch (error) {
        console.error('Gagal memuat data.json:', error);
        showToast('Gagal memuat konten panduan', '#ef4444');
    }
}

// ==================== EVENT LISTENERS ====================
document.getElementById('addFilesBtn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.txt';
    input.onchange = async (e) => {
        for (let file of e.target.files) {
            await tambahFile(file);
        }
    };
    input.click();
};

document.getElementById('addFolderBtn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = async (e) => {
        const allFiles = Array.from(e.target.files);
        const txtFiles = allFiles.filter(f => f.name.endsWith('.txt'));
        let addedCount = 0;
        for (let file of txtFiles) {
            if (!files.some(ex => ex.name === file.name)) {
                const content = await bacaFile(file);
                files.push({ name: file.name, content });
                addedCount++;
            }
        }
        renderFileList();
        await deteksiMetadataDariFile();
        if (files.length) await prosesOtomatis();
        showToast(`📁 ${addedCount} file TXT dari folder`, '#475569');
    };
    input.click();
};

document.getElementById('clearAllBtn').onclick = clearAll;
document.getElementById('downloadBtn').onclick = download;

// Drag & Drop
const dropZone = document.getElementById('dropZone');
dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.background = '#eef2ff'; };
dropZone.ondragleave = () => { dropZone.style.background = '#f8fafc'; };
dropZone.ondrop = async (e) => {
    e.preventDefault();
    dropZone.style.background = '#f8fafc';
    const items = e.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (!entry) continue;
        if (entry.isFile) {
            const file = await new Promise(r => entry.file(r));
            if (file.name.endsWith('.txt')) await tambahFile(file);
        } else if (entry.isDirectory) {
            const filesFromFolder = await bacaFolder(entry);
            let addedCount = 0;
            for (let file of filesFromFolder) {
                if (!files.some(ex => ex.name === file.name)) {
                    const content = await bacaFile(file);
                    files.push({ name: file.name, content });
                    addedCount++;
                }
            }
            renderFileList();
            await deteksiMetadataDariFile();
            if (files.length) await prosesOtomatis();
            showToast(`📁 ${addedCount} file dari folder`, '#475569');
        }
    }
};

// Tab Switching
const tabs = document.querySelectorAll('.tab-btn');
const panes = document.querySelectorAll('.tab-pane');
tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        tabs.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = document.getElementById(tabId);
        if (pane) pane.classList.add('active');
    });
});

document.getElementById('copyReadmeBtn')?.addEventListener('click', () => {
    const readmeContent = document.getElementById('readmeContentDisplay')?.innerText || '';
    navigator.clipboard.writeText(readmeContent).then(() => showToast('✅ README disalin!', '#10b981'));
});

// ==================== INIT ====================
renderFileList();
updatePreviewName();
loadContentFromJSON();