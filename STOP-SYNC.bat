@echo off
chcp 65001 >nul
title STOP GIT AUTO SYNC
color 0C

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🛑 MENGHENTIKAN GIT AUTO SYNC 🛑                             ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

set TASK_NAME=GitAutoSync_Babinsa
set STARTUP_LNK=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GitAutoSync.lnk
set VBS_PATH=%TEMP%\run_hidden_git.vbs

echo [1/4] Menghentikan task di Task Scheduler...
schtasks /end /tn "%TASK_NAME%" >nul 2>&1
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
echo    ✅ Task dihentikan

echo [2/4] Menghapus shortcut startup...
if exist "%STARTUP_LNK%" (
    del "%STARTUP_LNK%"
    echo    ✅ Shortcut startup dihapus
)

echo [3/4] Menghapus VBS runner...
if exist "%VBS_PATH%" (
    del "%VBS_PATH%"
    echo    ✅ VBS runner dihapus
)

echo [4/4] Mematikan proses Git yang berjalan...
taskkill /f /im bash.exe >nul 2>&1
taskkill /f /im git.exe >nul 2>&1

echo.
echo ✅ Auto Sync telah dihentikan sepenuhnya!
echo.
pause