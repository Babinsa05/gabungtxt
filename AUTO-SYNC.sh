#!/bin/bash

# Warna output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║     🔄 GIT AUTO SYNC - REALTIME MONITOR 🔄                       ║"
echo "║                                                                  ║"
echo "║     📁 Folder: $(pwd)                                           ║"
echo "║     🌐 Repo:   https://github.com/Babinsa05/gabungtxt.git        ║"
echo "║                                                                  ║"
echo "║     ⚡ Setiap file berubah → auto commit + push ke GitHub        ║"
echo "║     📌 Tekan Ctrl+C untuk berhenti                               ║"
echo "║                                                                  ║"
echo -e "╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Cek apakah sudah git repo
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}[INIT] Belum ada git repo, melakukan inisialisasi...${NC}"
    git init
    git remote add origin https://github.com/Babinsa05/gabungtxt.git
    git branch -M main
    echo -e "${GREEN}[INIT] Selesai! Repository siap${NC}"
fi

# Set git config jika belum
echo -e "${CYAN}[CONFIG] Mengecek konfigurasi Git...${NC}"
if [ -z "$(git config user.name)" ]; then
    git config user.name "Babinsa05"
    echo -e "${GREEN}   ✅ Nama user diatur: Babinsa05${NC}"
fi
if [ -z "$(git config user.email)" ]; then
    git config user.email "babinsa05@users.noreply.github.com"
    echo -e "${GREEN}   ✅ Email diatur: babinsa05@users.noreply.github.com${NC}"
fi

echo ""
echo -e "${GREEN}[INFO] Git Auto Sync dimulai...${NC}"
echo -e "${GREEN}[INFO] Memonitor folder: $(pwd)${NC}"
echo -e "${GREEN}[INFO] Interval pengecekan: 5 detik${NC}"
echo ""

LAST_COMMIT=""
while true; do
    # Ambil status terbaru
    git fetch origin >/dev/null 2>&1
    
    # Cek perubahan di working directory
    if ! git diff --quiet HEAD || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
        NOW=$(date '+%Y-%m-%d %H:%M:%S')
        echo -e "${YELLOW}[$NOW] 🔄 Mendeteksi perubahan file...${NC}"
        
        # Add semua perubahan
        git add .
        
        # Lihat file apa saja yang berubah
        CHANGED_FILES=$(git status --porcelain | wc -l)
        echo -e "${CYAN}   📄 $CHANGED_FILES file berubah${NC}"
        
        # Commit dengan pesan yang informatif
        git commit -m "Auto sync: Update $CHANGED_FILES file - $NOW"
        
        # Push ke GitHub
        echo -e "${CYAN}   📤 Mengirim ke GitHub...${NC}"
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[$NOW] ✅ Sync sukses! Terkirim ke GitHub${NC}"
            echo ""
        else
            echo -e "${RED}[$NOW] ❌ Gagal push! Cek koneksi internet${NC}"
            echo ""
        fi
    fi
    
    # Tunggu 5 detik
    sleep 5
done