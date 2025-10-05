#!/bin/bash

# Nginx-Konfiguration für Hetzner-Server reparieren
# Dieses Skript repariert die defekte Nginx-Konfiguration

echo "🔧 Nginx-Konfiguration reparieren..."

# Defekte Konfiguration entfernen
rm -f /etc/nginx/sites-enabled/hd-app-dev

# Neue, korrekte Konfiguration erstellen
cat > /etc/nginx/sites-enabled/hd-app-dev << 'EOF'
server {
    listen 80;
    server_name 138.199.237.34 moonlightdatingapp.werdemeisterdeinergedanken.de;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "✅ Nginx-Konfiguration erstellt"

# Nginx-Konfiguration testen
echo "🧪 Nginx-Konfiguration testen..."
if nginx -t; then
    echo "✅ Nginx-Konfiguration ist gültig"
    
    # Nginx starten
    echo "🚀 Nginx starten..."
    systemctl restart nginx
    systemctl enable nginx
    
    # Status prüfen
    echo "📊 Nginx Status:"
    systemctl status nginx --no-pager -l
    
else
    echo "❌ Nginx-Konfiguration fehlerhaft!"
    echo "Fehler-Details:"
    nginx -t
fi

echo "🎉 Nginx-Reparatur abgeschlossen!"
