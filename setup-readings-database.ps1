# Setup-Skript für Readings-Datenbank

Write-Host "🔧 Setup: Readings Database" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Schritt 1: SQL-Schema in Supabase ausführen" -ForegroundColor Yellow
Write-Host ""
Write-Host "Bitte führe folgende Schritte aus:" -ForegroundColor White
Write-Host ""
Write-Host "1. Öffne dein Supabase Dashboard" -ForegroundColor Green
Write-Host "   https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Wähle dein Projekt aus" -ForegroundColor Green
Write-Host ""
Write-Host "3. Navigiere zu 'SQL Editor' im linken Menü" -ForegroundColor Green
Write-Host ""
Write-Host "4. Klicke auf 'New Query'" -ForegroundColor Green
Write-Host ""
Write-Host "5. Kopiere den Inhalt von 'supabase-readings-schema.sql'" -ForegroundColor Green
Write-Host ""
Write-Host "6. Füge ihn in den Editor ein und klicke 'Run'" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Schritt 2: Verifizierung" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nach dem Ausführen solltest du folgendes sehen:" -ForegroundColor White
Write-Host "  ✅ Tabelle 'readings' erstellt" -ForegroundColor Gray
Write-Host "  ✅ Indizes erstellt" -ForegroundColor Gray
Write-Host "  ✅ RLS-Policies aktiviert" -ForegroundColor Gray
Write-Host "  ✅ Trigger für updated_at erstellt" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Schritt 3: Teste die Reading-Creator-Seite" -ForegroundColor Yellow
Write-Host ""
Write-Host "Navigiere zu:" -ForegroundColor White
Write-Host "  http://localhost:3005/coach/readings/create" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ Setup abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Weitere Informationen findest du in:" -ForegroundColor White
Write-Host "  - READING-CREATOR-ANLEITUNG.md" -ForegroundColor Gray
Write-Host ""

# Optional: SQL-Datei anzeigen
$showSQL = Read-Host "Möchtest du den SQL-Code jetzt anzeigen? (j/n)"
if ($showSQL -eq "j" -or $showSQL -eq "J") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Get-Content "supabase-readings-schema.sql" | ForEach-Object {
        Write-Host $_ -ForegroundColor Gray
    }
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Drücke eine beliebige Taste zum Beenden..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

