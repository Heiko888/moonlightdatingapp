# 🔐 SSL-Zertifikat Setup für Hetzner Server (Windows PowerShell)
# Domain: www.the-connection-key.de
# Server: 138.199.237.34

Write-Host "🔐 SSL-Zertifikat Setup für Hetzner Server" -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""

# Server-Daten
$SERVER_IP = "138.199.237.34"
$DOMAIN = "www.the-connection-key.de"
$SSH_USER = "root"  # Oder dein SSH-Benutzer

Write-Host "📋 Voraussetzungen:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "1. SSH-Zugang zum Hetzner-Server ($SERVER_IP)"
Write-Host "2. Domain $DOMAIN muss auf $SERVER_IP zeigen"
Write-Host "3. Ports 80 und 443 müssen offen sein"
Write-Host ""

# DNS-Überprüfung
Write-Host "🌐 Schritt 1: DNS-Einträge überprüfen" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue
Write-Host "Überprüfe DNS für: $DOMAIN" -ForegroundColor Cyan
try {
    $dnsResult = Resolve-DnsName -Name $DOMAIN -Type A -ErrorAction Stop
    Write-Host "✅ DNS-Eintrag gefunden: $($dnsResult.IPAddress)" -ForegroundColor Green
    
    if ($dnsResult.IPAddress -contains $SERVER_IP) {
        Write-Host "✅ Domain zeigt korrekt auf $SERVER_IP" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNUNG: Domain zeigt auf $($dnsResult.IPAddress), nicht auf $SERVER_IP" -ForegroundColor Yellow
        Write-Host "   Bitte DNS-Einträge korrigieren, bevor du fortfährst!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Benötigter DNS-Eintrag:" -ForegroundColor Yellow
        Write-Host "   Type: A" -ForegroundColor Yellow
        Write-Host "   Name: @ (oder moonlightdatingapp)" -ForegroundColor Yellow
        Write-Host "   Value: $SERVER_IP" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Trotzdem fortfahren? (ja/nein)"
        if ($continue -ne "ja") {
            Write-Host "Abgebrochen." -ForegroundColor Red
            exit
        }
    }
} catch {
    Write-Host "❌ DNS-Eintrag nicht gefunden!" -ForegroundColor Red
    Write-Host "   Bitte DNS-Eintrag erstellen:" -ForegroundColor Yellow
    Write-Host "   Type: A" -ForegroundColor Yellow
    Write-Host "   Name: @ (oder moonlightdatingapp)" -ForegroundColor Yellow
    Write-Host "   Value: $SERVER_IP" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Trotzdem fortfahren? (ja/nein)"
    if ($continue -ne "ja") {
        Write-Host "Abgebrochen." -ForegroundColor Red
        exit
    }
}
Write-Host ""

# SSH-Schlüssel überprüfen
Write-Host "🔑 Schritt 2: SSH-Verbindung vorbereiten" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

$sshKeyPath = ".\Domain the connection Key"
if (Test-Path $sshKeyPath) {
    Write-Host "✅ SSH-Schlüssel gefunden: $sshKeyPath" -ForegroundColor Green
    $useKey = Read-Host "SSH-Schlüssel verwenden? (ja/nein)"
    if ($useKey -eq "ja") {
        $SSH_KEY = "-i `"$sshKeyPath`""
    } else {
        $SSH_KEY = ""
    }
} else {
    Write-Host "⚠️  Kein SSH-Schlüssel gefunden" -ForegroundColor Yellow
    $SSH_KEY = ""
}
Write-Host ""

# Setup-Skript hochladen und ausführen
Write-Host "📤 Schritt 3: Setup-Skript auf Server hochladen" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue

# Skript hochladen
Write-Host "Lade Setup-Skript hoch..." -ForegroundColor Cyan
$scpCommand = "scp $SSH_KEY setup-ssl-hetzner.sh ${SSH_USER}@${SERVER_IP}:/tmp/"
Write-Host "Befehl: $scpCommand" -ForegroundColor Gray
Invoke-Expression $scpCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Skript hochgeladen" -ForegroundColor Green
} else {
    Write-Host "❌ Fehler beim Hochladen!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Kopiere den Inhalt von setup-ssl-hetzner.sh manuell auf den Server" -ForegroundColor Yellow
    exit
}
Write-Host ""

# Skript ausführbar machen
Write-Host "🔧 Schritt 4: Skript ausführbar machen" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue
$sshCommand = "ssh $SSH_KEY ${SSH_USER}@${SERVER_IP} 'chmod +x /tmp/setup-ssl-hetzner.sh'"
Invoke-Expression $sshCommand
Write-Host "✅ Skript ist ausführbar" -ForegroundColor Green
Write-Host ""

# E-Mail-Adresse abfragen
Write-Host "📧 Schritt 5: E-Mail-Adresse für Let's Encrypt" -ForegroundColor Blue
Write-Host "==============================================" -ForegroundColor Blue
$email = Read-Host "Gib deine E-Mail-Adresse ein (für Zertifikat-Benachrichtigungen)"
Write-Host ""

# Skript auf Server ausführen
Write-Host "🚀 Schritt 6: SSL-Setup auf Server ausführen" -ForegroundColor Blue
Write-Host "============================================" -ForegroundColor Blue
Write-Host "WICHTIG: Das Setup kann einige Minuten dauern..." -ForegroundColor Yellow
Write-Host "Du wirst möglicherweise nach Bestätigungen gefragt." -ForegroundColor Yellow
Write-Host ""
Write-Host "Drücke Enter, um zu starten..." -ForegroundColor Cyan
Read-Host

# Verbinde mit SSH und führe Skript aus
$sshCommand = "ssh $SSH_KEY -t ${SSH_USER}@${SERVER_IP} 'bash /tmp/setup-ssl-hetzner.sh'"
Write-Host "Verbinde mit Server..." -ForegroundColor Cyan
Write-Host ""
Invoke-Expression $sshCommand
Write-Host ""

# Status überprüfen
Write-Host "📊 Schritt 7: Status überprüfen" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue
Write-Host ""
Write-Host "Teste HTTPS-Verbindung..." -ForegroundColor Cyan

Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "https://$DOMAIN" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ HTTPS funktioniert! Status: $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  HTTPS noch nicht verfügbar (das ist normal direkt nach dem Setup)" -ForegroundColor Yellow
    Write-Host "   Warte ein paar Sekunden und teste manuell: https://$DOMAIN" -ForegroundColor Yellow
}
Write-Host ""

# Zusammenfassung
Write-Host "🎉 SSL-Setup abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Zusammenfassung:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "✅ Domain: https://$DOMAIN"
Write-Host "✅ Server: $SERVER_IP"
Write-Host "✅ SSL-Zertifikat: Let's Encrypt (erneuert automatisch)"
Write-Host ""
Write-Host "🔗 Wichtige URLs:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "Frontend (HTTPS):  https://$DOMAIN"
Write-Host "Frontend (HTTP):   http://${SERVER_IP}:3000"
Write-Host "Grafana:          http://${SERVER_IP}:3001"
Write-Host "Prometheus:       http://${SERVER_IP}:9090"
Write-Host ""
Write-Host "🔧 Nützliche SSH-Befehle:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Container-Status:        ssh $SSH_KEY ${SSH_USER}@${SERVER_IP} 'docker ps'"
Write-Host "Logs anzeigen:          ssh $SSH_KEY ${SSH_USER}@${SERVER_IP} 'docker logs <container-name>'"
Write-Host "Zertifikat überprüfen:  ssh $SSH_KEY ${SSH_USER}@${SERVER_IP} 'certbot certificates'"
Write-Host ""
Write-Host "📝 Hinweise:" -ForegroundColor Yellow
Write-Host "============" -ForegroundColor Yellow
Write-Host "• SSL-Zertifikate werden automatisch vor Ablauf erneuert"
Write-Host "• Certbot läuft als Cronjob auf dem Server"
Write-Host "• Bei Problemen: Firewall-Regeln überprüfen (ufw status)"
Write-Host ""

