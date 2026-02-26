# Wasif Haque Portfolio

Personal portfolio site for Wasif Haque (Data Scientist / ML Engineer), built as a static GitHub Pages site.

Live: https://wasifarmanhaque.github.io

## Stack
- HTML (`index.html`)
- CSS (`css/glassmorphism.css`)
- Vanilla JS (`js/*.js`)
- Fonts/icons via Google Fonts + Font Awesome CDN

## Current Highlights
- Modern single-page layout with glassmorphism styling
- Mobile nav + responsive sections
- Hero proof strip + selected wins section
- Collapsible experience details
- Interactive demos:
  - Neural Network Visualizer
  - Generative Art Engine
  - Fraud Threshold Simulator

## Key Files
- `index.html` - main page content and section structure
- `css/glassmorphism.css` - theme, layout, responsive styles
- `js/glassmorphism.js` - navigation, scrolling, motion behavior
- `js/neural-network.js` - neural network demo
- `js/generative-art.js` - generative art demo
- `js/fraud-threshold-simulator.js` - threshold/business-cost demo
- `images/wh-favicon.svg` - site favicon
- `files/resume.pdf` - downloadable resume

## Local Development
```bash
python -m http.server 8000
```
Open http://localhost:8000

## Editing Notes
- Update content in `index.html`
- Update visual design in `css/glassmorphism.css`
- Update interactions in `js/*.js`
- Ignore local artifacts (`.claude/`, `tmpclaude-*-cwd`, `.DS_Store`) via `.gitignore`
