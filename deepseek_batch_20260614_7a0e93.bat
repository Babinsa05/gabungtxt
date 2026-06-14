@echo off
chcp 65001 >nul
title INSTALL GIT FOR WINDOWS - CMD
color 0A
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🔧 INSTALL GIT FOR WINDOWS - VIA CMD 🔧                      ║
echo ║                                                                  ║
echo ║     Menginstall Git menggunakan winget (Windows Package Manager)║
echo ║     Tidak perlu download manual dari website!                   ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

:: Cek apakah winget tersedia
echo [1/6] Mengecek winget (Windows Package Manager)...
winget --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ winget tidak tersedia!
    echo.
    echo    📌 Windows 10/11 seharusnya sudah memiliki winget.
    echo    📌 Jika tidak ada, silakan download manual dari:
    echo       https://git-scm.com/download/win
    echo.
    echo    🔄 Mencoba metode alternatif...
    goto :alternatif
)
echo    ✅ winget tersedia (versi: 
winget --version
echo)

:: Cek apakah Git sudah terinstall
echo [2/6] Mengecek apakah Git sudah terinstall...
git --version >nul 2>&1
if not errorlevel 1 (
    echo    ⚠️ Git sudah terinstall!
    git --version
    echo.
    choice /C YN /M "Apakah ingin reinstall/upgrade Git"
    if errorlevel 2 goto :selesai
)
echo    ✅ Proses install akan dimulai

:: Install Git via winget
echo.
echo [3/6] Menginstall Git via winget...
echo    📥 Mengunduh dan menginstall Git.Git...
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements

if errorlevel 1 (
    echo    ❌ Install gagal!
    goto :alternatif
)
echo    ✅ Install selesai

:: Refresh environment variable
echo.
echo [4/6] Menyegarkan environment variable...
refreshenv >nul 2>&1
if errorlevel 1 (
    echo    ⚠️ refreshenv tidak tersedia, mencoba metode lain...
    call "%ProgramFiles%\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat" >nul 2>&1
)

:: Cek ulang instalasi
echo.
echo [5/6] Memverifikasi instalasi Git...
timeout /t 2 /nobreak >nul

:: Cek dengan path lengkap
set GIT_PATH=C:\Program Files\Git\bin\git.exe
if exist "%GIT_PATH%" (
    echo    ✅ Git berhasil terinstall!
    "%GIT_PATH%" --version
    set GIT_INSTALLED=1
) else (
    set GIT_PATH2=D:\Program Files\Git\bin\git.exe
    if exist "%GIT_PATH2%" (
        echo    ✅ Git berhasil terinstall di D:!
        "%GIT_PATH2%" --version
        set GIT_INSTALLED=1
    ) else (
        echo    ❌ Verifikasi gagal, coba restart CMD setelah install
        set GIT_INSTALLED=0
    )
)

:: Konfigurasi awal Git
if "%GIT_INSTALLED%"=="1" (
    echo.
    echo [6/6] Melakukan konfigurasi awal Git...
    
    :: Set user.name jika belum
    git config --global user.name >nul 2>&1
    if errorlevel 1 (
        set /p USER_NAME="   Masukkan nama GitHub Anda (contoh: Babinsa05): "
        if "!USER_NAME!"=="" set USER_NAME=Babinsa05
        git config --global user.name "!USER_NAME!"
        echo    ✅ Nama user diatur: !USER_NAME!
    ) else (
        echo    ✅ Nama user sudah ada: 
        git config --global user.name
    )
    
    :: Set user.email jika belum
    git config --global user.email >nul 2>&1
    if errorlevel 1 (
        set /p USER_EMAIL="   Masukkan email GitHub Anda: "
        if "!USER_EMAIL!"=="" set USER_EMAIL=babinsa05@users.noreply.github.com
        git config --global user.email "!USER_EMAIL!"
        echo    ✅ Email diatur: !USER_EMAIL!
    ) else (
        echo    ✅ Email sudah ada: 
        git config --global user.email
    )
    
    :: Set default branch name
    git config --global init.defaultBranch main
    echo    ✅ Default branch: main
    
    :: Set credential helper (agar tidak perlu login setiap push)
    git config --global credential.helper manager-core
    echo    ✅ Credential helper: manager-core
)

:: SELESAI
:selesai
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
if "%GIT_INSTALLED%"=="1" (
    echo ║     ✅ GIT BERHASIL DIINSTALL! ✅                               ║
) else (
    echo ║     ⚠️ INSTALL GAGAL - SILAKAN DOWNLOAD MANUAL ⚠️              ║
)
echo ║                                                                  ║
echo ║     🌐 Download manual: https://git-scm.com/download/win        ║
echo ║                                                                  ║
echo ║     📌 Setelah install, RESTART CMD atau komputer Anda          ║
echo ║     📌 Kemudian jalankan script auto sync di folder proyek      ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

:: Tawarkan buka Git Bash
if "%GIT_INSTALLED%"=="1" (
    choice /C YN /M "Apakah ingin membuka Git Bash sekarang"
    if not errorlevel 2 (
        start "" "C:\Program Files\Git\git-bash.exe"
    )
)

pause
exit /b

:alternatif
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🔄 METODE ALTERNATIF - DOWNLOAD MANUAL 🔄                    ║
echo ║                                                                  ║
echo ║     winget tidak tersedia, akan membuka browser untuk download  ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Membuka halaman download Git...
start https://git-scm.com/download/win

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     📌 PANDUAN INSTALL MANUAL:                                   ║
echo ║                                                                  ║
echo ║     1. Download file .exe (64-bit)                              ║
echo ║     2. Jalankan file .exe tersebut                              ║
echo ║     3. Gunakan pengaturan default (next-next-finish)            ║
echo ║     4. Centang "Git Bash Here" dan "Git GUI Here"               ║
echo ║     5. Pilih "Use Git from Git Bash only" (opsional)            ║
echo ║     6. Selesai, restart CMD ini                                 ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
pause