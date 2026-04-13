#!/bin/bash
# SportsPrognose GitHub Push Script
# Run from /root/.openclaw/workspace/sportsprognose directory

set -e

echo "🚀 Pushing SportsPrognose to GitHub..."

# Initialize if needed
if [ ! -d .git ]; then
    echo "📦 Initializing git..."
    git init
    git checkout -b main
fi

# Add all files
echo "📝 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "SportsPrognose: Football prediction app with Poisson model + live football-data.org API"

# Push
echo "🚀 Pushing to GitHub..."
echo ""
echo "If you need to add remote:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/sportsprognose.git"
echo ""
echo "Then push with:"
echo "  git push -u origin main"
echo ""

read -p "Enter GitHub remote URL (or press Enter to skip): " remote_url
if [ -n "$remote_url" ]; then
    git remote add origin "$remote_url"
    git push -u origin main
    echo "✅ Done! Pushed to GitHub."
else
    echo "ℹ️ Run: git remote add origin <URL> && git push -u origin main"
fi