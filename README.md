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
- 💍 **2/4** - Proposal game (coming soon)

## Running Locally

Just open `index.html` in your browser, or serve it with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

**Note**: This project is designed to work from the root `index.html` and is optimized for GitHub Pages hosting. All paths are relative to the root directory.

## Project Structure

- `index.html` - **Main menu** (starts here! Choose a project)
- `projects/` - Folder containing all game projects
  - `shiba-neighborhood/` - Shiba Neighborhood Explorer game
  - `javi-town-trials/` - The original Javier Morales game
  - `game-selector/` - Password-protected game selector (password: "snoopy")
  - `valentine-game/` - Built Valentine game (React/Vite)
  - `2-4/` - Proposal game placeholder

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
