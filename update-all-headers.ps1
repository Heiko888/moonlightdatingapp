# Script zum automatischen Aktualisieren aller Header
Write-Host "🔄 HEADER-UPDATE SCRIPT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan

$files = @(
    "frontend/app/mondkalender/page.tsx",
    "frontend/app/register/page.tsx",
    "frontend/app/community-info/page.tsx",
    "frontend/app/community/page.tsx",
    "frontend/app/friends/page.tsx",
    "frontend/app/swipe/page.tsx",
    "frontend/app/match/page.tsx",
    "frontend/app/chart-info/page.tsx",
    "frontend/app/seitenuebersicht/page.tsx",
    "frontend/app/grundlagen-hd/page.tsx",
    "frontend/app/sales/page.tsx",
    "frontend/app/mondkalender-info/page.tsx",
    "frontend/app/mondphasen-info/page.tsx",
    "frontend/app/human-design-chart/page.tsx",
    "frontend/app/mobile-app/page.tsx",
    "frontend/app/mobile-demo/page.tsx",
    "frontend/app/sitemap/page.tsx",
    "frontend/app/dating/page.tsx",
    "frontend/app/landing/page.tsx"
)

$updated = 0
$skipped = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Prüfe ob die Datei den alten Header hat
        if ($content -match '🔑 The Connection Key' -and $content -match 'py: 2') {
            Write-Host "  ✓ $file wird aktualisiert..." -ForegroundColor Yellow
            
            # Füge Image Import hinzu, falls nicht vorhanden
            if ($content -notmatch 'import Image from') {
                $content = $content -replace 'import Link from ''next/link'';', "import Link from 'next/link';`nimport Image from 'next/image';"
                $content = $content -replace 'import Link from "next/link";', "import Link from `"next/link`";`nimport Image from `"next/image`";"
            }
            
            # Ersetze background
            $content = $content -replace "background: 'rgba\(15, 15, 35, 0\.95\)'", "background: '#000000'"
            $content = $content -replace 'background: "rgba\(15, 15, 35, 0\.95\)"', 'background: "#000000"'
            $content = $content -replace "background: 'rgba\(15, 15, 35, 0\.8\)'", "background: '#000000'"
            $content = $content -replace 'background: "rgba\(15, 15, 35, 0\.8\)"', 'background: "#000000"'
            
            # Ersetze py: 2 mit py: 1
            $content = $content -replace 'py: 2([^0-9])', 'py: 1$1'
            
            # Speichere Datei
            Set-Content -Path $file -Value $content -NoNewline
            $updated++
        } else {
            Write-Host "  ⊝ $file übersprungen (bereits aktualisiert)" -ForegroundColor Gray
            $skipped++
        }
    } else {
        Write-Host "  ✗ $file nicht gefunden" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ $updated Dateien aktualisiert" -ForegroundColor Green
Write-Host "⊝ $skipped Dateien übersprungen" -ForegroundColor Gray
Write-Host ""
Write-Host "Hinweis: Die Logo-Integration muss manuell erfolgen!" -ForegroundColor Yellow
Write-Host "Das Script hat nur background und padding aktualisiert." -ForegroundColor Yellow

