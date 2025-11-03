# 🌐 Domain-Wechsel zu www.the-connection-key.de
# Deployed die aktualisierte Konfiguration auf Hetzner

Write-Host "🌐 Domain-Wechsel zu www.the-connection-key.de" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

# Server-Daten
$SERVER_IP = "138.199.237.34"
$NEW_DOMAIN = "www.the-connection-key.de"
$SSH_USER = "root"
$SSH_KEY = ".\Domain the connection Key"
$SERVER_PATH = "/opt/hd-app/HD_App_chart"

# Funktionen
function Write-Step {
    param($Message)
    Write-Host "[SCHRITT] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

# Schritt 1: Verbindung testen
Write-Step "Teste Verbindung zum Server..."
$testConnection = ssh -i $SSH_KEY -o ConnectTimeout=5 ${SSH_USER}@${SERVER_IP} "echo 'connected'" 2>$null
if ($testConnection -eq "connected") {
    Write-Success "Verbindung zum Server erfolgreich"
} else {
    Write-Error "Keine Verbindung zum Server möglich!"
    Write-Host "Überprüfe SSH-Zugangsdaten und Server-Status" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Schritt 2: Domain-Erreichbarkeit prüfen
Write-Step "Überprüfe neue Domain..."
try {
    $response = Invoke-WebRequest -Uri "https://$NEW_DOMAIN" -TimeoutSec 10 -UseBasicParsing
    Write-Success "Domain ist bereits erreichbar: https://$NEW_DOMAIN (Status: $($response.StatusCode))"
} catch {
    Write-Host "[!] Domain noch nicht erreichbar (das ist ok, wird nach Deployment funktionieren)" -ForegroundColor Yellow
}
Write-Host ""

# Schritt 3: SSL-Zertifikat überprüfen
Write-Step "Überprüfe SSL-Zertifikat auf dem Server..."
$certCheck = ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "ls -la /etc/letsencrypt/live/$NEW_DOMAIN/fullchain.pem 2>/dev/null"
if ($certCheck) {
    Write-Success "SSL-Zertifikat gefunden für $NEW_DOMAIN"
    Write-Host $certCheck -ForegroundColor Gray
} else {
    Write-Host "[!] SSL-Zertifikat nicht gefunden" -ForegroundColor Yellow
    Write-Host "Das Zertifikat muss möglicherweise erst erstellt werden" -ForegroundColor Yellow
    $createCert = Read-Host "Soll das Zertifikat jetzt erstellt werden? (ja/nein)"
    if ($createCert -eq "ja") {
        Write-Step "Erstelle SSL-Zertifikat..."
        $email = Read-Host "E-Mail-Adresse für Let's Encrypt"
        ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} @"
certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  --email $email \
  -d $NEW_DOMAIN \
  -d the-connection-key.de \
  --rsa-key-size 4096
"@
    }
}
Write-Host ""

# Schritt 4: Nginx-Konfiguration hochladen
Write-Step "Lade neue Nginx-Konfiguration hoch..."
scp -i $SSH_KEY nginx/nginx.conf ${SSH_USER}@${SERVER_IP}:${SERVER_PATH}/nginx/nginx.conf
if ($LASTEXITCODE -eq 0) {
    Write-Success "Nginx-Konfiguration hochgeladen"
} else {
    Write-Error "Fehler beim Hochladen der Nginx-Konfiguration"
    exit 1
}
Write-Host ""

# Schritt 5: Nginx-Konfiguration testen
Write-Step "Teste Nginx-Konfiguration auf dem Server..."
$nginxTest = ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose exec -T nginx nginx -t 2>&1"
Write-Host $nginxTest -ForegroundColor Gray
if ($nginxTest -match "syntax is ok" -and $nginxTest -match "test is successful") {
    Write-Success "Nginx-Konfiguration ist valide"
} else {
    Write-Host "[!] Nginx-Konfiguration hat möglicherweise Fehler" -ForegroundColor Yellow
    $continue = Read-Host "Trotzdem fortfahren? (ja/nein)"
    if ($continue -ne "ja") {
        exit 1
    }
}
Write-Host ""

# Schritt 6: Container neu laden
Write-Step "Lade Nginx-Container neu..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose restart nginx"
Write-Success "Nginx wurde neu geladen"
Write-Host ""

# Schritt 7: Warte auf Nginx-Start
Write-Step "Warte 5 Sekunden auf Nginx-Start..."
Start-Sleep -Seconds 5
Write-Host ""

# Schritt 8: Status überprüfen
Write-Step "Überprüfe Container-Status..."
$containerStatus = ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose ps"
Write-Host $containerStatus -ForegroundColor Gray
Write-Host ""

# Schritt 9: Nginx-Logs anzeigen
Write-Step "Letzte Nginx-Logs:"
$nginxLogs = ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose logs --tail=20 nginx"
Write-Host $nginxLogs -ForegroundColor Gray
Write-Host ""

# Schritt 10: Domain-Test
Write-Step "Teste neue Domain..."
Write-Host ""
Write-Host "Teste HTTPS..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://$NEW_DOMAIN" -TimeoutSec 10 -UseBasicParsing
    Write-Success "✓ HTTPS funktioniert! Status: $($response.StatusCode)"
} catch {
    Write-Error "✗ HTTPS nicht erreichbar: $_"
}
Write-Host ""

Write-Host "Teste HTTP (sollte auf HTTPS umleiten)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://$NEW_DOMAIN" -TimeoutSec 10 -UseBasicParsing -MaximumRedirection 0
    if ($response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
        Write-Success "✓ HTTP leitet korrekt auf HTTPS um"
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 301 -or $_.Exception.Response.StatusCode -eq 302) {
        Write-Success "✓ HTTP leitet korrekt auf HTTPS um"
    } else {
        Write-Host "[!] HTTP-Umleitung funktioniert möglicherweise nicht richtig" -ForegroundColor Yellow
    }
}
Write-Host ""

# Zusammenfassung
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 Domain-Wechsel abgeschlossen!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Neue URLs:" -ForegroundColor Cyan
Write-Host "  Hauptdomain:  https://$NEW_DOMAIN" -ForegroundColor White
Write-Host "  Alternative:  https://the-connection-key.de" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Server-Zugriff:" -ForegroundColor Cyan
Write-Host "  Server-IP:    $SERVER_IP" -ForegroundColor White
Write-Host "  Grafana:      http://${SERVER_IP}:3001" -ForegroundColor White
Write-Host "  Prometheus:   http://${SERVER_IP}:9090" -ForegroundColor White
Write-Host ""
Write-Host "📝 Hinweise:" -ForegroundColor Yellow
Write-Host "  • SSL-Zertifikat erneuert sich automatisch" -ForegroundColor White
Write-Host "  • HTTP leitet automatisch auf HTTPS um" -ForegroundColor White
Write-Host "  • Bei Problemen: docker-compose logs nginx" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Nützliche Befehle:" -ForegroundColor Cyan
Write-Host "  Container-Status:  ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'docker-compose ps'" -ForegroundColor Gray
Write-Host "  Nginx-Logs:       ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'docker-compose logs -f nginx'" -ForegroundColor Gray
Write-Host "  Nginx neuladen:   ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'docker-compose restart nginx'" -ForegroundColor Gray
Write-Host ""

