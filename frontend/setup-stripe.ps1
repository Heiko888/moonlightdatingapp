# HD App - Stripe Setup Script
# Führt das komplette Stripe-Setup durch

Write-Host "🚀 HD App - Stripe Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# 1. Environment Template kopieren
Write-Host "`n📋 Schritt 1: Environment Variables vorbereiten..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local existiert bereits. Backup erstellen..." -ForegroundColor Yellow
    Copy-Item ".env.local" ".env.local.backup"
}
Copy-Item "env.local.template" ".env.local"
Write-Host "✅ .env.local erstellt" -ForegroundColor Green

# 2. Stripe CLI prüfen
Write-Host "`n🔧 Schritt 2: Stripe CLI prüfen..." -ForegroundColor Yellow
try {
    $stripeVersion = stripe --version 2>$null
    if ($stripeVersion) {
        Write-Host "✅ Stripe CLI installiert: $stripeVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Stripe CLI nicht gefunden" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Stripe CLI nicht installiert" -ForegroundColor Yellow
    Write-Host "   Installiere mit: npm install -g stripe-cli" -ForegroundColor Cyan
}

# 3. Dependencies prüfen
Write-Host "`n📦 Schritt 3: Dependencies prüfen..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json gefunden" -ForegroundColor Green
} else {
    Write-Host "❌ package.json nicht gefunden" -ForegroundColor Red
    exit 1
}

# 4. Setup-Anleitung anzeigen
Write-Host "`n📖 Nächste Schritte:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "1. 🔑 Stripe Account erstellen: https://stripe.com" -ForegroundColor White
Write-Host "2. 🔑 API Keys abrufen: Dashboard → Developers → API Keys" -ForegroundColor White
Write-Host "3. 🛍️  Produkte erstellen: Dashboard → Products → Create Product" -ForegroundColor White
Write-Host "4. 🔗 Webhook konfigurieren: Dashboard → Developers → Webhooks" -ForegroundColor White
Write-Host "5. 📝 .env.local ausfüllen mit echten Werten" -ForegroundColor White
Write-Host "6. 🚀 Server starten: npm run dev" -ForegroundColor White

Write-Host "`n📋 Stripe Produkte erstellen:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Basic Package: €9.99/Monat" -ForegroundColor White
Write-Host "Premium Package: €19.99/Monat" -ForegroundColor White  
Write-Host "VIP Package: €49.99/Monat" -ForegroundColor White

Write-Host "`n🧪 Test-Karten:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Erfolgreich: 4242 4242 4242 4242" -ForegroundColor Green
Write-Host "Fehlgeschlagen: 4000 0000 0000 0002" -ForegroundColor Red
Write-Host "3D Secure: 4000 0025 0000 3155" -ForegroundColor Yellow

Write-Host "`n🎉 Setup vorbereitet! Fülle .env.local aus und starte den Server." -ForegroundColor Green
