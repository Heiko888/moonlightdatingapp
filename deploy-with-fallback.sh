#!/bin/bash

# Deployment Script mit OpenAI API Key Check
echo "🚀 Starting deployment with OpenAI API Key check..."

# Check if OpenAI API Key is set
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "" ]; then
    echo "⚠️  No OpenAI API Key found - deploying in FALLBACK MODE"
    echo "✅ All AI features will use fallback responses"
    export FALLBACK_MODE=true
else
    echo "✅ OpenAI API Key found - testing connection..."
    
    # Test API Key
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -H "Content-Type: application/json" \
        https://api.openai.com/v1/models)
    
    if [ "$response" = "200" ]; then
        echo "✅ OpenAI API Key is valid"
        export FALLBACK_MODE=false
    else
        echo "❌ OpenAI API Key is invalid or blocked - using FALLBACK MODE"
        export FALLBACK_MODE=true
    fi
fi

# Build and deploy
echo "📦 Building application..."
npm run build

echo "🚀 Deploying to server..."
# Add your deployment commands here

echo "✅ Deployment completed!"
echo "🔧 Fallback Mode: $FALLBACK_MODE"
