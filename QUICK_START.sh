#!/usr/bin/env bash

# 🐍 HIDDEN SNAKE GAME - QUICK START GUIDE
# ==========================================

echo "🎮 Hidden Snake Game - NIRD Village"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Navigate to project
cd "$(dirname "$0")" || exit 1

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Available commands:"
echo ""
echo "  npm run dev        → Start development server"
echo "  npm run build      → Build for production"
echo "  npm run preview    → Preview production build"
echo "  npm run lint       → Run linter"
echo ""
echo "🎮 To Play:"
echo ""
echo "  1. npm run dev"
echo "  2. Open http://localhost:8082"
echo "  3. Press: S-N-A-K-E (or Konami Code: ↑↑↓↓←→←→BA)"
echo "  4. Click 'Start Game'"
echo "  5. Use arrow keys to move"
echo ""
echo "📱 Controls:"
echo "  Desktop:  Arrow keys to move, Space to start"
echo "  Mobile:   Swipe to move, tap buttons"
echo ""
echo "🚀 To Deploy:"
echo ""
echo "  npm run build      → Creates 'dist/' folder"
echo "  Upload 'dist/'     → To your hosting provider"
echo ""
echo "📚 Documentation:"
echo "  - SNAKE_GAME_README.md          (Main guide)"
echo "  - HIDDEN_SNAKE_GAME_README.md   (Full documentation)"
echo "  - SNAKE_GAME_QUICK_REFERENCE.js (Developer reference)"
echo "  - DEPLOYMENT_CHECKLIST.md       (Deployment guide)"
echo ""
echo "Happy gaming! 🐍"
