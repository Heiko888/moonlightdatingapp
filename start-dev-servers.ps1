#!/usr/bin/env pwsh

# HD App - Entwicklungsserver Start Skript
# Startet Backend und Frontend ohne Docker

Write-Host "🚀 HD App - Entwicklungsserver werden gestartet..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# Funktion zum Überprüfen, ob Node.js verfügbar ist
function Test-NodeAvailable {
    try {
        node --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Funktion zum Überprüfen, ob ein Port verfügbar ist
function Test-PortAvailable {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $false
    }
    catch {
        return $true
    }
}

# Prüfe Node.js
if (-not (Test-NodeAvailable)) {
    Write-Host "❌ Node.js ist nicht installiert oder nicht verfügbar." -ForegroundColor Red
    Write-Host "Bitte installieren Sie Node.js von https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js ist verfügbar" -ForegroundColor Green

# Prüfe ob MongoDB läuft (für Backend)
Write-Host "🔍 Prüfe MongoDB..." -ForegroundColor Yellow
if (Test-PortAvailable -Port 27017) {
    Write-Host "⚠️  MongoDB läuft nicht auf Port 27017" -ForegroundColor Yellow
    Write-Host "Bitte starten Sie MongoDB oder verwenden Sie Docker:" -ForegroundColor Yellow
    Write-Host "docker run -d -p 27017:27017 --name mongodb mongo:7.0" -ForegroundColor Cyan
    $useMongo = Read-Host "Möchten Sie fortfahren? (j/n)"
    if ($useMongo -ne "j" -and $useMongo -ne "J") {
        exit 1
    }
} else {
    Write-Host "✅ MongoDB ist verfügbar" -ForegroundColor Green
}

# Prüfe Dependencies
Write-Host "📦 Prüfe Dependencies..." -ForegroundColor Yellow

# Backend Dependencies
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installiere Backend Dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

# Frontend Dependencies
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installiere Frontend Dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
}

# Starte Backend im Hintergrund
Write-Host "🔧 Starte Backend (Port 4001)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm run dev
}

# Warte kurz
Start-Sleep -Seconds 3

# Starte Frontend im Hintergrund
Write-Host "🎨 Starte Frontend (Port 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    npm run dev
}

# Warte auf Services
Write-Host "⏳ Warte auf Services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Überprüfe Services
$backendReady = $false
$frontendReady = $false

for ($i = 0; $i -lt 30; $i++) {
    if (-not $backendReady -and -not (Test-PortAvailable -Port 4001)) {
        Write-Host "✅ Backend ist bereit!" -ForegroundColor Green
        $backendReady = $true
    }
    
    if (-not $frontendReady -and -not (Test-PortAvailable -Port 3000)) {
        Write-Host "✅ Frontend ist bereit!" -ForegroundColor Green
        $frontendReady = $true
    }
    
    if ($backendReady -and $frontendReady) {
        break
    }
    
    Start-Sleep -Seconds 2
}

# Zeige Status
Write-Host ""
Write-Host "📋 Service Status:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

if ($backendReady) {
    Write-Host "✅ Backend:  http://localhost:4001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend:  Nicht verfügbar" -ForegroundColor Red
}

if ($frontendReady) {
    Write-Host "✅ Frontend: http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: Nicht verfügbar" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Verfügbare URLs:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:4001" -ForegroundColor White

if ($backendReady -and $frontendReady) {
    Write-Host ""
    Write-Host "🎉 Alle Entwicklungsserver sind erfolgreich gestartet!" -ForegroundColor Green
    Write-Host "Öffnen Sie http://localhost:3000 in Ihrem Browser." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Einige Services konnten nicht gestartet werden." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Nützliche Befehle:" -ForegroundColor Magenta
Write-Host "=====================" -ForegroundColor Magenta
Write-Host "Backend Logs:   Receive-Job $backendJob" -ForegroundColor White
Write-Host "Frontend Logs:  Receive-Job $frontendJob" -ForegroundColor White
Write-Host "Services stoppen: Stop-Job $backendJob, $frontendJob" -ForegroundColor White

Write-Host ""
Write-Host "Drücken Sie Strg+C zum Beenden..." -ForegroundColor Yellow

# Warte auf Benutzer-Interruption
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stoppe Services..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Services gestoppt" -ForegroundColor Green
}
