@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM HD App - Environment Setup Skript
REM Erstellt die benötigten .env Dateien aus Templates

echo 🔧 HD App - Environment Setup
echo =============================

set "success=true"

REM Backend .env
echo 📝 Prüfe Backend...
if not exist "backend\.env" (
    if exist "backend\env-template.txt" (
        copy "backend\env-template.txt" "backend\.env" >nul
        echo ✅ Backend .env erstellt: backend\.env
    ) else (
        echo ❌ Template nicht gefunden: backend\env-template.txt
        set "success=false"
    )
) else (
    echo ✅ Backend .env bereits vorhanden: backend\.env
)

REM Frontend .env
echo 📝 Prüfe Frontend...
if not exist "frontend\.env" (
    if exist "frontend\env-template.txt" (
        copy "frontend\env-template.txt" "frontend\.env" >nul
        echo ✅ Frontend .env erstellt: frontend\.env
    ) else (
        echo ❌ Template nicht gefunden: frontend\env-template.txt
        set "success=false"
    )
) else (
    echo ✅ Frontend .env bereits vorhanden: frontend\.env
)

echo.
if "%success%"=="true" (
    echo 🎉 Environment Setup abgeschlossen!
    echo Sie können jetzt die Server starten mit:
    echo   start-all-servers.bat
) else (
    echo ⚠️  Einige .env Dateien konnten nicht erstellt werden.
    echo Bitte überprüfen Sie die Template-Dateien.
)

echo.
echo 💡 Hinweis: Die .env Dateien enthalten Standardwerte.
echo Für die Produktion sollten Sie die Werte anpassen.

pause
