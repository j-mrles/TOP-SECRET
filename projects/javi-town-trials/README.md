## Javier Morales: Town Trials (Static 2D Game)

A **Pokémon-like 2D top-down** mini game built with **just HTML/CSS/JS**.

You walk around a small town, enter **5 houses**, and complete challenges “about Javier Morales” to unlock the finale secret.

### Run it

- Open `index.html` in any modern browser.
- Or serve locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### GitHub Pages notes (if something “doesn’t work” after deploy)

- Make sure you deployed the **root** of the repo (or `/docs`) that contains `index.html`.
- If the page loads but the game doesn’t, open the site and check:
  - **Red debug panel** on the page (startup errors / reachability warnings)
  - Browser DevTools → **Console** (JS errors)
  - DevTools → **Network** for `script.js` / `styles.css` returning **404**

### Controls

- **Arrow keys** (or **WASD**): move
- **Enter**: interact / enter a house (when standing near a door)
- **Esc**: close the challenge dialog
- **Reset** button: clears saved progress

### Customize challenges + secret

Edit `script.js` → `CONFIG`.

- **Challenge answers**: update `CONFIG.answers`
- **Final secret**: update `CONFIG.secretEncoded`

#### Change the finale secret

The secret is stored as `base64(reverse(secret))`.

Generate a new value in your browser console:

```js
const secret = "Javier Morales is engaged with Rosita Pacheco";
const encoded = btoa(secret.split("").reverse().join(""));
encoded;
```

Copy that string into `CONFIG.secretEncoded`.

### Notes

- Progress is stored in `localStorage` under key `jm-town-trials:v2`.
- This is a game, not security: anyone can still view source.


