# Project Structure

## Overview

This project has been reorganized for better maintainability and clarity.

## Directory Structure

```
TOP-SECRET/
├── index.html                    # Main entry point - project menu
├── .nojekyll                     # GitHub Pages configuration
├── .gitignore                    # Git ignore rules
│
├── projects/                     # Deployed game projects (static files)
│   ├── shiba-neighborhood/      # Shiba Neighborhood Explorer game
│   ├── javi-town-trials/         # Javi's Town Trials game
│   ├── game-selector/           # Password-protected game selector
│   ├── valentine-game/          # Built Valentine game (deployed)
│   └── wedding-invitation/      # Wedding invitation project
│
├── src/                          # Source code
│   └── valentine-game/          # Valentine game source (React/Vite)
│       └── will-you-be-my-valentine/
│
├── docs/                         # Documentation
│   ├── README.md                # Documentation index
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── DEPLOYMENT-FIX.md        # Deployment fix explanation
│
├── scripts/                      # Utility scripts
│   └── verify-deployment.sh     # Deployment verification script
│
├── assets/                       # Images and other assets
│
└── .github/                      # GitHub configuration
    └── workflows/
        └── deploy.yml            # GitHub Actions deployment workflow
```

## Key Changes

1. **Source Code Organization**: All source code moved to `src/` folder
2. **Documentation**: All docs consolidated in `docs/` folder
3. **Scripts**: Utility scripts moved to `scripts/` folder
4. **Assets**: Images and assets moved to `assets/` folder
5. **Clean Root**: Root directory only contains essential files

## Building Projects

### Valentine Game

To rebuild the valentine game:

```bash
cd src/valentine-game/will-you-be-my-valentine
npm install
npm run build
cp -r dist/* ../../../projects/valentine-game/
```

## Deployment

The GitHub Actions workflow automatically builds and deploys:
- Builds valentine game from `src/valentine-game/`
- Copies built files to `projects/valentine-game/`
- Deploys all static files from root
