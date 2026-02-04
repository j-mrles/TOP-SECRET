# Project Collection

A collection of interactive games and projects. Start from the main menu to choose which project you'd like to explore!

## Projects

### 🐕 Shiba Neighborhood
An interactive game where you play as a Shiba Inu exploring a neighborhood! Walk around, visit different houses, and play games.
- **Controls**: Arrow keys/WASD to move, Enter to interact
- **Mobile**: Touch controls with joystick

### 🏘️ Javi's Town Trials
A Pokémon-like 2D top-down mini game. Walk around town, enter houses, and complete challenges.

### 🔐 Special Games
Password-protected collection (password: "snoopy"):
- 💕 **Valentine Game** - A fun Valentine's Day interactive experience

## Running Locally

Just open `index.html` in your browser, or serve it with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

**Note**: This project is designed to work from the root `index.html` and is optimized for GitHub Pages hosting. All paths are relative to the root directory.

## GitHub Pages Deployment

This project is **100% static** and ready for GitHub Pages deployment:

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

2. **Enable GitHub Pages**:
   - Go to repository **Settings → Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
   - Click **Save**

3. **Automatic Deployment**:
   - GitHub Actions will automatically deploy when you push
   - No build step needed - everything is pre-built static files!

### Important Files

- `.nojekyll` - Ensures all files are served (prevents Jekyll processing)
- `.github/workflows/deploy.yml` - Simple static file deployment (no build required)
- All files are static HTML/CSS/JS - ready to serve!

### Verify Deployment

Run the verification script to check everything is ready:
```bash
./verify-deployment.sh
```

## Project Structure

- `index.html` - **Main menu** (starts here! Choose a project)
- `projects/` - Folder containing all game projects
  - `shiba-neighborhood/` - Shiba Neighborhood Explorer game
  - `javi-town-trials/` - The original Javier Morales game
  - `game-selector/` - Password-protected game selector (password: "snoopy")
  - `valentine-game/` - Built Valentine game (React/Vite)

## Adding New Projects

To add a new project:

1. Create a new folder in `projects/` with your project files
2. Add a new card to the menu in `index.html`:
   ```html
   <a href="projects/your-project/index.html" class="project-card">
     <span class="project-icon">🎮</span>
     <div class="project-title">Your Project</div>
     <div class="project-description">Description here</div>
   </a>
   ```

Enjoy exploring! 🎮✨
