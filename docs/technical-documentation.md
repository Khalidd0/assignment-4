# Technical Documentation - Assignment 4 Portfolio

This document describes the technical design of the Assignment 4 personal portfolio web application. The app is a single-page experience built with **HTML, CSS, and vanilla JavaScript** and highlights API integration, persistent client-side state, accessibility, and a new interactive skills heatmap.

## 1) Overview
- Runs fully client-side; no build step or backend.
- Persists user choices via `localStorage` (theme, name, experience level, project filters, skills focus/threshold).
- Integrates the public GitHub REST API to fetch repositories with friendly error handling.
- Adds a unique **Skills Heatmap and Focus** feature with keyboard navigation.

## 2) File Structure (root)
```
index.html
css/styles.css
js/script.js
assets/images/.gitkeep
presentation/ (placeholders for slides and demo)
docs/ai-usage-report.md
docs/technical-documentation.md
README.md
```

## 3) HTML Layout (index.html)
- `header.top-bar`: brand lockup and theme toggle.
- `section#hero`: greeting, visitor name form, session timer.
- `section#experience-section`: experience level buttons with live message.
- `section#projects-section`: filter, sort, search, show/hide controls, projects grid, and empty state.
- `section#github-section`: username input, refresh button, status text, and GitHub repo cards.
- `section#skills-section`: focus select, threshold slider, live chip, and heatmap grid (Assignment 4 feature).
- `section#contact-section`: form fields with validation error containers.
- `footer`: assignment note and capability summary.

All dynamic targets use IDs and semantic elements for accessibility. Status text blocks use `aria-live="polite"`.

## 4) Styling (css/styles.css)
- CSS custom properties on `:root` drive colors, spacing, shadows, and typography; theme switch sets `data-theme` on `<html>`.
- Layout keeps a single column with max-width 1100px and card surfaces with soft gradients.
- Components: `.top-bar`, `.hero`, `.controls`, `.project-grid`, `.project`, `.experience-buttons`, `.heatmap-grid`, `.heatmap-cell`, `.chip`, `.eyebrow`, `.fade-in` animations.
- Inputs/buttons share consistent rounding, focus outlines, and hover states. Heatmap cells use category badges and strength glyphs.

## 5) JavaScript Architecture (js/script.js)
The script is wrapped in an IIFE. Utility helpers `$` and `$$` wrap `querySelector`/`querySelectorAll`.

### State
```js
STATE = {
  theme, username, filter, sort, search,
  showProjects, experienceLevel, sessionStart,
  skillsFocus, skillsThreshold, skillsSelection
}
```
Values persist via `localStorage` where applicable.

### Features
- **Theme**: toggles `data-theme` and button label; stored in `localStorage`.
- **Hero name**: saves visitor name and updates greeting/feedback text.
- **Session timer**: `requestAnimationFrame` loop shows elapsed time in seconds/minutes.
- **Experience logic**: buttons update a message and also change the default project filter (beginner -> frontend, intermediate -> all, advanced -> fullstack).
- **Projects**: combines filter, sort, search, and show/hide state; renders cards and empty state messaging.
- **Intersection observer**: applies `.visible` to `.fade-in` elements; falls back if unsupported.
- **Contact validation**: required fields, email regex, and minimum message length; per-field error messages and form-level feedback.
- **GitHub API**: fetches `https://api.github.com/users/:username/repos?sort=updated&per_page=6`; handles 404 vs other errors; renders repo cards with stars and updated date.
- **Skills Heatmap (new)**:
  - Data-driven `SKILLS` array with category, strength (1-5), and notes.
  - Controls: focus select and threshold slider; preferences persisted.
  - Renders heatmap cells with strength glyphs and category badge.
  - Keyboard navigation: arrow keys move selection; Enter pins/unpins focus to the active skill's category; selection is highlighted and focused.

## 6) Performance Notes
- Single CSS and JS file; no external dependencies.
- No large assets by default; `assets/images` is prepared for optimized media.
- Intersection observer prevents unnecessary DOM work until items are in view.
- Future improvements: minify assets for production, add `loading="lazy"` to any future `<img>`, compress images.

## 7) Accessibility and UX
- Semantic HTML with clear headings and labels.
- `aria-live` on status/feedback regions; `aria-pressed` on experience buttons; `role="grid"` and `role="gridcell"` on heatmap.
- Keyboard support: form fields, heatmap arrow navigation, Enter to pin focus.
- Clear error copy for validation; visible focus states for inputs and interactive cards.

---
This document captures the current Assignment 4 implementation so reviewers can understand structure, behavior, and design decisions.
