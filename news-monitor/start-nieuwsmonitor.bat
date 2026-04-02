@echo off
cd /d "%~dp0"
echo.
echo   ====================================
echo   HLN Nieuwsmonitor
echo   ====================================
echo.

:: Probeer eerst 'py' (Windows Python Launcher), dan 'python'
where py >nul 2>nul
if %errorlevel% equ 0 (
    py server.py
    goto :done
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    python server.py
    goto :done
)

where python3 >nul 2>nul
if %errorlevel% equ 0 (
    python3 server.py
    goto :done
)

echo   FOUT: Python is niet gevonden.
echo   Python staat wel op je pc? Probeer dan:
echo     py server.py
echo   of:
echo     python server.py
echo   handmatig in een command prompt in deze map.

:done
echo.
echo   Server is gestopt.
pause
