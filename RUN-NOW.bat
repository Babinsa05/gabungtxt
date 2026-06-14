@echo off
chcp 65001 >nul
title GIT AUTO SYNC - RUNNING
color 0A

set SCRIPT_DIR=D:\APLIKASI\HTML GIT\gabungtxt-main
set GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe

:: Cek Git Bash
if not exist "%GIT_BASH_PATH%" (
    echo ❌ Git Bash tidak ditemukan!
    echo.
    set /p GIT_BASH_PATH="Masukkan path ke bash.exe: "
)

echo.
echo 🚀 Menjalankan Git Auto Sync...
echo 📁 Folder: %SCRIPT_DIR%
echo 💡 Jendela ini akan tetap terbuka selama sync berjalan
echo 💡 Tekan Ctrl+C atau tutup jendela untuk berhenti
echo.
echo ================================================
echo.

"%GIT_BASH_PATH%" --login -c "cd \"%SCRIPT_DIR%\" && bash AUTO-SYNC.sh"

pause