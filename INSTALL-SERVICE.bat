@echo off
chcp 65001 >nul
title INSTALL GIT AUTO SYNC - WINDOWS SERVICE
color 0E
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🔧 INSTALL GIT AUTO SYNC AS WINDOWS SERVICE 🔧               ║
echo ║                                                                  ║
echo ║     Script ini akan memasang auto sync agar berjalan di         ║
echo ║     background tanpa jendela, dan aktif saat Windows menyala    ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

:: === DETECT PATHS ===
set SCRIPT_DIR=D:\APLIKASI\HTML GIT\gabungtxt-main
set GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe

:: Cek Git Bash
if not exist "%GIT_BASH_PATH%" (
    echo ❌ Git Bash tidak ditemukan di: %GIT_BASH_PATH%
    echo.
    echo Silakan cari lokasi bash.exe Anda:
    echo Contoh: C:\Program Files\Git\bin\bash.exe
    echo Atau:   D:\Git\bin\bash.exe
    echo.
    set /p GIT_BASH_PATH="Masukkan path lengkap ke bash.exe: "
    if not exist "!GIT_BASH_PATH!" (
        echo ❗ Path tidak valid! Instalasi dibatalkan.
        pause
        exit /b 1
    )
)
echo ✅ Git Bash ditemukan: %GIT_BASH_PATH%

:: === BUAT VBS UNTUK RUN HIDDEN ===
set VBS_PATH=%TEMP%\run_hidden_git.vbs
(
echo Set WshShell = CreateObject("WScript.Shell")
echo WshShell.Run """%GIT_BASH_PATH%"" --login -c ""cd \"%SCRIPT_DIR%\" ^&^& bash AUTO-SYNC.sh""", 0, False
) > "%VBS_PATH%"

:: === BUAT SHORTCUT DI STARTUP ===
set STARTUP_LNK=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GitAutoSync.lnk
set VBS_SHORTCUT=%TEMP%\make_shortcut.vbs
(
echo Set WshShell = CreateObject("WScript.Shell")
echo Set shortcut = WshShell.CreateShortcut("%STARTUP_LNK%")
echo shortcut.TargetPath = "wscript.exe"
echo shortcut.Arguments = """%VBS_PATH%"""
echo shortcut.WorkingDirectory = "%SCRIPT_DIR%"
echo shortcut.WindowStyle = 7
echo shortcut.Description = "Git Auto Sync - TXT Combiner"
echo shortcut.Save
) > "%VBS_SHORTCUT%"
cscript //nologo "%VBS_SHORTCUT%"
del "%VBS_SHORTCUT%"

:: === TAMBAHKAN KE TASK SCHEDULER ===
set TASK_NAME=GitAutoSync_Babinsa
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
schtasks /create /tn "%TASK_NAME%" /tr "wscript.exe \"%VBS_PATH%\"" /sc onstart /ru "SYSTEM" /f >nul 2>&1

:: === FIRST RUN ===
echo [FIRST RUN] Menjalankan sync pertama kali...
start /min wscript.exe "%VBS_PATH%"

:: === SELESAI ===
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     ✅ INSTALLASI SELESAI! ✅                                    ║
echo ║                                                                  ║
echo ║     🔄 Auto Sync sekarang berjalan di BACKGROUND                 ║
echo ║     📌 Aktif saat Windows menyala (Startup)                      ║
echo ║     📌 Juga terdaftar di Task Scheduler                          ║
echo ║                                                                  ║
echo ║     📍 Startup: %STARTUP_LNK%                 ║
echo ║     📍 VBS:     %VBS_PATH%                                      ║
echo ║     📍 Task:    %TASK_NAME%                                     ║
echo ║                                                                  ║
echo ║     🌐 Website: https://babinsa05.github.io/gabungtxt/           ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo [INFO] Untuk menghentikan sync:
echo       1. Task Manager -> Services -> cari GitAutoSync_Babinsa
echo       2. Hapus file: %STARTUP_LNK%
echo       3. Jalankan STOP-SYNC.bat
echo.
pause