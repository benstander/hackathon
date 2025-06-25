#!/bin/bash

echo "🚀 onTrack Financial App Setup"
echo "================================"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
    echo "⚠️  Please edit backend/.env with your actual API keys"
else
    echo "✅ Backend .env file already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file..."
    cp frontend/env.example frontend/.env.local
    echo "✅ Frontend .env.local file created"
    echo "⚠️  Please edit frontend/.env.local with your actual API keys"
else
    echo "✅ Frontend .env.local file already exists"
fi

echo ""
echo "📋 Required API Keys:"
echo "====================="
echo ""
echo "🔐 Supabase:"
echo "   - Project URL: https://your-project-id.supabase.co"
echo "   - Anon Key: (from Supabase dashboard)"
echo "   - Service Role Key: (from Supabase dashboard)"
echo ""
echo "🏦 Basiq:"
echo "   - API Key: (format: api_key_id:api_key_secret)"
echo "   - Must be base64 encoded"
echo ""
echo "📚 Next Steps:"
echo "=============="
echo "1. Get your Supabase credentials from https://supabase.com"
echo "2. Get your Basiq API key from https://basiq.io"
echo "3. Edit the .env files with your actual values"
echo "4. Run the database schema in Supabase SQL Editor"
echo "5. Start the servers:"
echo "   - Backend: cd backend && npm start"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "📖 For detailed instructions, see SETUP.md"
echo "" 