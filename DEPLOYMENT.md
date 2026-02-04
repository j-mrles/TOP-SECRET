# GitHub Pages Deployment Guide

This project is configured to work as a **static site** on GitHub Pages. All files are vanilla HTML, CSS, and JavaScript (or pre-built static files).

## Project Structure

- `index.html` - Main menu (entry point)
- `projects/` - All game projects
  - All projects use static HTML/CSS/JS
  - `valentine-game/` - Pre-built React app (compiled to static files)

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
   - Click Save

3. **Wait for deployment**
   - GitHub Pages will automatically deploy
   - Your site will be available at: `https://[username].github.io/[repo-name]/`

## Important Files

- `.nojekyll` - Prevents Jekyll from processing the site (ensures all files are served)
- All paths are relative - works from any base URL

## Building Valentine Game (if needed)

If you need to rebuild the valentine game:

```bash
cd will-you-be-my-valentine
npm install
npm run build
cp -r dist/* ../projects/valentine-game/
```

## Troubleshooting

- **404 errors**: Make sure `.nojekyll` file exists in root
- **Paths not working**: All paths are relative, should work automatically
- **Build errors**: The valentine game is pre-built, no build step needed for deployment
