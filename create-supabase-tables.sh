#!/bin/bash

# Supabase Tabellen erstellen
echo "🔧 Erstelle Supabase-Tabellen..."

# Planet Info Table
curl -X POST 'https://njjcywgskzepikyzhihy.supabase.co/rest/v1/rpc/exec_sql' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs' \
  -H 'Content-Type: application/json' \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS planet_info (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, planet_name VARCHAR(50) UNIQUE NOT NULL, symbol VARCHAR(10) NOT NULL, orbital_period VARCHAR(50) NOT NULL, discovery VARCHAR(50) NOT NULL, mythology VARCHAR(255) NOT NULL, color VARCHAR(20) NOT NULL, description TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"}'

echo "✅ Planet Info Table erstellt"

# Planet Gates Table
curl -X POST 'https://njjcywgskzepikyzhihy.supabase.co/rest/v1/rpc/exec_sql' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs' \
  -H 'Content-Type: application/json' \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS planet_gates (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, planet_name VARCHAR(50) NOT NULL, gate_number INTEGER NOT NULL, name VARCHAR(255) NOT NULL, essence VARCHAR(255) NOT NULL, consciousness VARCHAR(255) NOT NULL, description TEXT NOT NULL, deep_meaning TEXT NOT NULL, shadow_aspects JSONB, gifts JSONB, affirmation TEXT NOT NULL, center_name VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(planet_name, gate_number));"}'

echo "✅ Planet Gates Table erstellt"

# Planet Centers Table
curl -X POST 'https://njjcywgskzepikyzhihy.supabase.co/rest/v1/rpc/exec_sql' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs' \
  -H 'Content-Type: application/json' \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS planet_centers (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, planet_name VARCHAR(50) NOT NULL, center_name VARCHAR(50) NOT NULL, essence VARCHAR(255) NOT NULL, consciousness VARCHAR(255) NOT NULL, description TEXT NOT NULL, deep_meaning TEXT NOT NULL, shadow_aspects JSONB, gifts JSONB, affirmation TEXT NOT NULL, gates JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(planet_name, center_name));"}'

echo "✅ Planet Centers Table erstellt"

echo "🎉 Alle Supabase-Tabellen erfolgreich erstellt!"
