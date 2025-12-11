# AI Usage Report - Assignment 4

This report documents how AI tools supported the development of the Assignment 4 portfolio site.

## Tools Used
- **ChatGPT (Codex CLI / GPT-5 base)** for planning, copy editing, and code iteration.

## Detailed Log
| When | Prompt / Request | AI Output | My Edits | Outcome |
| --- | --- | --- | --- | --- |
| Planning | "Generate a plan to upgrade Assignment 3 portfolio to Assignment 4 with a unique feature and better docs." | Proposed steps (restructure repo, UI polish, add new feature, update docs/deploy). | Selected the skills heatmap concept and adjusted the plan to fit scope/time. | Clear roadmap before coding. |
| UI Copy | "Rewrite hero and section copy without encoding artifacts; keep tone friendly." | Cleaned hero/section text suggestions. | Tweaked phrasing for concision and ASCII-only characters. | Updated `index.html` copy. |
| Feature Design | "Suggest an interactive, unique portfolio feature that is keyboard-friendly." | Options: timeline, skills heatmap, accessibility checker. | Chose heatmap; simplified to slider + focus select + arrow navigation. | Implemented `Skills Heatmap and Focus` section. |
| Code Iteration | "Draft vanilla JS for a skills heatmap grid with keyboard navigation and localStorage persistence." | Provided pseudo-code for state, render function, and key handlers. | Integrated into `js/script.js`, added accessibility roles, and tuned selection behavior. | Working interactive heatmap with persistence. |
| Documentation | "List deployment steps for GitHub Pages and summarize features for README." | Bullet list of deployment instructions and feature summary. | Reworded to match project structure and added AI usage pointer. | Updated `README.md` and docs. |

## How AI Helped
- Accelerated ideation for the unique feature and accessibility considerations.
- Reduced time polishing UI copy and documentation structure.
- Served as a double-check for vanilla JS edge cases (selection bounds, focus management).

## Challenges and Mitigations
- **Encoding issues** from prior assignment copy: rewrote text using ASCII-only to avoid artifacts.
- **Keyboard UX**: simplified AI-suggested grid math to a fixed-step approach for reliability without layout queries.

## Learning Outcomes
- Practiced turning AI-generated ideas into scoped, implementable features.
- Reinforced keyboard navigation patterns and `aria-live`/`role` usage for custom UI.
- Improved discipline around documenting prompts, edits, and final outcomes.
