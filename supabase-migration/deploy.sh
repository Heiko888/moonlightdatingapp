#!/bin/bash

# HD App Supabase Migration Deployment Script

echo "🚀 Starting HD App Supabase Migration..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Initialize Supabase project (if not already initialized)
if [ ! -f "supabase/config.toml" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
fi

# Link to existing project (replace with your project reference)
echo "🔗 Linking to Supabase project..."
read -p "Enter your Supabase project reference: " PROJECT_REF
supabase link --project-ref $PROJECT_REF

# Apply database schema
echo "🗄️ Applying database schema..."
supabase db reset

# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

# Deploy auth functions
echo "  - Deploying auth-login function..."
supabase functions deploy auth-login

echo "  - Deploying auth-register function..."
supabase functions deploy auth-register

echo "  - Deploying user-profile function..."
supabase functions deploy user-profile

echo "  - Deploying moon-calendar function..."
supabase functions deploy moon-calendar

# Deploy additional functions (if they exist)
if [ -d "functions/matching" ]; then
    echo "  - Deploying matching function..."
    supabase functions deploy matching
fi

if [ -d "functions/coaching" ]; then
    echo "  - Deploying coaching function..."
    supabase functions deploy coaching
fi

if [ -d "functions/knowledge" ]; then
    echo "  - Deploying knowledge function..."
    supabase functions deploy knowledge
fi

# Generate TypeScript types
echo "📝 Generating TypeScript types..."
supabase gen types typescript --linked > ../frontend/types/supabase.ts

echo "✅ Migration completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your frontend .env.local with the Supabase credentials"
echo "2. Test the API endpoints"
echo "3. Deploy your static frontend to All-Inkl"
echo ""
echo "🔗 Your Supabase project URL: https://supabase.com/dashboard/project/$PROJECT_REF"
