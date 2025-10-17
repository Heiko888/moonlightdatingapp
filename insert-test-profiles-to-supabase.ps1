# PowerShell Script zum Einfügen von Test-Profilen in Supabase
# Führe dieses Script aus, um 6 Test-Profile in die matching_profiles Tabelle einzufügen

Write-Host "🚀 Starte Einfügen von Test-Profilen in Supabase..." -ForegroundColor Cyan
Write-Host ""

# Prüfe ob .env.local existiert
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "❌ Fehler: frontend\.env.local nicht gefunden!" -ForegroundColor Red
    Write-Host "Bitte erstelle die Datei mit NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Yellow
    exit 1
}

# Lade Umgebungsvariablen
$envContent = Get-Content "frontend\.env.local"
$supabaseUrl = ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })
$supabaseKey = ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Fehler: Supabase Credentials nicht gefunden!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Supabase URL gefunden: $supabaseUrl" -ForegroundColor Green

# Test-Profile als JSON
$profiles = @(
    @{
        name = "Sarah"
        age = 28
        location = "Berlin"
        bio = "Leidenschaftliche Generatorin, die ihre sakrale Energie nutzt, um andere zu inspirieren. Liebt Yoga, Meditation und tiefe Gespräche über das Leben."
        hd_type = "Generator"
        profile = "2/4"
        authority = "Sakral"
        strategy = "Auf andere reagieren"
        interests = @("Yoga", "Meditation", "Natur", "Musik", "Reisen", "Heilung")
        images = @("https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400")
        avatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
    },
    @{
        name = "Marcus"
        age = 32
        location = "München"
        bio = "Erfahrener Projector, der anderen hilft, ihre wahre Bestimmung zu finden. Spezialisiert auf Human Design Beratung und spirituelle Führung."
        hd_type = "Projector"
        profile = "3/5"
        authority = "Splenic"
        strategy = "Warten auf Einladung"
        interests = @("Human Design", "Spiritualität", "Mentoring", "Philosophie", "Bücher", "Kaffee")
        images = @("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400")
        avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    @{
        name = "Luna"
        age = 26
        location = "Hamburg"
        bio = "Kreative Manifestorin, die ihre Visionen in die Welt bringt. Künstlerin, Autorin und spirituelle Lehrerin mit einer besonderen Verbindung zum Mond."
        hd_type = "Manifestor"
        profile = "1/3"
        authority = "Splenic"
        strategy = "Informieren"
        interests = @("Kunst", "Schreiben", "Astrologie", "Mondzyklen", "Kreativität", "Heilung")
        images = @("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400")
        avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    @{
        name = "David"
        age = 35
        location = "Köln"
        bio = "Weiser Reflector, der die Energie seiner Umgebung widerspiegelt. Mentor und spiritueller Führer mit tiefem Verständnis für energetische Verbindungen."
        hd_type = "Reflector"
        profile = "6/2"
        authority = "Lunar"
        strategy = "Warten auf Mondzyklus"
        interests = @("Spiritualität", "Mentoring", "Heilung", "Natur", "Musik", "Philosophie")
        images = @("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400")
        avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    @{
        name = "Emma"
        age = 29
        location = "Frankfurt"
        bio = "Energische Generatorin mit einem starken sakralen Zentrum. Liebt es, andere zu unterstützen und positive Energie zu verbreiten."
        hd_type = "Generator"
        profile = "4/6"
        authority = "Sakral"
        strategy = "Auf andere reagieren"
        interests = @("Fitness", "Gesunde Ernährung", "Natur", "Tiere", "Reisen", "Lernen")
        images = @("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400")
        avatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    @{
        name = "Alex"
        age = 31
        location = "Stuttgart"
        bio = "Intelligenter Projector mit einem tiefen Verständnis für Human Design. Hilft anderen dabei, ihre einzigartigen Gaben zu entdecken."
        hd_type = "Projector"
        profile = "2/4"
        authority = "Splenic"
        strategy = "Warten auf Einladung"
        interests = @("Human Design", "Psychologie", "Coaching", "Bücher", "Kaffee", "Gespräche")
        images = @("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400")
        avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    }
)

Write-Host "📝 Füge $($profiles.Count) Test-Profile ein..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($profile in $profiles) {
    try {
        # Generiere UUID für user_id
        $userId = [guid]::NewGuid().ToString()
        
        # Erstelle Body für API-Request
        $body = @{
            user_id = $userId
            name = $profile.name
            age = $profile.age
            location = $profile.location
            bio = $profile.bio
            hd_type = $profile.hd_type
            profile = $profile.profile
            authority = $profile.authority
            strategy = $profile.strategy
            interests = $profile.interests
            images = $profile.images
            avatar = $profile.avatar
        } | ConvertTo-Json

        # API-Request an localhost:3005
        $response = Invoke-RestMethod -Uri "http://localhost:3005/api/matches" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body

        if ($response.success) {
            Write-Host "✅ $($profile.name) ($($profile.hd_type)) erfolgreich eingefügt" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "⚠️  $($profile.name) konnte nicht eingefügt werden" -ForegroundColor Yellow
            $errorCount++
        }
    }
    catch {
        Write-Host "❌ Fehler bei $($profile.name): $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Erfolgreich eingefügt: $successCount" -ForegroundColor Green
Write-Host "❌ Fehler: $errorCount" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "🎉 Test-Profile wurden erfolgreich in Supabase eingefügt!" -ForegroundColor Green
    Write-Host "Du kannst jetzt http://localhost:3005/match öffnen und die echten Profile sehen!" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Es wurden keine Profile eingefügt. Bitte prüfe:" -ForegroundColor Yellow
    Write-Host "   1. Ist der Development Server gestartet? (npm run dev)" -ForegroundColor White
    Write-Host "   2. Ist die Supabase-Verbindung konfiguriert?" -ForegroundColor White
    Write-Host "   3. Existiert die matching_profiles Tabelle?" -ForegroundColor White
}

