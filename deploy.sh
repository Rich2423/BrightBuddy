#!/bin/bash

# BrightBuddy Deployment Script
# This script helps prepare your app for deployment to Vercel

echo "🚀 BrightBuddy Deployment Setup"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Set a custom port for development
# PORT=3000

# Optional: Set environment
# NODE_ENV=production
EOF
    echo "✅ .env.local file created"
    echo "⚠️  Remember to replace 'your_openai_api_key_here' with your actual API key"
else
    echo "✅ .env.local file already exists"
fi

# Check if .gitignore includes .env.local
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "🔒 Adding .env.local to .gitignore..."
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.*.local" >> .gitignore
    echo "✅ .env.local added to .gitignore"
else
    echo "✅ .env.local already in .gitignore"
fi

# Build test
echo "🔨 Testing build process..."
if npm run build; then
    echo "✅ Build test successful"
else
    echo "❌ Build test failed. Please fix any errors before deploying."
    exit 1
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/brightbuddy.git"
echo "   git add ."
echo "   git commit -m 'Initial commit: BrightBuddy Learning & Wellness Journal'"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables in Vercel dashboard"
echo "   - Deploy!"
echo ""
echo "3. For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
echo "🌐 Your app will be live at: https://your-app-name.vercel.app" 