# Assignment 4 - Personal Web Application Portfolio

This repository is the final, polished version of my personal portfolio web application for **Assignment 4**. It combines API integration, stateful UI logic, responsive design, and an AI-assisted development process.

## What's Inside
- Polished single-page portfolio with light/dark theme toggle.
- Persistent state for visitor name, theme, experience level, project filters, and skills focus.
- GitHub REST API integration to display recent repositories with graceful error handling.
- New **Skills Heatmap and Focus** feature (Assignment 4 unique addition) with keyboard navigation and saved preferences.
- Contact form with multi-step validation.
- Documentation covering technical decisions and AI usage.

## Quick Start
1. Clone or download the repository.
2. Open `index.html` directly in your browser **or** serve locally for best results:
   ```bash
   # from the repo root
   python -m http.server 8000
   # then visit http://localhost:8000
   ```
3. In the GitHub section, enter your GitHub username and click **Refresh** to see your repos.

## Deployment
- Live site (GitHub Pages): https://khalidd0.github.io/assignment-4/
- Ready for static hosting (GitHub Pages/Netlify/Vercel). For GitHub Pages:
  1) Push to `main` on a public repo named `assignment-4`.
  2) Enable Pages for the `main` branch root.
  3) Your site will be available at `https://<your-username>.github.io/assignment-4/`.

## Project Structure
- index.html
- css/styles.css
- js/script.js
- assets/images/.gitkeep
- docs/ai-usage-report.md
- docs/technical-documentation.md
- presentation/README.md
- presentation/slides-placeholder/README.md
- presentation/demo-placeholder/README.md
- .gitignore

## AI Usage (Summary)
AI tools (ChatGPT) were used to help plan improvements, draft UI copy, and iterate on code structure. Detailed prompts, outputs, edits, and learnings are documented in `docs/ai-usage-report.md`.

## Contributing / Notes
- No build step is required; this is plain HTML/CSS/JS.
- Keep assets optimized (SVG/PNG) in `assets/images`.
- Follow consistent formatting and update docs when adding features.
