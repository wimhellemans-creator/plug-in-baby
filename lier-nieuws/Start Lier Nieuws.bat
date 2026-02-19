@echo off
title Lier Nieuws
cd /d "%~dp0"

echo ========================================
echo   Lier Nieuws wordt opgestart...
echo ========================================
echo.

:: Installeer eventueel ontbrekende pakketten
py -m pip install -r requirements.txt --quiet

:: Open de browser na 3 seconden
start "" cmd /c "timeout /t 3 /noarg >nul && start http://127.0.0.1:5000/"

:: Start de app
echo App draait op http://127.0.0.1:5000/
echo Sluit dit venster om de app te stoppen.
echo.
py app.py
