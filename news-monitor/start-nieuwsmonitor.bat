@echo off
cd /d "%~dp0"
echo.
echo   ====================================
echo   HLN Nieuwsmonitor
echo   ====================================
echo.

:: Check of Python geinstalleerd is
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo   FOUT: Python is niet geinstalleerd.
    echo   Download het op: https://python.org
    echo.
    pause
    exit /b 1
)

python server.py

:: Als de server stopt of crasht, blijft het venster open
echo.
echo   Server is gestopt.
pause
