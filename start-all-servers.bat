@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM HD App - Alle Server Start Skript
REM Batch Version

echo 🚀 HD App - Alle Server werden gestartet...
echo ================================================

REM Prüfe und erstelle .env Dateien
echo 🔧 Prüfe Konfigurationsdateien...

REM Backend .env
if not exist "backend\.env" (
    echo 📝 Erstelle backend\.env aus Template...
    if exist "backend\env-template.txt" (
        copy "backend\env-template.txt" "backend\.env" >nul
        echo ✅ backend\.env erstellt
    ) else (
        echo ⚠️  Template backend\env-template.txt nicht gefunden
    )
) else (
    echo ✅ backend\.env bereits vorhanden
)

REM Frontend .env
if not exist "frontend\.env" (
    echo 📝 Erstelle frontend\.env aus Template...
    if exist "frontend\env-template.txt" (
        copy "frontend\env-template.txt" "frontend\.env" >nul
        echo ✅ frontend\.env erstellt
    ) else (
        echo ⚠️  Template frontend\env-template.txt nicht gefunden
    )
) else (
    echo ✅ frontend\.env bereits vorhanden
)

REM Prüfe ob Docker verfügbar ist
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker ist nicht gestartet. Bitte starten Sie Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker ist verfügbar

REM Stoppe bestehende Container
echo 🛑 Stoppe bestehende Container...
docker-compose down >nul 2>&1
docker-compose -f docker-compose-monitoring.yml down >nul 2>&1

REM Starte Monitoring Stack
echo 📊 Starte Monitoring Stack...
docker-compose -f docker-compose-monitoring.yml up -d

REM Warte auf Monitoring Services
timeout /t 5 /nobreak >nul

REM Starte Hauptanwendung
echo 🏗️  Starte HD App Stack...
docker-compose up -d

REM Warte auf Services
echo ⏳ Warte auf Services...
timeout /t 10 /nobreak >nul

REM Überprüfe Services
echo 📋 Überprüfe Services...

REM Funktion zum Testen eines Ports
:testPort
set "serviceName=%~1"
set "port=%~2"
set "timeout=%~3"

echo ⏳ Warte auf %serviceName% (Port %port%)...

for /l %%i in (1,1,%timeout%) do (
    netstat -an | find ":%port% " | find "LISTENING" >nul
    if !errorlevel! equ 0 (
        echo ✅ %serviceName% ist bereit!
        goto :eof
    )
    timeout /t 2 /nobreak >nul
)

echo ❌ Timeout: %serviceName% ist nicht verfügbar
set "allServicesReady=false"
goto :eof

REM Teste alle Services
set "allServicesReady=true"
call :testPort "MongoDB" "27017" "15"
call :testPort "Backend" "4001" "15"
call :testPort "Frontend" "3000" "15"
call :testPort "Prometheus" "9090" "15"
call :testPort "Grafana" "3001" "15"
call :testPort "Alertmanager" "9093" "15"
call :testPort "Node Exporter" "9100" "15"

REM Zeige Status
echo.
echo 📋 Service Status:
echo ==================

docker-compose ps
docker-compose -f docker-compose-monitoring.yml ps

echo.
echo 🌐 Verfügbare URLs:
echo ===================
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:4001
echo Grafana:      http://localhost:3001 (admin/admin)
echo Prometheus:   http://localhost:9090
echo Alertmanager: http://localhost:9093

if "%allServicesReady%"=="true" (
    echo.
    echo 🎉 Alle Server sind erfolgreich gestartet!
    echo Öffnen Sie http://localhost:3000 in Ihrem Browser.
) else (
    echo.
    echo ⚠️  Einige Services konnten nicht gestartet werden.
    echo Überprüfen Sie die Docker-Logs mit: docker-compose logs
)

echo.
echo 💡 Nützliche Befehle:
echo =====================
echo Logs anzeigen:     docker-compose logs -f
echo Services stoppen:  docker-compose down
echo Monitoring stoppen: docker-compose -f docker-compose-monitoring.yml down

pause
