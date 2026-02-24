#!/bin/bash
# Simple script to verify all files exist and paths are correct

echo "🔍 Verifying deployment structure..."

# Check critical files
files=(
  "index.html"
  ".nojekyll"
  "projects/valentine-game/index.html"
  "projects/valentine-game/assets/index-B0mCQoEo.js"
  "projects/valentine-game/assets/index-BpHS-UOh.css"
  "projects/game-selector/index.html"
  "projects/shiba-neighborhood/index.html"
  "projects/javi-town-trials/index.html"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ MISSING: $file"
    missing=$((missing + 1))
  fi
done

if [ $missing -eq 0 ]; then
  echo ""
  echo "✅ All critical files present!"
  echo "✅ Ready for GitHub Pages deployment"
else
  echo ""
  echo "❌ $missing file(s) missing. Please check above."
  exit 1
fi
