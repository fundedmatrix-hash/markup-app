# MARKUP

MARKUP is a local-first annotation app for web, extension, desktop, and mobile-adjacent workflows.

## Features
- Responsive web app with floating launcher and toolbar
- Drawing tools: pen, marker, line, arrow, double arrow, rectangle, circle, text, numbers, check, cross
- Eraser, blur, pixelate, laser, spotlight, undo/redo controls
- Screenshot, notes, board mode, and local storage-backed persistence
- Browser extension architecture for webpage annotation
- Electron desktop architecture with secure preload and IPC
- Mobile and tablet platform detection with supported fallback messaging
- Optional Google Drive integration scaffold
- PWA-ready configuration and offline support via Vite PWA

## Run locally
1. `npm install`
2. `npm run dev`
3. Open the Vite URL shown in the terminal

## Production build
- `npm run build`
- `npm run extension:build`
- `npm run desktop:build`

## Browser extension
Load the `extension/` directory as an unpacked extension in Chrome or Edge.

## Desktop
Use the Electron entry point in `electron/main.js` with Electron installed locally.

## Important limitations
- System-wide desktop overlay permissions depend on the OS and platform.
- Mobile OS restrictions prevent full app-over-other-app drawing on iOS by default.
- Google Drive is optional and not required for local-first usage.
