# 🚀 MOONLIGHT App - All-Inkl Deployment Script

Write-Host "🌙 MOONLIGHT App - All-Inkl Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Frontend Build für statisches Hosting
Write-Host "📦 Building Frontend für statisches Hosting..." -ForegroundColor Yellow
cd frontend
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend Build erfolgreich!" -ForegroundColor Green

# 2. Prüfen ob out Ordner existiert
if (Test-Path "out") {
    Write-Host "📁 Statische Dateien gefunden in 'out' Ordner" -ForegroundColor Green
    
    # 3. Dateien für Upload vorbereiten
    Write-Host "📋 Deployment-Dateien vorbereiten..." -ForegroundColor Yellow
    
    # Erstelle Deployment-Info
    $deploymentInfo = @"
# 🌙 MOONLIGHT App - All-Inkl Deployment

## 📁 Upload-Anweisungen

1. **Upload des 'out' Ordners** zu All-Inkl
2. **Domain konfigurieren** (z.B. moonlight.yourdomain.com)
3. **SSL aktivieren** (automatisch verfügbar)

## 🔧 Supabase-Konfiguration

Stellen Sie sicher, dass folgende Umgebungsvariablen in Supabase gesetzt sind:

- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
- NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1

## 📊 Features

✅ Statisches Hosting (keine Server erforderlich)
✅ Supabase-Datenbank (Cloud-basiert)
✅ Real-time Features
✅ Automatische Skalierung
✅ SSL-Sicherheit

## 🚀 Vorteile

- **Günstig**: Nur statische Dateien
- **Schnell**: CDN-Optimierung
- **Sicher**: SSL + Supabase Security
- **Skalierbar**: Automatische Lastverteilung

Deployment erstellt am: $(Get-Date)
"@
    
    $deploymentInfo | Out-File -FilePath "DEPLOYMENT-INFO.md" -Encoding UTF8
    
    Write-Host "✅ Deployment-Info erstellt: DEPLOYMENT-INFO.md" -ForegroundColor Green
    Write-Host "📁 Upload-Ordner: frontend/out" -ForegroundColor Cyan
    Write-Host "📋 Anleitung: frontend/DEPLOYMENT-INFO.md" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ 'out' Ordner nicht gefunden!" -ForegroundColor Red
    Write-Host "💡 Führen Sie 'npm run build' im frontend Ordner aus" -ForegroundColor Yellow
}

cd ..

Write-Host "🎉 Deployment-Vorbereitung abgeschlossen!" -ForegroundColor Green
Write-Host "📤 Laden Sie den 'frontend/out' Ordner zu All-Inkl hoch" -ForegroundColor Cyan
