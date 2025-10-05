#!/bin/bash

# Server-Umgebungsvariablen-Problem beheben
echo "🔧 Server-Umgebungsvariablen reparieren..."

# Zum aktiven Repository wechseln
cd /root/moonlightdatingapp

# Umgebungsvariablen-Datei erstellen (falls nicht vorhanden)
if [ ! -f .env.local ]; then
    echo "📝 .env.local erstellen..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzQ4NzEsImV4cCI6MjA1MTU1MDg3MX0.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk3NDg3MSwiZXhwIjoyMDUxNTUwODcxfQ.example

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here

# OpenAI API Key (optional)
OPENAI_API_KEY=your-openai-key-here
EOF
    echo "✅ .env.local erstellt"
else
    echo "✅ .env.local bereits vorhanden"
fi

# Docker Services stoppen
echo "🛑 Docker Services stoppen..."
docker-compose -f docker-compose.supabase.yml down

# Docker Services mit Umgebungsvariablen starten
echo "🚀 Docker Services mit Umgebungsvariablen starten..."
docker-compose -f docker-compose.supabase.yml up -d --build

# Status prüfen
echo "📊 Services Status:"
docker-compose -f docker-compose.supabase.yml ps

echo "🎉 Server-Reparatur abgeschlossen!"
