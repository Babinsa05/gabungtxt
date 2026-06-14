@echo off
chcp 65001 >nul
title GIT STATUS CHECK
color 0F

set SCRIPT_DIR=D:\APLIKASI\HTML GIT\gabungtxt-main
cd /d "%SCRIPT_DIR%"

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                    📊 STATUS FOLDER vs GITHUB 📊                 ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo [1] 🔍 Status working directory:
echo ----------------------------------------
git status --short
if errorlevel 1 (
    echo    ❌ Bukan repository Git!
) else (
    if "%errorlevel%"=="0" echo    ✅ Clean (tidak ada perubahan)
)
echo.

echo [2] 📁 File yang sedang dimonitor:
echo ----------------------------------------
dir /b *.html *.css *.js *.json 2>nul
echo.

echo [3] 🌐 Remote repository:
echo ----------------------------------------
git remote -v
echo.

echo [4] 📜 Commit terakhir:
echo ----------------------------------------
git log -1 --oneline --format="%h - %s (%cd)"
echo.

echo [5] 🌿 Branch saat ini:
echo ----------------------------------------
git branch
echo.

echo [6] 📤 Status sync dengan GitHub:
echo ----------------------------------------
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>nul)
if "%LOCAL%"=="%REMOTE%" (
    echo    ✅ Sudah sync dengan GitHub
) else (
    echo    ⚠️ Belum sync! Perlu push atau pull
)
echo.

echo [7] 🕐 Auto Sync Service:
echo ----------------------------------------
schtasks /query /tn "GitAutoSync_Babinsa" >nul 2>&1
if errorlevel 1 (
    echo    ❌ Service tidak berjalan
) else (
    echo    ✅ Service berjalan
)
echo.

pause