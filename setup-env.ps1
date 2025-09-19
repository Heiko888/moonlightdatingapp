#!/usr/bin/env pwsh

# HD App - Environment Setup Skript
# Erstellt die benötigten .env Dateien aus Templates

Write-Host "🔧 HD App - Environment Setup" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan

# Funktion zum Erstellen von .env Dateien
function Create-EnvFile {
    param([string]$TemplatePath, [string]$EnvPath, [string]$ServiceName)
    
    Write-Host "📝 Prüfe $ServiceName..." -ForegroundColor Yellow
    
    if (-not (Test-Path $EnvPath)) {
        if (Test-Path $TemplatePath) {
            Copy-Item $TemplatePath $EnvPath
            Write-Host "✅ $ServiceName .env erstellt: $EnvPath" -ForegroundColor Green
        } else {
            Write-Host "❌ Template nicht gefunden: $TemplatePath" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "✅ $ServiceName .env bereits vorhanden: $EnvPath" -ForegroundColor Green
    }
    return $true
}

# Erstelle .env Dateien
$success = $true

$success = $success -and (Create-EnvFile -TemplatePath "backend/env-template.txt" -EnvPath "backend/.env" -ServiceName "Backend")
$success = $success -and (Create-EnvFile -TemplatePath "frontend/env-template.txt" -EnvPath "frontend/.env" -ServiceName "Frontend")

Write-Host ""
if ($success) {
    Write-Host "🎉 Environment Setup abgeschlossen!" -ForegroundColor Green
    Write-Host "Sie können jetzt die Server starten mit:" -ForegroundColor Cyan
    Write-Host "  .\start-all-servers.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  Einige .env Dateien konnten nicht erstellt werden." -ForegroundColor Yellow
    Write-Host "Bitte überprüfen Sie die Template-Dateien." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Hinweis: Die .env Dateien enthalten Standardwerte." -ForegroundColor Magenta
Write-Host "Für die Produktion sollten Sie die Werte anpassen." -ForegroundColor Magenta
