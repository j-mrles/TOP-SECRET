# Shiba Neighborhood Explorer

A cute interactive game where you play as a Shiba Inu exploring a neighborhood! Walk around, visit different houses, and play games.

## Features

- 🐕 Play as an adorable Shiba Inu character
- 🏠 Explore a neighborhood with multiple houses
- 🎮 Each house contains a different game
- 📱 Mobile-friendly with touch controls
- ⌨️ Keyboard controls (Arrow keys/WASD + Enter)

## Controls

- **Arrow Keys** or **WASD**: Move the Shiba around
- **Enter** or **Space**: Interact with houses
- **Mobile**: Use the on-screen joystick and action button

## Houses

- **House 1**: Javi's Town Trials (the original game)
- **Houses 2-6**: Coming soon! (Will show "Game [number] is ready" message)

## Running Locally

Just open `index.html` in your browser, or serve it with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Project Structure

- `index.html` - Main game entry point
- `script.js` - Game logic
- `styles.css` - Styling
- `projects/` - Folder containing different game projects
  - `javi-town-trials/` - The original Javier Morales game

## Adding New Games

To add a new game:

1. Create a new folder in `projects/` with your game files
2. Update `script.js` → `houses` array to add a new house entry:
   ```js
   {
     id: 2,
     x: 15,
     y: 5,
     name: "Your Game Name",
     game: "projects/your-game/index.html",
     ready: true,
   }
   ```

Enjoy exploring! 🐕✨
