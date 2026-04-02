@echo off
cd /d "%~dp0"
echo.
echo   ====================================
echo   HLN Nieuwsmonitor
echo   ====================================
echo.

:: Check of Node.js geinstalleerd is
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   FOUT: Node.js is niet geinstalleerd.
    echo   Download het op: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Installeer dependencies als dat nog niet gebeurd is
if not exist "node_modules" (
    echo   Dependencies installeren...
    npm install
    echo.
)

echo   Server starten op http://localhost:3000
echo   Druk Ctrl+C om te stoppen.
echo.

:: Open browser automatisch na 2 seconden
start "" /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

npm start

:: Als de server stopt of crasht, blijft het venster open
echo.
echo   Server is gestopt.
pause
