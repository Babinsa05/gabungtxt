@echo off
chcp 65001 >nul
title GIT TEST SYNC
color 0E

set SCRIPT_DIR=D:\APLIKASI\HTML GIT\gabungtxt-main
cd /d "%SCRIPT_DIR%"

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                    🧪 TEST GIT SYNC 🧪                          ║
echo ║                                                                  ║
echo ║     Melakukan commit dan push SEKALI SAJA                        ║
echo ║     (bukan auto sync berkelanjutan)                             ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Menambahkan semua file...
git add .
echo    ✅ Selesai

echo [2/4] Membuat commit...
set NOW=%date% %time%
git commit -m "Manual test sync - %NOW%"
echo    ✅ Selesai

echo [3/4] Push ke GitHub...
git push origin main
echo    ✅ Selesai

echo [4/4] Cek status...
git status --short

echo.
echo ✅ Test sync selesai!
echo 🌐 https://babinsa05.github.io/gabungtxt/
echo.
pause