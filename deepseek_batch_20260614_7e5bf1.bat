@echo off
chcp 65001 >nul
title INSTALL GIT WITH CHCOLATEY
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║     🔧 INSTALL GIT DENG CHCOLATEY 🔧                             ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

:: Cek Chcolatey
echo [1/3] Mengecek Chcolatey...
choco --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Chcolatey tidak terinstall
    echo    📌 Install Chcolatey dulu dengan:
    echo       Jalankan PowerShell sebagai Administrator:
    echo       Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    pause
    exit /b
)
echo    ✅ Chcolatey tersedia

:: Install Git
echo [2/3] Menginstall Git...
choco install git -y

echo [3/3] Verifikasi...
git --version

echo.
echo ✅ Git berhasil diinstall!
pause