# ===========================================
# QUICK VERCEL DEPLOYMENT
# ===========================================

Write-Host "`n🚀 QUICK VERCEL DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Vercel CLI installieren (falls nicht vorhanden)
Write-Host "`n1. Prüfe Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "   Vercel CLI nicht gefunden. Installiere..." -ForegroundColor Yellow
    npm install -g vercel
} else {
    Write-Host "   ✅ Vercel CLI bereits installiert" -ForegroundColor Green
}

# 2. In Frontend-Verzeichnis wechseln
Write-Host "`n2. Wechsle zu Frontend..." -ForegroundColor Yellow
Set-Location -Path ".\frontend"

# 3. .env.production erstellen (falls nicht vorhanden)
if (-not (Test-Path ".env.production")) {
    Write-Host "`n3. Erstelle .env.production..." -ForegroundColor Yellow
    $envContent = @"
# E-Mail-Service (Optional - wird in Konsole geloggt wenn nicht gesetzt)
# EMAIL_API_KEY=your_resend_key_here
# EMAIL_FROM=noreply@yourdomain.com
# COACH_EMAIL=coach@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional: Datenbank
# DATABASE_URL=postgresql://...
"@
    $envContent | Out-File -FilePath ".env.production" -Encoding utf8
    Write-Host "   ✅ .env.production erstellt" -ForegroundColor Green
    Write-Host "   ⚠️  WICHTIG: Bitte bearbeite .env.production und füge deine Keys ein!" -ForegroundColor Yellow
} else {
    Write-Host "`n3. .env.production existiert bereits" -ForegroundColor Green
}

# 4. Vercel Login
Write-Host "`n4. Vercel Login..." -ForegroundColor Yellow
Write-Host "   Ein Browser-Fenster wird geöffnet. Bitte dort einloggen." -ForegroundColor White
vercel login

# 5. Deployment starten
Write-Host "`n5. Starte Deployment..." -ForegroundColor Yellow
Write-Host "   Wähle bei den Fragen:" -ForegroundColor White
Write-Host "   - Set up and deploy: YES" -ForegroundColor White
Write-Host "   - Which scope: Dein Account" -ForegroundColor White
Write-Host "   - Link to existing project: NO" -ForegroundColor White
Write-Host "   - Project name: hd-reading-system (oder eigener Name)" -ForegroundColor White
Write-Host "   - Directory: ./" -ForegroundColor White
Write-Host "   - Want to override settings: NO" -ForegroundColor White
Write-Host "" -ForegroundColor White

$deployChoice = Read-Host "Möchtest du jetzt deployen? (y/n)"

if ($deployChoice -eq "y" -or $deployChoice -eq "Y") {
    Write-Host "`n   📦 Deploying..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host "`n✅ DEPLOYMENT ABGESCHLOSSEN!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "`nNächste Schritte:" -ForegroundColor Cyan
    Write-Host "1. Gehe zu https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Wähle dein Projekt" -ForegroundColor White
    Write-Host "3. Settings → Environment Variables" -ForegroundColor White
    Write-Host "4. Füge deine E-Mail-Keys hinzu (optional)" -ForegroundColor White
    Write-Host "5. Redeploy wenn Keys hinzugefügt" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "`n⏸️  Deployment abgebrochen" -ForegroundColor Yellow
    Write-Host "   Führe manuell aus: vercel --prod" -ForegroundColor White
}

# 6. Zurück zum Root
Set-Location -Path ".."

Write-Host "`n📖 Weitere Infos: READING-SYSTEM-DEPLOYMENT.md" -ForegroundColor Cyan

